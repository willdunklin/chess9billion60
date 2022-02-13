import React from 'react';
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Chess } from "../bgio/Game";
import { ChessBoard } from "../bgio/Board";
import { useParams, Navigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getGame, updatePlayer, makeGame } from "../bgio/api";

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

// <API>
async function assignPlayerID(gameid, token, game) {
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

    if(white !== "") {          // if white is taken
        if(await updatePlayer(dbclient, tableName, gameid, token, true) !== token)  // make the player black
            return null; // if the player is already taken, make them spectator
        player = "1";

    } else if (black !== "") {  // if black is taken
        if(await updatePlayer(dbclient, tableName, gameid, token, false) !== token) // make the player white
            return null; // if the player is already taken, make them spectator
        player = "0";
    } else {
        return "invalid";
    }

    return player;
}
// </API>


async function join(gameid, token) {
    // if the game doesn't exist, create one
    let game = await getGame(dbclient, tableName, gameid);

    // if the game doens't exist, make one
    if(!game) {
        await makeGame(dbclient, tableName, gameid);

        // set game object to be blank
        game = {"gameid": {S: gameid}, "players": {M: {b: {S: ""}, w: {S: ""}}}}
    }

    let playerID = await assignPlayerID(gameid, token, game);
    console.log('chosen player id:', playerID);

    if (playerID === null) // player is a spectator
        return (
            <div style={client_style}>
                <ChessClient debug={false} playerID={'0'} matchID={gameid} spectator={true} />
            </div>
        );

    if (playerID === "invalid")
        return <Navigate to="/new"/>;

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