import React from "react";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { Chess } from "./Game";
import { ChessBoard } from "./Board";
import { Visualizer } from "./visualizer.js";
const PieceTypes = require("./pieces.js");

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
    // height: "400px",
}

const s1 = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // height: "400px",
}

const client_style = {
    padding: "4em",
}

//Making the piece visualizer
let visualizers = []
let pieces = ["Q","A","ZC","CNR","W"]
for (let i = 0; i < pieces.length; i++) {
    visualizers.push(<Visualizer piece = {pieces[i]}/>)
}
visualizers.push(<Visualizer piece = "K"/>)


const App = () => (
    <div style={s1}>
        <div style={s}>
            <div style={client_style}>
                <ChessClient playerID="0"/>
            </div>
            <div style={client_style}>
                <ChessClient playerID="1"/>
            </div>
        </div>
        <div style={s}>{visualizers}</div>
        
    </div>
);

export default App;