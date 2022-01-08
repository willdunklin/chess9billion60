import React from 'react';
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Chess } from "../Game";
import { ChessBoard } from "../Board";
import { useParams } from 'react-router-dom';


const { protocol, hostname, port } = window.location;
const ChessClient = Client({
    game: Chess,
    board: ChessBoard,
    multiplayer: SocketIO({server: `${protocol}//${hostname}:${5000 /*port*/}`}),
    // debug: false,
});

const client_style = {
    padding: "1em",
};

export const Multiplayer = props => {
    const { playerid, gameid } = useParams();

    if (!(playerid === '0' || playerid === '1')) {
        return (
          <div>
            <p>Invalid playerID</p>
            <p>Must be 0 (white) or 1 (black)</p>
          </div>
        );
    }
    // TODO: check for valid gameid too

    return (
        <div style={client_style}>
            <ChessClient debug={false} playerID={playerid} matchID={gameid} spectator={false} />
        </div>
    );
}

export const Spectator = props => {
    const { gameid } = useParams();
    let whitePerspective = true;

    return (
        <div style={client_style}>
            {/* TODO: make playerID dynamically flip if */}
            <ChessClient debug={true} playerID={whitePerspective ? '0' : '1'} matchID={gameid} spectator={true} />
        </div>
    );
}