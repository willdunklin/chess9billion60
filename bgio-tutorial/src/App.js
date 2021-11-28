import React from "react";
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
// import { SocketIO } from "boardgame.io/multiplayer";
import { TicTacToe } from "./Game";
import { TicTacToeBoard } from "./Board";

const TicTacToeClient = Client({ 
    game: TicTacToe,
    board: TicTacToeBoard,
    multiplayer: Local(),
    // multiplayer: SocketIO({server: "localhost:8000"}),
});

const App = () => (
    <div>
        <TicTacToeClient playerID="0"/>
        <TicTacToeClient playerID="1"/>
    </div>
);

export default App;