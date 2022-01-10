import React from "react";
import { Visualizer } from "./visualizer.js";
const {Chess} = require("./react-chess/react-chess.js");
const {Timer} = require("./timer.js")
const {move, capture, end} = require("./sound.js");
const { PieceTypes } = require("./pieces.js");
const { validMove } = require("./Game.js");

//Thanks SO
function getWidth(){
    return Math.max(
        window.innerWidth
        //document.body.scrollWidth,
        //document.documentElement.scrollWidth,
        //document.body.offsetWidth,
        //document.documentElement.offsetWidth,
        //document.documentElement.clientWidth
    )
}

function getHeight(){
    return Math.max(
        window.innerHeight
        //document.body.scrollHeight,
        //document.documentElement.scrollHeight,
        //document.body.offsetHeight,
        //document.documentElement.offsetHeight,
        //document.documentElement.clientHeight
    )
}

const visualizerStyles = {
    paddingTop: "50px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    // height: "400px",
}

const boardContainerStyles = {
    //padding: "12px",
    display: "flex",
    flexDirection: "row",
    //flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    // height: "400px",
}

const s1 = {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    // height: "400px",
}

//const container = {
//    "position": "relative",
//    "width": Math.min(getHeight() - 100, getWidth() - 50) + "px", //TODO, magic numbers bad
//    //"height": "800px",
//    // "display": 'flex',
//    // "flexDirection": 'column',
//    // 'alignItems': 'end',
//};

const board_style = {
    "width": "100%",
    "height": "100%",
    //"position": "absolute",
    //"top": "0",
    //"left": "0",
};

const result_style = {
    position: "absolute",
    top: "36px",
    left: "0",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "1",
    backgroundColor: "#eee9",
    userSelect: "none",
}

export class ChessBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pieces: this.piecify(this.props.G.history[0]),
            update: 0,
            highlights: [],
            dots: [],
            wTime: this.props.G.wTime,
            bTime: this.props.G.bTime,
            boardWidth: Math.min(getHeight() - 100, getWidth() - 50),
            historyIndex: 0,
        };

        this.onMovePiece = this.onMovePiece.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onClickPiece = this.onClickPiece.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.backHistoryButton = this.backHistoryButton.bind(this);
        this.forwardHistoryButton = this.forwardHistoryButton.bind(this);
        this.startHistoryButton = this.startHistoryButton.bind(this);
        this.endHistoryButton = this.endHistoryButton.bind(this);

        this.updateBoard = this.updateBoard.bind(this);
        this.piecify = this.piecify.bind(this);

        // timer stuff
        this.timer = 0;
        this.decrementTimer = this.decrementTimer.bind(this);
        this.dec_amt = 100; // 10ms

        this.current_length = 0;
        this.curr_promotablePieces = [];
        this.gameover = false;
        
        window.addEventListener('resize', this.handleResize)
    }

    handleResize() {
        this.setState({
            boardWidth: Math.min(getHeight() - 100, getWidth() - 50)
        })
    }

    piecify(board) {
        // convert from position in board to react-chess position string
        return board.map((piece, i) => {
            return piece === null ? null : `${piece}@${String.fromCharCode(97 + (i % 8))}${8-Math.floor(i/8)}`;
        }).filter(i => i !== null);
    }

    updateBoard(play_sound) {
        this.setState({
            pieces: this.piecify(this.props.G.history[0]),
            update: Math.random(),
            highlights: this.props.G.move_history[0],
            dots: [],
        });

        if(this.props.G.history.length < 2 || !play_sound)
            return;
        // calculate the number of pieces on previous and current boards
        const prev_num_pieces = this.props.G.history[1].filter(p => p !== null).length;
        const num_pieces = this.props.G.history[0].filter(p => p !== null).length;
        
        if(prev_num_pieces !== num_pieces)
            capture(0.9);
        else
            move(1);

    }

    // if returns false, will cancel the drag animation
    onDragStart(piece, fromSquare) {
        if (!this.props.isActive)
            return false;

        if (this.props.ctx.gameover)
            return false;

        if (this.state.historyIndex !== 0) {
            return false;
        }

        const black_piece = piece.name.charAt(0) === "B";
        const black_turn = this.props.ctx.currentPlayer === "1";

        if ((black_piece && !black_turn) || (!black_piece && black_turn))
            return false;

        return true;
    }

    onMovePiece(piece, fromSquare, toSquare, promotion) {
        // handle piece capture, snap to grid
        this.props.moves.movePiece(piece, fromSquare, toSquare, promotion);

        // update board if illegal move
        this.updateBoard(false);
    }

    onClickPiece(piece, clear) {
        if(clear) {
            // clear the dots on the screen
            this.setState({dots: []});
            return;
        }

        const from_square = piece.position;
        const from_x = from_square.toLowerCase().charCodeAt(0) - 97;
        const from_y = Number(from_square[1]) - 1;

        // get available moves, filter through validity check if its our turn
        if ((this.props.G.whiteTurn && piece.name.charAt(0) === "W") || (!this.props.G.whiteTurn && piece.name.charAt(0) !== "W") || this.state.historyIndex !== 0) {
            let dot_locations = PieceTypes[piece.name.substring(1)].getAvailableMoves(from_x, from_y, this.props.G.history.slice(this.state.historyIndex), piece.name.charAt(0))
                .map(([to_x, to_y]) => `${String.fromCharCode(97 + (to_x))}${1+to_y}`) // map from coordinates to square
                .filter(to_square => // filter move validity (stolen from colorHasMateInOnes)
                    validMove(this.props.G.history.slice(this.state.historyIndex), piece.name, from_square, to_square) !== null)
                .map(to_square => `${piece.name}@${to_square}`); // of the form piece_name@to_square

            // set the new dot locations but remove duplicates
            this.setState({dots: [...new Set(dot_locations)]});
        } else {
            //don't filter out invalid moves for the player who is not about to move
            let dot_locations = PieceTypes[piece.name.substring(1)].getAvailableMoves(from_x, from_y, null, piece.name.charAt(0))
                .map(([to_x, to_y]) => `${String.fromCharCode(97 + (to_x))}${1+to_y}`) // map from coordinates to square
                .map(to_square => `${piece.name}@${to_square}`); // of the form piece_name@to_square

            // set the new dot locations but remove duplicates
            this.setState({dots: [...new Set(dot_locations)]});
        }
    }

    decrementTimer() {
        const isWhite = this.props.playerID === "0";
        const whiteTurn = this.props.ctx.currentPlayer === "0";

        if (this.props.ctx.gameover) {
            clearInterval(this.timer);
            return;
        }

        if (whiteTurn) {
            this.setState({wTime: this.props.G.wTime - (Date.now() - this.props.G.last_event)})

            // if the player's time expires play a timeout move
            if (isWhite && this.state.wTime <= 0)
                this.props.moves.timeout();
        
        } else {
            // don't decrement on black's first move (edge case)
            if (!isWhite && this.current_length <= 3)
                return;

            this.setState({bTime: this.props.G.bTime - (Date.now() - this.props.G.last_event)})

            // if the player's time expires play a timeout move
            if (!isWhite && this.state.bTime <= 0)
                this.props.moves.timeout();
        }
    }

    backHistoryButton() {
        //console.log(this.props.G.history.length + " " + this.state.historyIndex)
        if (this.state.historyIndex < this.props.G.history.length - 1) {
            this.setState({pieces: this.piecify(this.props.G.history[this.state.historyIndex + 1])})
            this.setState({historyIndex: Math.min(this.props.G.history.length - 1, this.state.historyIndex + 1)})
            this.setState({dots: []})
            move(1);
        }
        
    }

    forwardHistoryButton() {
        //console.log(this.props.G.history.length + " " + this.state.historyIndex)
        if (this.state.historyIndex > 0) {
            this.setState({pieces: this.piecify(this.props.G.history[this.state.historyIndex-1])})
            this.setState({historyIndex: Math.max(0, this.state.historyIndex - 1)})
            this.setState({dots: []})
            move(1);
        }
    }

    startHistoryButton() {
        if (this.state.historyIndex !== this.props.G.history.length - 1) {
            this.setState({pieces: this.piecify(this.props.G.history[this.props.G.history.length - 1])})
            this.setState({historyIndex: this.props.G.history.length - 1})
            this.setState({dots: []})
            move(1);
        }
    }

    endHistoryButton() {
        if (this.state.historyIndex !== 0) {
            this.setState({pieces: this.piecify(this.props.G.history[0])})
            this.setState({historyIndex: 0})
            this.setState({dots: []})
            move(1);
        }
    }

    render() {
        const {pieces, update, highlights, dots, wTime, bTime, historyIndex} = this.state;
        const isWhite = this.props.playerID === "0";

        //console.log('spec', this.props.spectator)

        // this will run after every move
        if (this.current_length !== this.props.G.history.length) {
            this.current_length = this.props.G.history.length;

            // redraw board
            this.updateBoard(true);
            
            // sync timer + reset timer update interval 
            clearInterval(this.timer);
            this.setState({wTime: this.props.G.wTime, bTime: this.props.G.bTime}); // sync
            
            // decrement time while game is running (but not for each color's first move)
            if(!this.props.ctx.gameover && this.current_length > 2)
                this.timer = setInterval(this.decrementTimer, this.dec_amt);
            
            this.gameover = this.props.ctx.gameover;
        }

        let winner = "";
        if (this.props.ctx.gameover && this.state.historyIndex === 0) {
            
            if(!this.gameover) {
                // TODO: this sound still plays on refresh
                end(0.6);

                // sync timer
                this.setState({wTime: this.props.G.wTime, bTime: this.props.G.bTime}); 
                // set flag so this doesnt repeat
                this.gameover = true;
            }

            winner =
                this.props.ctx.gameover.winner !== undefined ? (
                    <div id="winner" style={ Object.assign({}, result_style, {width: this.state.boardWidth +"px", height: this.state.boardWidth +"px"})}>Winner: {this.props.ctx.gameover.winner}</div>
                ) : (
                    <div id="winner"  style={ Object.assign({}, result_style, {width: this.state.boardWidth +"px", height: this.state.boardWidth +"px"})}>Draw</div>
                );
        }

        // if the local promotablepieces record is different from the server, re-render the board 
        if(!(this.curr_promotablePieces.length === this.props.G.promotablePieces.length &&
             this.curr_promotablePieces.every((v, i) => v === this.props.G.promotablePieces[i]))) {

            this.curr_promotablePieces = this.props.G.promotablePieces;
            this.updateBoard(false);
        }

        // console.log(this.props.playerID, this.props.G.promotablePieces);
        //Making the piece visualizer
        let visualizers = []
        for (let piece of this.props.G.promotablePieces) {
            visualizers.push(<Visualizer 
                key={`${piece}-${this.props.G.promotablePieces}-visualizer`} // fixes bug when promPieces changes
                piece={piece} 
                color={isWhite ? "W" : "B"}
                count={this.props.G.promotablePieces.length}
                />
            )
        }

        return (
            <div style={s1}>
                <div style={boardContainerStyles}>
                    <div style={{position: "relative", width : this.state.boardWidth +"px"}}>
                        <Timer milliseconds={isWhite ? bTime : wTime} white = {!isWhite}/>
                        <div>
                            <div className="board" style={board_style}>
                                <Chess
                                    pieces={pieces}
                                    highlights={historyIndex === 0 ? highlights : []}
                                    dots={dots}
                                    update={update}
                                    check={historyIndex === 0 ? this.props.G.inCheck : ""}
                                    promotablePieces = {this.props.G.promotablePieces}
                                    whiteTurn={this.props.G.whiteTurn}
                                    onMovePiece={this.onMovePiece}
                                    onDragStart={this.onDragStart}
                                    onClickPiece={this.onClickPiece}
                                    isWhite={this.props.playerID === "0"}
                                    allowMoves={!this.props.spectator}
                                />
                            </div>
                            {winner}
                        </div>
                        <Timer milliseconds={isWhite ? wTime : bTime} white = {isWhite}/>
                        <button onClick={this.startHistoryButton}>
                            Start
                        </button>
                        <button onClick={this.backHistoryButton}>
                            Back
                        </button>
                        <button onClick={this.forwardHistoryButton}>
                            Forward
                        </button>
                        <button onClick={this.endHistoryButton}>
                            End
                        </button>
                    </div>
                </div>
                <div style={visualizerStyles}>{visualizers}</div>
            </div>
        )
    }
}