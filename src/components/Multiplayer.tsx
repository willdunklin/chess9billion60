import React from 'react';
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Chess } from "../bgio/Game";
import { ChessBoard } from "../bgio/Board";
import { useParams, Navigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

import axios from 'axios';

const { protocol, hostname, port } = window.location;
const ChessClient = Client({
    game: Chess,
    board: ChessBoard,
    multiplayer: SocketIO({server: `${protocol}//${hostname}:${process.env.NODE_ENV === "development" ? 8000 : port}`}),
});

const client_style = {
    padding: "1em",
};

async function join(gameid: string | undefined, token: string) {
    if (gameid === undefined)
        throw new Error("gameid is undefined");

    // const response = await axios.post(`http://localhost:8080/game`, {
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
                <ChessClient debug={false} playerID={'spec'} matchID={gameid} />
            </div>
        );

    if (playerID === "invalid") {
        return <Navigate to="/play"/>;
    }
    // return player board
    return (
        <main style={client_style}>
            <ChessClient debug={false} playerID={playerID} matchID={gameid} />
        </main>
    );
}


export const Multiplayer = () => {
    document.title = "Play | Chess9b60";

    const { gameid } = useParams();
    const [ cookies ] = useCookies(['idtoken']);

    const [ loadedSuccessfully, setLoadedSuccessfully ] = React.useState('false');
    const [ content, setContent ] = React.useState(<div></div>)

    React.useEffect(() => {
        // join the multiplayer game
        join(gameid, cookies.idtoken)
            .then(elem => {
                setContent(elem);
                setLoadedSuccessfully('true');
            })
            .catch(e => {
                    console.error(e);
                    setLoadedSuccessfully('error');
            })
    }, [gameid, cookies.idtoken])

    if (gameid === undefined || gameid.length !== 6) {
        return <Navigate to="/404"/>
    }

    if(loadedSuccessfully === 'false')
        return <h1>loading...</h1>;

    return loadedSuccessfully === 'true' ? content : <p>there was an error loading the current game</p>
}
