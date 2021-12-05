import React from "react";
const Chess = require("react-chess");
const sound = require("./sound.js");
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
        };

        this.onMovePiece = this.onMovePiece.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onClickPiece = this.onClickPiece.bind(this);

        this.updateBoard = this.updateBoard.bind(this);
        this.piecify = this.piecify.bind(this);

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
            sound.capture.play();
        else
            sound.move.play();
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

    render() {
        const container = {
            "position": "relative",
            "width": "400px",
            "height": "400px",
        };

        const board_style = {
            "width": "100%",
            "height": "100%",
            "position": "absolute",
            "top": "0",
            "left": "0",
        };

        const result_style = {
            "width": "100%",
            "height": "100%",
            "position": "absolute",
            "top": "0",
            "left": "0",

            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "z-index": "1",
            "background-color": "#eee9",
            "user-select": "none",
        }

        const {pieces, update, highlights, dots} = this.state;

        // after any turn, update the board
        if (this.current_length !== this.props.G.history.length) {
            this.current_length = this.props.G.history.length;
            this.updateBoard(true);
        }

        let winner = "";
        if (this.props.ctx.gameover) {
            // TODO: this sound still plays on refresh
            sound.end.play();

            winner =
                this.props.ctx.gameover.winner !== undefined ? (
                    <div id="winner" style={result_style}>Winner: {this.props.ctx.gameover.winner}</div>
                ) : (
                    <div id="winner" style={result_style}>Draw</div>
                );
        }

        return (
            <div style={container}>
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
                {winner}
            </div>
        )
    }
}