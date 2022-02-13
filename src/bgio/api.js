import { PutItemCommand, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

// TODO: care about security: 
//          how easy is it to spoof someone's moves
//          db key access severity?
//          *move everything to api*
// <API>
export async function getGame(client, table, gameid) {
    console.log('getting game');
    // TODO: better checks + slugging (?) + security
    if (gameid.length !== 6)
        throw Error("invalid gameid formatting")

    const results = await client.send(new GetItemCommand({
        TableName: table,
        Key: {
            "gameid": {S: gameid}
        }
    }));
    if(!results)
        return undefined;
    return results.Item ? results.Item : undefined;
}

export async function makeGame(client, table, gameid) {
    console.log('making game');
    await client.send(new PutItemCommand({
        TableName: table,
        Item: {
            "gameid": {S: gameid},
            "players": {M: {"w": {S: ""}, "b": {S: ""}}}
        }
    }));
}

export async function updatePlayer(client, table, gameid, token, isBlack) {
    console.log('updating player', table, gameid);
    const game = await getGame(client, table, gameid);
    
    // get the current player if it exists
    const player = isBlack ? game.players.M.b.S : game.players.M.w.S;
    if (player)
        return player; // if the player is already taken, return the player

    await client.send(new UpdateItemCommand({
        TableName: table,
        Key: { 
            "gameid": {S: gameid} 
        },
        ExpressionAttributeValues:{
            ":t": {S: token}
        },
        UpdateExpression: isBlack ? "set players.b = :t" : "set players.w = :t"
    }));
    return token; // otherwise, add the player and return the token
}
// </API>