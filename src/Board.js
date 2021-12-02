import React from "react";
const Chess = require("react-chess");

export class ChessBoard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pieces: this.piecify(this.props.G.history[0]),
            update: 0,
            highlights: []
        };

        this.onMovePiece = this.onMovePiece.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
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

    updateBoard() {
        this.setState({
            pieces: this.piecify(this.props.G.history[0]),
            update: Math.random(),
            highlights: this.props.G.move_history[0],
        });
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

    onMovePiece(piece, fromSquare, toSquare) {
        // handle piece capture, snap to grid

        const prev_history = this.props.G.history.length;
        this.props.moves.movePiece(piece, fromSquare, toSquare);

        // sync with client
        this.updateBoard();

        if (this.props.G.history.length === prev_history)
            return false;

        // this.setState({highlights: [fromSquare, toSquare]});
    }

    render() {
        const s = {
            width: '250px',
            height: '250px',
        };

        const {pieces, update, highlights} = this.state;

        // after any turn, update the board
        if (this.current_length !== this.props.G.history.length) {
            this.current_length = this.props.G.history.length;
            this.updateBoard();
        }

        let winner = "";
        if (this.props.ctx.gameover) {
            winner =
                this.props.ctx.gameover.winner !== undefined ? (
                    <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
                ) : (
                    <div id="winner">Draw</div>
                );
        }

        return (
            <div className="board" style={s}>
                <Chess
                    pieces={pieces}
                    highlights={highlights}
                    update={update}
                    onMovePiece={this.onMovePiece}
                    onDragStart={this.onDragStart}
                    isWhite={this.props.playerID === "0"}
                />
                {winner} 
            </div>
        )
    }
}