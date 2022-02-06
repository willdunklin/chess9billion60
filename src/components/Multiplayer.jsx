import React, { useState } from 'react';
import Modal from 'react-modal';
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Chess } from "../bgio/Game";
import { ChessBoard } from "../bgio/Board";
import { useParams, Link } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import '../css/modal.css';

const { protocol, hostname, port } = window.location;
const ChessClient = Client({
    game: Chess,
    board: ChessBoard,
    multiplayer: SocketIO({server: `${protocol}//${hostname}:${process.env.NODE_ENV === "development" ? 8000 : port}`}),
    // debug: false,
});

const client_style = {
    padding: "1em",
};

const dbclient = new DynamoDBClient({ region: 'us-east-2', credentials: require("../bgio/creds").creds});
const tableName = "games";

// TODO: care about security: 
//          how easy is it to spoof someone's moves
//          db key access severity?
//          *move everything to api*
// <API>
async function getGame(gameid) {
    console.log('getting game');
    // TODO: better checks + slugging (?) + security
    if (gameid.length !== 6)
        throw Error("invalid gameid formatting")

    const results = await dbclient.send(new GetItemCommand({
        TableName: tableName,
        Key: {
            "gameid": {S: gameid}
        }
    }));
    if(!results)
        return undefined;
    return results.Item ? results.Item : undefined;
}

async function makeGame(gameid) {
    console.log('making game');
    await dbclient.send(new PutItemCommand({
        TableName: tableName,
        Item: {
            "gameid": {S: gameid},
            "players": {M: {"w": {S: ""}, "b": {S: ""}}}
        }
    }));
}

async function updatePlayer(gameid, token, isBlack) {
    console.log('updating player');
    const game = await getGame(gameid);
    
    // get the current player if it exists
    const player = isBlack ? game.players.M.b.S : game.players.M.w.S;
    if (player)
        return player; // if the player is already taken, return the player

    await dbclient.send(new UpdateItemCommand({
        TableName: tableName,
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

async function choosePlayer(gameid, token, game) {
    console.log('choosing player');
    // TODO: check if token is valid

    const white = game.players.M.w.S;
    const black = game.players.M.b.S;
    
    let player = null;

    // if the user is one of the players, add them appropriately
    if(white === token)
        return "0";
    if(black === token)
        return "1";

    // if both players are taken, return null
    console.log('white+black:', white, black);
    if(white !== "" && black !== "")
        return player;

    if(white !== "") {         // if white is taken
        if(await updatePlayer(gameid, token, true) !== token)  // make the player black
            return null; // if the player is already taken, make them spectator
        player = "1";

    } else if (black !== "") { // if black is taken
        if(await updatePlayer(gameid, token, false) !== token) // make the player white
            return null; // if the player is already taken, make them spectator
        player = "0";

    } else {  // neither player is taken, let the user choose which player they want to be
        return [gameid, token];
    }

    return player;
}
// </API>

const PlayerChoice = props => {
    const { gameid, token } = props;
    const [isOpen, setIsOpen] = useState(true);
    const [isWhite, setIsWhite] = useState("0");
    const [time, setTime] = useState(600);
    const [increment, setIncrement] = useState(10);
    const [spectator, setSpectator] = useState(false);

    const [ cookies, setCookie ] = useCookies(['user']);

    async function start_game() {
        if(await updatePlayer(gameid, token, isWhite === "1") !== token)
            setSpectator(true);
        else {
            // TODO: set the time and increment  
        }
        setIsOpen(false);
    }
    function close() {
        setIsOpen(false);
    }

    Modal.setAppElement("#root");

    return (
        <div>
            <Modal isOpen={isOpen} onRequestClose={() => {}}>
                <h3>Game settings</h3>
                <div>
                    <p>Color: </p>
                    <div>
                        <button onClick={() => {setIsWhite("0")}} className={isWhite === "0" ? "buttonHighlight" : ""}>White</button>
                        <button onClick={() => {setIsWhite("1")}} className={isWhite === "1" ? "buttonHighlight" : ""}>Black</button>
                        <button onClick={() => {setIsWhite(Math.random() > 0.5 ? "0" : "1")}}>Random</button>
                    </div>
                </div>
                <div>
                    <p>Start time: </p>
                    <input type="text" defaultValue={time} onChange={event => {
                        setTime(event.target.value);
                    }}/>
                </div>
                <div>
                    <p>Increment: </p>
                    <input type="text" defaultValue={increment} onChange={event => {
                        setIncrement(event.target.value);
                    }}/>
                </div>
                <div className="links">
                    <Link to="" onClick={start_game}>Start</Link>
                    <Link to="/" onClick={close}>Cancel</Link>
                </div>
            </Modal>
            <div style={client_style}>
                <ChessClient debug={false} playerID={isWhite} matchID={gameid} spectator={spectator} />
            </div>
        </div>
    )
}

async function join(gameid, token) {
    // if the game doesn't exist, create one
    let game = await getGame(gameid);

    // if the game doens't exist, make one
    if(!game) {
        await makeGame(gameid);

        // set game object to be blank
        game = {"gameid": {S: gameid}, "players": {M: {b: {S: ""}, w: {S: ""}}}}
    }

    let playerID = await choosePlayer(gameid, token, game);
    console.log('chosen player id:', playerID);

    if (playerID === null) // player is a spectator
        return (
            <div style={client_style}>
                <ChessClient debug={false} playerID={'0'} matchID={gameid} spectator={true} />
            </div>
        );

    if (playerID.length === 2) // player is choosing which player they are
        return (
            <div style={client_style}>
                <PlayerChoice gameid={playerID[0]} token={playerID[1]}/>
                {/* <ChessClient debug={false} playerID={'0'} matchID={gameid} spectator={true} /> */}
            </div>
        );

    // return player board
    return (
        <div style={client_style}>
            <ChessClient debug={false} playerID={playerID} matchID={gameid} spectator={false} />
        </div>
    );
}


export const Multiplayer = props => {
    const { gameid } = useParams();
    const [ cookies ] = useCookies(['user']);

    const [ loadedSuccessfully, setLoadedSuccessfully ] = React.useState(null);
    const [ content, setContent ] = React.useState(<div></div>)

    React.useEffect(() => {
        console.log('running join')
        // join the multiplayer game
        join(gameid, cookies.idtoken)
            .then(elem => {
                setContent(elem);
                setLoadedSuccessfully(true);
            })
            .catch(e => {
                    console.error('eror!', e);
                    setLoadedSuccessfully(false);
            })
    }, [gameid, cookies.idtoken])

    // TODO: add stronger clientside checks
    // if the gameid is invalidly formatted, draw an error
    if (gameid.length !== 6) { // also checked in getGame fyi
        return <p>error, gameid should be 6 chars</p>;
    }

    
    // TODO: switch to API(?) instead of direct db access in this element
    if(loadedSuccessfully === null)
        return <h1>loading...</h1>;

    return loadedSuccessfully ? content : <p>there was an error in loading, probably from the database (idk)</p>
}