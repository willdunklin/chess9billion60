import React from 'react';
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Chess } from "../bgio/Game";
import { ChessBoard } from "../bgio/Board";
import { useParams, Navigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

const axios = require('axios');

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

async function join(gameid, token) {
    const response = await axios.post(`https://chess9b60-api.herokuapp.com/game`, {
        id: gameid,
        token: token
    });

    if (response.status === 404)
        return <Navigate to="/404"/>;
    else if (response.status !== 200 || response.data === undefined)
        return <Navigate to="/error"/>;

    const playerID = response.data;
    
    if (playerID === null) // player is a spectator
        return (
            <div style={client_style}>
                <ChessClient debug={false} playerID={'0'} matchID={gameid} spectator={true} />
            </div>
        );

    if (playerID === "invalid") {
        return <Navigate to="/new"/>;
    }
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