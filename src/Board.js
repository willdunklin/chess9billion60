import React from "react";
import { Visualizer } from "./visualizer.js";
const {Chess} = require("./react-chess/react-chess.js");
const {Timer} = require("./timer.js")
const {move, capture, end} = require("./sound.js");
const PieceTypes = require("./pieces.js");
const { validMove } = require("./Game.js");

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
        };

        this.onMovePiece = this.onMovePiece.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onClickPiece = this.onClickPiece.bind(this);

        this.updateBoard = this.updateBoard.bind(this);
        this.piecify = this.piecify.bind(this);

        // timer stuff
        this.timer = 0;
        this.decrementTimer = this.decrementTimer.bind(this);
        this.dec_amt = 100; // 10ms

        this.current_length = 0;
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

        // TODO: add checks for checks
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

        // get available moves, filter through validity check
        let dot_locations = PieceTypes[piece.name.substring(1)].getAvailableMoves(from_x, from_y, this.props.G.history, piece.name.charAt(0))
            .map(([to_x, to_y]) => `${String.fromCharCode(97 + (to_x))}${1+to_y}`) // map from coordinates to square
            .filter(to_square => // filter move validity (stolen from colorHasMateInOnes)
                validMove(this.props.G.history, piece.name, from_square, to_square) !== null)
            .map(to_square => `${piece.name}@${to_square}`); // of the form piece_name@to_square

        // set the new dot locations but remove duplicates
        this.setState({dots: [...new Set(dot_locations)]});
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
            this.setState({bTime: this.props.G.bTime - (Date.now() - this.props.G.last_event)})

            // if the player's time expires play a timeout move
            if (!isWhite && this.state.bTime <= 0)
                this.props.moves.timeout();
        }
    }

    render() {
        const container = {
            "position": "relative",
            "width": "600px",
            "height": "600px",
            // "display": 'flex',
            // "flexDirection": 'column',
            // 'alignItems': 'end',
        };

        const board_style = {
            "width": "85%",
            "height": "85%",
            //"position": "absolute",
            //"top": "0",
            //"left": "0",
        };

        const result_style = {
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0",
            left: "0",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1",
            backgroundColor: "#eee9",
            userSelect: "none",
        }

        const {pieces, update, highlights, dots} = this.state;

        // this will run after every move
        if (this.current_length !== this.props.G.history.length) {
            this.current_length = this.props.G.history.length;

            // redraw board
            this.updateBoard(true);
            
            // sync timer + reset timer update interval 
            clearInterval(this.timer);
            this.setState({wTime: this.props.G.wTime, bTime: this.props.G.bTime}); // sync
            if(!this.props.ctx.gameover) // only repeat while game is running
                this.timer = setInterval(this.decrementTimer, this.dec_amt);
        }

        let winner = "";
        if (this.props.ctx.gameover) {
            // TODO: this sound still plays on refresh
            end(0.6);

            winner =
                this.props.ctx.gameover.winner !== undefined ? (
                    <div id="winner" style={result_style}>Winner: {this.props.ctx.gameover.winner}</div>
                ) : (
                    <div id="winner" style={result_style}>Draw</div>
                );
        }

        const isWhite = this.props.playerID === "0";

        // TODO: make the local time update on interval
        // https://www.geeksforgeeks.org/create-a-stop-watch-using-reactjs/
        //  use this.props to store a local w and b time
        //  use setInterval to decrement local timer based on whose turn it is (isWhite is what we're looking at I think)
        //  sync with server on new move
        //  if the time elapses and the board is the player's who lost on time, call the this.props.moves.timeout()

        //Making the piece visualizer
        let visualizers = []
        for (let i = 0; i < this.props.G.promotablePieces.length; i++) {
            visualizers.push(<Visualizer piece = {this.props.G.promotablePieces[i]}/>)
        }
        visualizers.push(<Visualizer piece = "K"/>)

        return (
            <div style={container}>
                <Timer milliseconds={isWhite ? this.state.bTime : this.state.wTime} white = {!isWhite}/>
                <div>
                <div className="board" style={board_style}>
                    <Chess
                        pieces={pieces}
                        highlights={highlights}
                        dots={dots}
                        update={update}
                        check={this.props.G.inCheck}
                        promotablePieces = {this.props.G.promotablePieces}
                        whiteTurn={this.props.G.whiteTurn}
                        onMovePiece={this.onMovePiece}
                        onDragStart={this.onDragStart}
                        onClickPiece={this.onClickPiece}
                        isWhite={this.props.playerID === "0"}
                    />
                </div>                
                </div>
                <Timer milliseconds={isWhite ? this.state.wTime : this.state.bTime} white = {isWhite}/>
                {winner}
                {/* {visualizers} */}
            </div>
        )
    }
}