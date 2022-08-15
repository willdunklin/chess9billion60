import CSS from 'csstype';
// import { Timer } from "../components/timer";
// import { move, capture, end } from "./sound";
// import { PieceTypes } from "./pieces";
// import type { BoardProps } from 'boardgame.io/react';
// import type { GameState } from './Game';
// const React = require("react");
// const { Visualizer } = require("../components/visualizer");
// const { Chess } = require("../react-chess/react-chess");
// const { validMove } = require("./logic");
// const { pieceComponents } = require('../react-chess/chessPieces');
// const { charCodeOffset } = require("../react-chess/decode");
// let wImbalance = [];
// let bImbalance = [];

// function getSize() {
//     return Math.min(window.innerWidth - 50, window.innerHeight - 170);
// }

// const visualizerStyles: CSS.Properties = {
//     paddingTop: "50px",
//     display: "flex",
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     alignItems: "center",
// };

// const boardContainerStyles: CSS.Properties = {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
// };

// const s1: CSS.Properties = {
//     display: "flex",
//     flexDirection: "column",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     alignItems: "center",
// };

// const board_style: CSS.Properties = {
//     "width": "100%",
//     "height": "100%",
// };

// const result_style: CSS.Properties = {
//     position: "absolute",
//     top: "36px",
//     left: "0",

//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: "1",
//     backgroundColor: "#eee9",
//     userSelect: "none",
//     pointerEvents: "none"
// };

// const buttonStyles: CSS.Properties = {
//     backgroundColor: "#222222",
//     border: "3px solid black",
//     color: "white",
//     textAlign: "center",
//     fontSize: "16px"
// };

// interface ChessBoardProps extends BoardProps<GameState> {
// }

// interface ChessBoardState {
//     pieces: (string | null)[];
//     update: number;
//     highlights: string[];
//     dots: string[];
//     wTime: number;
//     bTime: number;
//     boardWidth: number;
//     historyIndex: number;
//     lastClickedPiece: string;
// }

// export class ChessBoard extends React.Component<ChessBoardProps, ChessBoardState> {
//     constructor(props: ChessBoardProps) {
//         super(props);

//         document.body.style.overflowY = "scroll";

//         this.state = {
//             pieces: this.piecify(this.props.G.history[0]),
//             update: 0,
//             highlights: [],
//             dots: [],
//             wTime: this.props.G.wTime,
//             bTime: this.props.G.bTime,
//             boardWidth: getSize(),
//             historyIndex: 0,
//             lastClickedPiece: "",
//         };

//         this.onMovePiece = this.onMovePiece.bind(this);
//         this.onDragStart = this.onDragStart.bind(this);
//         this.onClickPiece = this.onClickPiece.bind(this);

//         this.handleResize = this.handleResize.bind(this);
//         this.backHistoryButton = this.backHistoryButton.bind(this);
//         this.forwardHistoryButton = this.forwardHistoryButton.bind(this);
//         this.startHistoryButton = this.startHistoryButton.bind(this);
//         this.endHistoryButton = this.endHistoryButton.bind(this);
//         this.handleScroll = this.handleScroll.bind(this);
//         this.handleKey = this.handleKey.bind(this);

//         this.updateBoard = this.updateBoard.bind(this);
//         this.piecify = this.piecify.bind(this);

//         // timer stuff
//         this.timer = 0;
//         this.decrementTimer = this.decrementTimer.bind(this);
//         this.dec_amt = 100; // 10ms

//         this.current_length = 0;
//         this.curr_promotablePieces = [];
//         this.gameover = false;

//         window.addEventListener('resize', this.handleResize);

//         window.addEventListener('keydown', this.handleKey);
//     }

//     handleMouseEnterBoard() {
//         const top = document.documentElement.scrollTop;
//         document.body.style.position = "fixed";
//         document.body.style.top = -top + "px";
//     }

//     handleMouseExitBoard() {
//         let top = document.body.style.top;
//         top = ""+Math.abs(Number(top.substring(0, top.length - 2)));
//         document.body.style.position = "static";
//         document.documentElement.scrollTo(0,Number(top));
//     }

//     handleScroll = (e:any) => {
//         if (e.nativeEvent.wheelDelta > 0) {
//             this.forwardHistoryButton();
//         } else {
//             this.backHistoryButton();
//         }
//     }

//     handleResize() {
//         this.setState({
//             boardWidth: getSize()
//         });
//     }

//     handleKey(event: KeyboardEvent) {
//         switch(event.key) {
//             case "ArrowLeft":
//                 this.backHistoryButton();
//                 event.preventDefault();
//                 break;
//             case "ArrowRight":
//                 this.forwardHistoryButton();
//                 event.preventDefault();
//                 break;
//             case "ArrowUp":
//                 this.endHistoryButton();
//                 event.preventDefault();
//                 break;
//             case "ArrowDown":
//                 this.startHistoryButton();
//                 event.preventDefault();
//                 break;
//             default:
//                 break;
//         }
//     }

//     piecify(board: (string | null)[]): {
//         // convert from position in board to react-chess position string
//         return board.map((piece, i) => {
//             return piece === null ? null : `${piece}@${String.fromCharCode(charCodeOffset + (i % 8))}${8-Math.floor(i/8)}`;
//         }).filter(i => i !== null);
//     }

//     updateBoard(play_sound: boolean) {
//         this.setState((state: any, props: any) => {
//             return {
//                 pieces: this.piecify(props.G.history[0]),
//                 update: Math.random(),
//                 highlights: props.G.move_history[0],
//                 dots: [],
//             };
//         });

//         if(this.props.ctx.turn < 2 || !play_sound)
//             return;
//         // calculate the number of pieces on previous and current boards
//         if (this.props.G.history.length > 1 && this.props.ctx.gameover === undefined) {
//             const prev_num_pieces: number = this.props.G.history[1].filter((p:string|null) => p !== null).length;
//             const num_pieces: number = this.props.G.history[0].filter((p:string|null) => p !== null).length;

//             if(prev_num_pieces !== num_pieces)
//                 capture(0.9);
//             else
//                 move(1);
//         }
//         else
//         {
//             end(1);
//         }
//     }

//     // if returns false, will cancel the drag animation
//     onDragStart(piece: {
//                     notation: string,
//                     name: string,
//                     index: number,
//                     position: string
//                 }, _fromSquare: string) {
//         if (!this.props.isActive)
//             return false;

//         if (this.props.ctx.gameover)
//             return false;

//         if (this.state.historyIndex !== 0)
//             return false;

//         const black_piece = piece.name.charAt(0) === "B";
//         const black_turn = this.props.ctx.currentPlayer === "1";

//         return !((black_piece && !black_turn) || (!black_piece && black_turn));
//     }

//     onMovePiece(piece: {
//             notation: string,
//             name: string,
//             index: number,
//             position: string
//         }, fromSquare: string, toSquare: string, promotion: string) {
//         // handle piece capture, snap to grid
//         this.props.moves.movePiece(piece, fromSquare, toSquare, promotion);

//         // update board if illegal move
//         this.updateBoard(false);
//     }

//     onClickPiece(piece: {
//             notation: string,
//             name: string,
//             index: number,
//             position: string
//         }, clear: boolean) {
//         //either toggle the dots or run the clear
//         if(clear || (this.state.dots.length > 0 && this.state.lastClickedPiece === piece.notation)) {
//             // clear the dots on the screen
//             this.setState({dots: []});
//             this.setState({lastClickedPiece: ""});
//             return;
//         }

//         const from_square = piece.position;
//         const from_x = from_square.toLowerCase().charCodeAt(0) - charCodeOffset;
//         const from_y = Number(from_square[1]) - 1;
//         const clicked_square = piece.notation;

//         this.setState({lastClickedPiece: piece.notation});

//         // get available moves, filter through validity check if its our turn
//         if ((this.props.G.whiteTurn && piece.name.charAt(0) === "W") || (!this.props.G.whiteTurn && piece.name.charAt(0) !== "W") || this.state.historyIndex !== 0) {
//             let dot_locations = PieceTypes[piece.name.substring(1)].getAvailableMoves(from_x, from_y, this.props.G.history.slice(this.state.historyIndex), piece.name.charAt(0))
//                 .map(([to_x, to_y]) => `${String.fromCharCode(charCodeOffset + (to_x))}${1+to_y}`) // map from coordinates to square
//                 .filter(to_square => // filter move validity (stolen from colorHasMateInOnes)
//                     validMove(this.props.G.history.slice(this.state.historyIndex), piece.name, from_square, to_square) !== null)
//                 .map(to_square => `${piece.name}@${to_square}`); // of the form piece_name@to_square
//             dot_locations.push(clicked_square);
//             // set the new dot locations but remove duplicates
//             this.setState({dots: [...new Set(dot_locations)]});
//         } else {
//             //don't filter out invalid moves for the player who is not about to move
//             let dot_locations = PieceTypes[piece.name.substring(1)].getAvailableMoves(from_x, from_y, null, piece.name.charAt(0)).map(([to_x, to_y]) => `${String.fromCharCode(charCodeOffset + (to_x))}${1+to_y}`).map(to_square => `${piece.name}@${to_square}`);
//             dot_locations.push(clicked_square);
//             this.setState({dots: [...new Set(dot_locations)]});
//         }
//     }

//     decrementTimer() {
//         const isWhite = this.props.playerID === "0";
//         const whiteTurn = this.props.ctx.currentPlayer === "0";

//         if (this.props.ctx.gameover) {
//             clearInterval(this.timer);
//             return;
//         }

//         if (whiteTurn) {
//             this.setState((state: any, props: any) => {
//                 return {wTime: props.G.wTime - (Date.now() - props.G.last_event)};
//             });

//             // if the player's time expires play a timeout move
//             if (isWhite && this.state.wTime <= 0)
//                 this.props.moves.timeout();

//         } else {
//             // don't decrement on black's first move (edge case)
//             if (!isWhite && this.current_length <= 3)
//                 return;

//             this.setState((state: any, props: any) => {
//                 return {bTime: props.G.bTime - (Date.now() - props.G.last_event)};
//             });

//             // if the player's time expires play a timeout move
//             if (!isWhite && this.state.bTime <= 0)
//                 this.props.moves.timeout();
//         }
//     }

//     backHistoryButton() {
//         //console.log(this.props.ctx.turn + " " + this.state.historyIndex)
//         if (this.state.historyIndex < this.props.G.history.length - 1) {
//             this.setState((state:any, props:any) => {
//                 return {
//                     pieces: this.piecify(props.G.history[state.historyIndex + 1]),
//                     historyIndex: Math.min(props.G.history.length - 1, state.historyIndex + 1),
//                     dots: []
//                 };
//             });
//             move(1);
//         }
//     }

//     forwardHistoryButton() {
//         //console.log(this.props.G.history.length + " " + this.state.historyIndex)
//         if (this.state.historyIndex > 0) {
//             this.setState((state: any, props: any) => {
//                 return {
//                     pieces: this.piecify(props.G.history[state.historyIndex - 1]),
//                     historyIndex: Math.max(0, state.historyIndex - 1),
//                     dots: []
//                 };
//             });
//             move(1);
//         }
//     }

//     startHistoryButton() {
//         if (this.state.historyIndex < this.props.G.history.length - 1) {
//             this.setState((state: any, props: any) => {
//                 return {
//                     pieces: this.piecify(props.G.history[props.G.history.length - 1]),
//                     historyIndex: props.G.history.length - 1,
//                     dots: []
//                 };
//             });
//             move(1);
//         }
//     }

//     endHistoryButton() {
//         if (this.state.historyIndex > 0) {
//             this.setState((state: any, props: any) => {
//                 return {
//                     pieces: this.piecify(props.G.history[0]),
//                     historyIndex: 0,
//                     dots: []
//                 };
//             });
//             move(1);
//         }
//     }

//     getMaterialDifferences(pieces: string[]) {
//         let A: { [key: string]: number } = {};
//         for (let piece of pieces) {
//             if (piece !== null) {
//                 const name = piece.split("@")[0];
//                 const type = name.substring(1);
//                 const color = name.charAt(0);
//                 if (color === 'W') {
//                     A[type] = (A[type] || 0) + 1;
//                 } else {
//                     A[type] = (A[type] || 0) - 1;
//                 }
//             }
//         }
//         let whitePieces = [];
//         let blackPieces = [];
//         for (const [piece, score] of Object.entries(A)) {
//             if (score > 0) {
//                 for(let i = 0; i < score; i++)
//                     whitePieces.push("B" + piece);
//             } else if (score < 0) {
//                 for(let i = 0; i < -score; i++)
//                     blackPieces.push("W" + piece);
//             }
//         }
//         return [whitePieces, blackPieces];
//     }

//     componentDidUpdate() {
//         // this will run after every move
//         if (this.current_length !== this.props.ctx.turn) {
//             this.current_length = this.props.ctx.turn;

//             // redraw board
//             this.updateBoard(true);

//             // sync timer + reset timer update interval
//             clearInterval(this.timer);
//             this.setState((state: any, props: any) => {
//                 return {wTime: props.G.wTime, bTime: props.G.bTime};
//             }); // sync

//             // decrement time while game is running (but not for each color's first move)
//             if(!this.props.ctx.gameover && this.current_length > 2 && this.props.G.timer_enabled)
//                 this.timer = setInterval(this.decrementTimer, this.dec_amt);

//             this.gameover = this.props.ctx.gameover;
//             this.setState({historyIndex: 0});

//             //this.updateBoard(true);
//         }

//         // if the local promotablepieces record is different from the server, re-render the board
//         if(!(this.curr_promotablePieces.length === this.props.G.promotablePieces.length &&
//             this.curr_promotablePieces.every((v: string, i: number) => v === this.props.G.promotablePieces[i]))) {

//            this.curr_promotablePieces = this.props.G.promotablePieces;
//            this.updateBoard(false);
//         }

//         // when the game ends
//         if (this.props.ctx.gameover && this.state.historyIndex === 0) {
//             if(!this.gameover) {
//                 // TODO: this sound still plays on refresh
//                 end(0.6);

//                 // sync timer
//                 this.setState((state: any, props: any) => {
//                     return {wTime: props.G.wTime, bTime: props.G.bTime};
//                 });
//                 // set flag so this doesnt repeat
//                 this.gameover = true;
//                 this.updateBoard(false);
//             }
//         }
//     }

//     render() {
//         const {pieces, update, highlights, dots, wTime, bTime, historyIndex} = this.state;
//         const isWhite = this.props.playerID === "0";

//         let winner = <div></div>;
//         if (this.props.ctx.gameover && this.state.historyIndex === 0) {
//             winner =
//                 this.props.ctx.gameover.winner !== undefined ? (
//                     <div id="winner" style={ Object.assign({}, result_style, {width: this.state.boardWidth +"px", height: this.state.boardWidth +"px"})}>
//                         Winner: {this.props.ctx.gameover.winner}
//                     </div>
//                 ) : (
//                     <div id="winner" style={ Object.assign({}, result_style, {width: this.state.boardWidth +"px", height: this.state.boardWidth +"px"})}>
//                         Draw
//                     </div>
//                 );
//         }

//         //Making the piece visualizer
//         let visualizers = []
//         for (let piece of this.props.G.promotablePieces) {
//             visualizers.push(<Visualizer
//                 key={`${piece}-${this.props.G.promotablePieces}-visualizer`} // fixes bug when promPieces changes
//                 piece={piece}
//                 color={isWhite ? "W" : "B"}
//                 count={this.props.G.promotablePieces.length}
//                 />
//             );
//         }

//         //handle all the imbalances
//         let imbalence = this.getMaterialDifferences(pieces);
//         wImbalance = [];
//         bImbalance = [];
//         let i = 0;
//         imbalence[0].sort((a, b) => (PieceTypes[a.substring(1)].strength < PieceTypes[b.substring(1)].strength) ? 1 :-1 );
//         imbalence[1].sort((a, b) => (PieceTypes[a.substring(1)].strength < PieceTypes[b.substring(1)].strength) ? 1 :-1 );
//         for (let imbPiece of imbalence[0]) {
//             i++;
//             let Piece = pieceComponents(imbPiece);
//             if (i * 20 < getSize() - 220)
//                 wImbalance.push(
//                     <div style={{width: "20px", height: "30px", zIndex: 100-i, paddingTop: "5px"}}>
//                         <Piece size = {"30px"} key = {i + "-wInbPiece"}/>
//                     </div>
//                 );
//         }
//         i = 0;
//         for (let imbPiece of imbalence[1]) {
//             i++;
//             let Piece = pieceComponents(imbPiece);
//             if (i * 20 < getSize() - 220)
//                 bImbalance.push(
//                     <div style={{width: "20px", height: "30px", zIndex: 100-i, paddingTop: "5px"}}>
//                         <Piece size = {"30px"} key = {i + "-bInbPiece"}/>
//                     </div>
//                 );
//         }

//         return (
//             <div style={s1} onKeyDown={evt => {console.log(evt)}}>
//                 <button className="noselect" onClick={() => window.scrollTo(0,getSize())} style = {Object.assign({},{position: "fixed", right: "10px", bottom: "10px", width: "30px", height: "30px"},buttonStyles)}>
//                     ?
//                 </button>
//                 <div style={boardContainerStyles}>
//                     <div style={{position: "relative", width : this.state.boardWidth +"px"}}>
//                         <div style={{display: "flex"}}>
//                             <div style={{height: "35px"}}></div>
//                             {this.props.G.timer_enabled ? <Timer milliseconds={isWhite ? bTime : wTime} white = {!isWhite}/> : null}
//                             {isWhite ? bImbalance : wImbalance}
//                         </div>
//                         <div>
//                             <div className="board" style={board_style} onWheel={this.handleScroll} onMouseEnter={this.handleMouseEnterBoard} onMouseLeave={this.handleMouseExitBoard}>
//                                 <Chess
//                                     pieces={pieces}
//                                     highlights={historyIndex === 0 ? highlights : []}
//                                     dots={dots}
//                                     update={update}
//                                     check={historyIndex === 0 ? this.props.G.inCheck : ""}
//                                     promotablePieces = {this.props.G.promotablePieces}
//                                     whiteTurn={this.props.G.whiteTurn}
//                                     onMovePiece={this.onMovePiece}
//                                     onDragStart={this.onDragStart}
//                                     onClickPiece={this.onClickPiece}
//                                     isWhite={this.props.playerID === "0"}
//                                     allowMoves={!this.props.spectator}
//                                 />
//                             </div>
//                             {winner}
//                         </div>
//                         <div style={{display: "flex", justifyContent: "space-between"}}>
//                             <div style={{display: "flex"}}>
//                                 {this.props.G.timer_enabled ? <Timer milliseconds={isWhite ? wTime : bTime} white = {isWhite}/> : null}
//                                 {isWhite ? wImbalance : bImbalance}
//                             </div>
//                             <div style={{display: "flex", alignItems: "middle", height: "30px"}}>
//                                 <button onClick={this.startHistoryButton} style={buttonStyles} className="noselect">
//                                     &#60;&#60;
//                                 </button>
//                                 <button onClick={this.backHistoryButton} style={buttonStyles} className="noselect">
//                                     &#60;
//                                 </button>
//                                 <button onClick={this.forwardHistoryButton} style={buttonStyles} className="noselect">
//                                     &#62;
//                                 </button>
//                                 <button onClick={this.endHistoryButton} style={buttonStyles} className="noselect">
//                                     &#62;&#62;
//                                 </button>
//                             </div>
//                         </div>
//                         <div style={{display: this.props.spectator ? 'none' : 'flex'}}>
//                             <button style={{margin: 'auto', height: '2.5em'}} onClick={() => {this.props.moves.resign()}}>
//                                 <p style={{padding: '0 1em', margin: 'auto'}}>Resign</p>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//                 <div style={visualizerStyles}>{visualizers}</div>
//             </div>
//         );
//     }
// }