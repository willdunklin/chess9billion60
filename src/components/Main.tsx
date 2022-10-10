import { Link } from 'react-router-dom';
import { Visualizer } from "./visualizer";
import { Chess } from "../react-chess/react-chess";

const board_style = {
    "width": "100%",
    "height": "100%",
};

const boardWidth = "400px";
const visualizerSize = 300;

export const Main = () => {
    document.title = "Chess 9,000,000,060 | Chess9b60 Variant";

    return (
        <div style={{display: "flex", justifyContent: "center", padding: "4em"}}>
            <div className="main-page">
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
                    <h1>Chess 9,000,000,060</h1>
                    {/* <Link className="link" to="/play">Create new game</Link> */}
                </div>
                <div className="main-content">
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "left"}}>
                        <p style={{marginBottom: '0', fontSize: '1.25em'}}>
                            Welcome to <b>Chess 9,000,000,060</b> - like <a href="https://en.wikipedia.org/wiki/Fischer_random_chess" target="_blank" rel="noopener noreferrer">Chess 960</a> but better since there's more of it.
                        </p>
                        <br></br>
                        <p>
                            Battle with a randomized back row chosen from <i>25+ piece types</i>, see sample position below:
                        </p>
                        <div className='content-list' style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <div style={{width: '20px'}}></div>
                            <div style={{
                                position: "relative",
                                padding: '1px',
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
                            <ul className='resize-width-1' style={{fontSize: '1.1em'}}>
                                <li>Pawns are the same</li>
                                <li>Promotion can be done to any piece you began the game with</li>
                                <li>Castling is currently not a thing</li>
                            </ul>
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div className='content-list' style={{display: "flex", justifyContent: 'center', textAlign: "left"}}>
                            <div className='resize-width-2' style={{width: '40%', padding: '0.4em'}}>
                                <p style={{fontWeight: '500', fontSize: '1.1em'}}>Each piece in the game is built from a number of <i>“atoms”</i></p>
                                <p>To the right you see a Wazir, the atom underlying the classical rook piece</p>
                                <p>Its basic move is a single square along a row or column <i>(the rook is able to slide arbitrary distances in these directions)</i></p>
                            </div>
                            <Visualizer
                                key={`$W-main-visualizer`}
                                piece={"W"}
                                color={"W"}
                                count={7}
                                size={visualizerSize}
                                />
                        </div>
                        {/* <br></br> */}
                        <p className="resize-width-2" style={{width: '70%', fontSize: '1.1em'}}>
                            Some new <i>atoms</i> which may be unfamiliar are the <i>Mann</i>, <i>Camel</i>, and <i>Zebra</i>. Try dragging them around to see how the dots change!
                        </p>

                        <div className='content-list' style={{display: "flex", alignItems: "center", textAlign: "center"}}>
                            <Visualizer
                                key={`$M-main-visualizer`}
                                piece={"M"}
                                color={"W"}
                                count={7}
                                size={visualizerSize}
                                />
                            <Visualizer
                                key={`$C-main-visualizer`}
                                piece={"C"}
                                color={"W"}
                                count={7}
                                size={visualizerSize}
                                />
                            <Visualizer
                                key={`$Z-main-visualizer`}
                                piece={"Z"}
                                color={"W"}
                                count={7}
                                size={visualizerSize}
                                />
                        </div>

                        {/* <br></br> */}
                        <div>
                            <p style={{fontSize: '1.15em', marginBottom: '0.5em'}}>A surprising new piece is the <b><i>Knightrider:</i></b></p>
                        </div>
                        <div className='content-list' style={{display: "flex", justifyContent: 'center', textAlign: "left"}}>
                            <Visualizer
                                key={`$NR-main-visualizer`} // fixes bug when promPieces changes
                                piece={"NR"}
                                color={"W"}
                                count={7} // TODO this is a stupid name for this or a stupid way of doing this
                                size={visualizerSize}
                                />
                            <div className="resize-width-2" style={{width: '50%', padding: '1em'}}>
                                <p>The <i>Knightrider</i> is to the Knight as the Rook is to the Wazir.</p>
                                <ul>
                                    <li style={{padding: 0}}><p>In the same way Rooks repeat Wazir moves, Knightriders repeat Knight moves</p></li>
                                </ul>
                                <p>Jumps the same way the classical Knight does, <b><i>however</i></b>, it cannot jump over a piece occupying a dotted square.</p>
                            </div>
                        </div>

                        {/* <br></br> */}
                        <div className="resize-width-2" style={{width: '70%'}}>
                            <h3 style={{textAlign: 'center'}}>Piece Combinations</h3>
                            <p>
                                More pieces arise from combining basic pieces.
                                For example, a <b>Queen</b> has the same moves as a combination of a <i>Rook</i> and a <i>Bishop</i>.
                                Similarly, the new <b>Centaur</b> is a combination of a <i>Knight</i> and a <i>Mann</i>.
                            </p>
                        </div>
                        <Visualizer
                            key={`$CN-main-visualizer`} // fixes bug when promPieces changes
                            piece={"CN"}
                            color={"W"}
                            count={7} // TODO this is a stupid name for this or a stupid way of doing this
                            size={visualizerSize}
                            />

                        <br></br>

                        <div className="resize-width-2" style={{width: '70%'}}>
                            <h3 style={{textAlign: 'center'}}>More Pieces</h3>

                            < p>
                                Note that some pieces may move with limited scope, for example the Short Rook moves like a rook, but only up to two squares.
                            </p>
                        </div>

                        <Visualizer
                            key={`$R2-main-visualizer`} // fixes bug when promPieces changes
                            piece={"R2"}
                            color={"W"}
                            count={7} // TODO this is a stupid name for this or a stupid way of doing this
                            size = {visualizerSize}
                            />

                        {/* <br></br> */}
                        <div className="resize-width-2" style={{width: '80%'}}>
                            <p style={{textAlign: 'center', fontSize: '1.2em'}}>
                                Visit our piece zoo to check out all currently available pieces.
                            </p>
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", margin: 0, padding: 0, fontSize: '0.9em'}}>
                                <Link className="link" to="/zoo">Visit the Zoo</Link>
                            </div>
                            <p>
                                If you want to just dive into playing we've made sure to always draw dots and provide you with piece visualizers under your board to play with in case you forget how a piece moves.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
