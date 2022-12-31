import { Async } from 'boardgame.io/internal';
import { LogEntry, Server, State, StorageAPI } from 'boardgame.io';
import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand, GetItemCommandOutput, ScanCommand, AttributeValue } from "@aws-sdk/client-dynamodb";
import { Credentials } from "@aws-sdk/types";


// Thanks to https://github.com/janKir/bgio-postgres

/**
 * Datatype for database entry, basically encapulates StorageAPI.FetchFields
 */
interface Match extends Server.MatchData {
    // state
    state: State;
    initialState: State;
    // log
    log: LogEntry[];
}

export class DynamnoStore extends Async {
    private client: DynamoDBClient;
    private tableName: string;

    constructor(region: string, creds: Credentials, tableName: string) {
      super();
      this.client = new DynamoDBClient({region: region, credentials: creds});
      this.tableName = tableName;
    }


    /**
     * Convert the database get result to the Match format
     * @param result GetItemCommandOutput from GetItemCommand
     * @returns Match
     */
    matchify(item?: {[key: string]: AttributeValue}): Match | null {
        if(!item)
            return null;

        // TODO: the (x?.S ? x.S : null) pattern is spooky
        const match: Match = {
            gameName: item.gameName?.S ? item.gameName.S : "",
            players: JSON.parse(item.players?.S ? item.players.S: "null"),
            setupData: JSON.parse(item.setupData?.S ? item.setupData.S : "null"),
            gameover: JSON.parse(item.gameover?.S ? item.gameover.S : "null"),
            nextMatchID: item.nextMatchID?.S ? item.nextMatchID.S : "",
            unlisted: item.unlisted?.BOOL ? item.unlisted.BOOL : false,
            createdAt: JSON.parse(item.createdAt?.N ? item.createdAt.N : "null"),
            updatedAt: JSON.parse(item.updatedAt?.N ? item.updatedAt.N : "null"),

            state: JSON.parse(item.state?.S ? item.state.S : "null"),
            initialState: JSON.parse(item.initialState?.S ? item.initialState.S : "null"),
            log: JSON.parse(item.log?.S ? item.log.S : "null"),
        };
        return match;
    }

    /**
     * Connect.
     */
    async connect(): Promise<void> {
        return;
    }

    /**
     * Create a new match.
     *
     * This might just need to call setState and setMetadata in
     * most implementations.
     *
     * However, it exists as a separate call so that the
     * implementation can provision things differently when
     * a match is created.  For example, it might stow away the
     * initial match state in a separate field for easier retrieval.
     */
    /* istanbul ignore next */
    async createMatch(id: string, {
        initialState,
        metadata: {
            gameName,
            players,
            setupData,
            gameover,
            nextMatchID,
            unlisted,
        },
    }: StorageAPI.CreateMatchOpts): Promise<void> {
        const content: { [key: string]: AttributeValue } = {
            id: {S: id},
            gameName: {S: gameName},
            players: {S: JSON.stringify(players)},
            setupData: {S: JSON.stringify(setupData) || ""},
            gameover: {S: JSON.stringify(gameover) || ""},
            nextMatchID: {S: nextMatchID || ""},
            unlisted: {BOOL: unlisted !== undefined ? unlisted : false},
            state: {S: JSON.stringify(initialState)},
            initialState: {S: JSON.stringify(initialState)},
            log: {S: JSON.stringify([])},
        }
        await this.client.send(new PutItemCommand({
            Item: content,
            TableName: this.tableName,
        }));
    }

    /**
     * Create a new game.
     *
     * This might just need to call setState and setMetadata in
     * most implementations.
     *
     * However, it exists as a separate call so that the
     * implementation can provision things differently when
     * a game is created.  For example, it might stow away the
     * initial game state in a separate field for easier retrieval.
     *
     * @deprecated Use createMatch instead, if implemented
     */
    async createGame(matchID: string, opts: StorageAPI.CreateGameOpts): Promise<void> {
        return this.createMatch(matchID, opts);
    }

    /**
     * Update the game state.
     *
     * If passed a deltalog array, setState should append its contents to the
     * existing log for this game.
     */
    async setState(
      id: string,
      state: State,
      deltalog?: LogEntry[]
    ): Promise<void> {
        const item = await this.client.send(new GetItemCommand({
            Key: {
                "id": {S: id}
            },
            TableName: this.tableName,
        }));

        const match: Match | null = this.matchify(item?.Item);

        const prevState: State | undefined = match?.state;
        const prevLog: LogEntry[] | undefined = match?.log;

        if(!prevState || prevState._stateID < state._stateID) {
            await this.client.send(new UpdateItemCommand({
                Key: {
                    "id": {S: id}
                },
                UpdateExpression: "set #state=:state, #log=:log",
                ExpressionAttributeValues: {
                    ":state": {S: JSON.stringify(state)},
                    ":log": {S: JSON.stringify([...(prevLog ?? []), ...(deltalog ?? [])])},
                },
                ExpressionAttributeNames: {
                    "#state": "state",
                    "#log": "log",
                },
                TableName: this.tableName,
            }));
        }
    }

    /**
     * Update the game metadata.
     */
    async setMetadata(
      id: string,
      {
          gameName,
          players,
          gameover,
          nextMatchID,
          unlisted,
          createdAt,
          updatedAt,
      }: Server.MatchData
    ): Promise<void> {
        await this.client.send(new UpdateItemCommand({
            Key: {
                "id": {S: id}
            },
            UpdateExpression: "set gameName=:gameName, players=:players, gameover=:gameover, nextMatchID=:nextMatchID, unlisted=:unlisted, createdAt=:createdAt, updatedAt=:updatedAt",
            ExpressionAttributeValues: {
                ":gameName": {S: gameName},
                ":players": {S: JSON.stringify(players)},
                ":gameover": {S: JSON.stringify(gameover)},
                ":nextMatchID": {S: nextMatchID ? nextMatchID : ""},
                ":unlisted": {BOOL: unlisted !== undefined ? unlisted : false},
                ":createdAt": {N: JSON.stringify(createdAt || Date.now())},
                ":updatedAt": {N: JSON.stringify(updatedAt || Date.now())},
            },
            TableName: this.tableName,
        }));
    }

    /**
     * Fetch the game state.
     */
    async fetch<O extends StorageAPI.FetchOpts>(
      id: string,
      { state, log, metadata, initialState }: O
    ): Promise<StorageAPI.FetchResult<O>> {
        const result = {} as StorageAPI.FetchFields;
        const item: GetItemCommandOutput = await this.client.send(new GetItemCommand({
            Key: {
                "id": {S: id}
            },
            TableName: this.tableName,
        }));

        const match: Match | null = this.matchify(item?.Item);

        if (!match) {
            return result;
        }

        if (metadata) {
            result.metadata = {
                gameName: match.gameName,
                players: match.players,
                setupData: match.setupData,
                gameover: match.gameover,
                nextMatchID: match.nextMatchID,
                unlisted: match.unlisted,
                createdAt: match.createdAt,
                updatedAt: match.updatedAt,
            };
        }
        if (initialState) {
            result.initialState = match.initialState;
        }
        if (state) {
            result.state = match.state!;
        }
        if (log) {
            result.log = match.log;
        }

        return result as StorageAPI.FetchResult<O>;
    }

    /**
     * Remove the game state.
     */
    async wipe(id: string): Promise<void> {
        await this.client.send(new DeleteItemCommand({
            Key: {
                "id": {S: id}
            },
            TableName: this.tableName,
        }));
    }

    /**
     * Return all matches.
     */
    /* istanbul ignore next */
    async listMatches(opts?: StorageAPI.ListMatchesOpts): Promise<string[]> {
        const addFilter = (s: string, f: string) => s ? s + " AND " + f : f;

        let filter = "";
        let attributeValues: {[key: string]: AttributeValue} = {};

        if (opts !== undefined) {
            if(opts.gameName) {
                filter = addFilter(filter, "gameName = :gameName");
                attributeValues[":gameName"] = {S: opts.gameName};
            }
            if(opts.where !== undefined) {
                if(opts.where.isGameover === true) {
                    filter = addFilter(filter, "gameover <> :null");
                    attributeValues[":null"] = {S: JSON.stringify(null)};
                }
                if(opts.where.isGameover === false) {
                    filter = addFilter(filter, "gameover = :null");
                    attributeValues[":null"] = {S: JSON.stringify(null)};
                }

                if(opts.where.updatedBefore !== undefined) {
                    filter = addFilter(filter, "updatedAt < :updatedBefore")
                    attributeValues[":updatedBefore"] = {N: JSON.stringify(opts.where.updatedBefore)};
                }
                if(opts.where.updatedAfter !== undefined) {
                    filter = addFilter(filter, "updatedAt > :updatedAfter")
                    attributeValues[":updatedAfter"] = {N: JSON.stringify(opts.where.updatedAfter)};
                }
            }
        }

        const results = await this.client.send(new ScanCommand({
            FilterExpression:          filter === "" ? undefined : filter,
            ExpressionAttributeValues: filter === "" ? undefined : attributeValues,
            TableName: this.tableName,
        }));

        if (results.Items === undefined)
            return [];

        return results.Items.map(i => i.id.S || "") || [];
    }

    /**
     * Return all games.
     *
     * @deprecated Use listMatches instead, if implemented
     */
    async listGames?(opts?: StorageAPI.ListGamesOpts): Promise<string[]> {
        return this.listMatches(opts);
    }
}
