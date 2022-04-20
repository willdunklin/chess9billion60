import { Link } from 'react-router-dom';
const { Visualizer } = require("./visualizer.js");
const { PieceTypes } = require("../bgio/pieces");
const {Chess} = require("../react-chess/react-chess.js");


const board_style = {
    "width": "100%",
    "height": "100%",
};

function getWidth(){
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    )
}

const boardWidth = "400px"
const visualizerSize = "300"

export const Main = props => {
    let dir = getWidth() < 600 ? "column": "row" 
    return (
        <div style={{display: "flex", justifyContent: "center", padding: "4em"}}>
            <div style={{fontSize: "1.25em"}}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
                    <h2>Welcome to Chess 9,000,000,060</h2>
                    <Link to="/new">Create new game</Link>
                </div>
                <div style={{width: "75%", margin:"auto", alignItems: "center"}}>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "left"}}>
                        < p>
                            Welcome to Chess 9,000,000,060 - like Chess 960 but better since there's more of it. 
                            You and your opponent now must do battle with a randomized back row chosen from 25+ piece types, see sample position below. 
                            Pawns are the same, promotion can be done to any piece you began the game with, and castling is currently not a thing.
                        </p>
                        <div style={{
                        position: "relative",
                        padding: '50px', 
                        width: boardWidth,
                        height: boardWidth}}>
                        <div className="board" style={board_style}>
                            <Chess 
                                pieces={["BZ@a8", "BB@b8", "BK@c8", "BM2@d8", "BR2@e8", "BBM@f8", "BNR@g8", "BU@h8",
                                        "BP@a7", "BP@b7", "BP@c7", "BP@d7","BP@e7","BP@f7","BP@g7","BP@h7",
                                        "WP@a2", "WP@b2", "WP@c2", "WP@d2","WP@e2","WP@f2","WP@g2","WP@h2",
                                        "WZ@a1", "WB@b1", "WK@c1", "WM2@d1", "WR2@e1", "WBM@f1", "WNR@g1", "WU@h1",
                            ]}
                                drawLabels = {false}
                                allowMoves = {false}
                                onClickPiece = {() => {}}
                                onDragStart = {() => {}}
                                onMovePiece = {() => {}}
                            />
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: {dir}, alignItems: "center", textAlign: "right"}}>
                        < p>
                            Each piece in the game is built from a number of “atoms”. 
                            To the right you see a wazir, the atom underlying the classical rook piece. 
                            Its basic move is a single square along a row or column, whereas the rook is able to slide arbitrary distances in these directions.
                        </p>
                        <Visualizer 
                            key={`$W-main-visualizer`}
                            piece={"W"} 
                            color={"W"}
                            count={7}
                            size = {visualizerSize}
                            />
                    </div>
                        < p>
                            Some new atoms which may be unfamiliar are the Mann, Camel, and Zebra. Try dragging them around to see how the dots change!
                        </p>
                        
                        <div style={{display: "flex", flexDirection: {dir}, alignItems: "center", textAlign: "center"}}>
                        <Visualizer 
                            key={`$M-main-visualizer`}
                            piece={"M"} 
                            color={"W"}
                            count={7}
                            size = {visualizerSize}
                            />
                        <Visualizer 
                            key={`$C-main-visualizer`}
                            piece={"C"} 
                            color={"W"}
                            count={7}
                            size = {visualizerSize}
                            />
                        <Visualizer 
                            key={`$Z-main-visualizer`}
                            piece={"Z"} 
                            color={"W"}
                            count={7}
                            size = {visualizerSize}
                            />
                        </div>
                        <div style={{display: "flex", flexDirection: {dir}, alignItems: "center", textAlign: "left"}}>
                    
                        <Visualizer 
                            key={`$NR-main-visualizer`} // fixes bug when promPieces changes
                            piece={"NR"} 
                            color={"W"}
                            count={7} // TODO this is a stupid name for this or a stupid way of doing this
                            size = {visualizerSize}
                            />
                        < p>
                            A new surprising piece is the Knightrider, which is to the Knight as the Rook is to the Wazir. 
                            It can jump pieces in the same sense that the classical Knight can, but it cannot move through a dotted square if that square is occupied.
                        </p>
                        </div>
                        < p>
                            More pieces arise from combining basic pieces. 
                            For example, a Queen has the same moves as a combination of Rook and a Bishop. 
                            Similarly, the Centaur is a combination of a Knight and a Mann.
                        </p>
                        <Visualizer 
                            key={`$CN-main-visualizer`} // fixes bug when promPieces changes
                            piece={"CN"} 
                            color={"W"}
                            count={7} // TODO this is a stupid name for this or a stupid way of doing this
                            size = {visualizerSize}
                            />
                        < p>
                            Note that some pieces may move with limited scope, for example the Short Rook moves like a rook, but only up to four squares. 
                        </p>
                        <Visualizer 
                            key={`$R2-main-visualizer`} // fixes bug when promPieces changes
                            piece={"R2"} 
                            color={"W"}
                            count={7} // TODO this is a stupid name for this or a stupid way of doing this
                            size = {visualizerSize}
                            />
                        < p>
                            Visit our piece zoo to check out all currently available pieces. 
                            If you want to just dive into playing we've made sure to always draw dots and provide you with piece visualizers under your board to play with in case you forget how a piece moves. 
                        </p>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
                        <Link to="/zoo">Visit the Zoo</Link>
                    </div>
                </div>
            </div>
        </div>
        
    );
}