import React from "react";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Chess } from "./Game";
import { ChessBoard } from "./Board";

const ChessClient = Client({
    game: Chess,
    board: ChessBoard,
    multiplayer: SocketIO({server: "localhost:8000"})
});

const s = {
    "display": "flex",
    "flex-direction": "row",
    "justify-content": "center",
    "align-items": "center",
    "height": "400px",
}

const client_style = {
    "padding": "2em",
}

const App = () => (
    <div style={s}>
        <div style={client_style}>
            <ChessClient playerID="0"/>
        </div>
        <div style={client_style}>
            <ChessClient playerID="1"/>
        </div>
    </div>
);

export default App;