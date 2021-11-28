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

const App = () => (
    <div>
        <ChessClient playerID="0"/>
        <br/>
        <ChessClient playerID="1"/>
    </div>
);

export default App;