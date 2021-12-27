import React from "react";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Chess } from "./Game";
import { ChessBoard } from "./Board";

const ChessClient = Client({
    game: Chess,
    board: ChessBoard,
    multiplayer: SocketIO({server: "localhost:8000"})
    // multiplayer: SocketIO({server: "35.223.213.73:42069"})
});

const s = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "400px",
}

const client_style = {
    padding: "4em",
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