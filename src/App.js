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
    "justify-content": "start",
    "align-items": "center",
    "height": "400px",
}

const App = () => (
    <div style={s}>
        <ChessClient playerID="0"/>
        <ChessClient playerID="1"/>
    </div>
);

export default App;