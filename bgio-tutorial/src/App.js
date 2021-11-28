import React from "react";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { TicTacToe } from "./Game";
import { TicTacToeBoard } from "./Board";

const TicTacToeClient = Client({ 
    game: TicTacToe,
    board: TicTacToeBoard,
    multiplayer: SocketIO({server: "localhost:8000"}),
});

const App = () => (
    <div>
        <TicTacToeClient playerID="0" matchID="match-id2"/>
        <TicTacToeClient playerID="1" matchID="match-id2"/>
    </div>
);

export default App;