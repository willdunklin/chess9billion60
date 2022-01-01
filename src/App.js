import React from "react";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Chess } from "./Game";
import { ChessBoard } from "./Board";
const PieceTypes = require("./pieces.js");

const ChessClient = Client({
    game: Chess,
    board: ChessBoard,
    multiplayer: SocketIO({server: "localhost:8000"})
    // multiplayer: SocketIO({server: "35.223.213.73:42069"})
});



//visualizers.push(<Visualizer piece = "K"/>)

//TODO center these again
const App = () => (
    <div>
        <ChessClient playerID="0"/>
        <ChessClient playerID="1"/>
    </div>
);

export default App;