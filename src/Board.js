import React from "react";
const Chess = require("react-chess");

export class TicTacToeBoard extends React.Component {
    onClick(id)
    {
        this.props.moves.clickCell(id);
    }

    render()
    {
        let winner = '';
        if(this.props.ctx.gameover)
        {
            winner = this.props.ctx.gameover.winner !== undefined ? (
                <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
            ) : (
                <div id="winner">Draw!</div>
            );
        }

        const cellStyle = {
            border: '1px solid #555',
            width: '50px',
            height: '50px',
            lineHeight: '50px',
            textAlign: 'center',
        };

        let tbody = [];
        for(let i = 0; i < 3; i++)
        {
            let cells = [];
            for(let j = 0; j < 3; j++)
            {
                const id = 3 * i + j;
                cells.push(
                    <td style={cellStyle} key={id} onClick={() => this.onClick(id)}>
                        {this.props.G.cells[id]}
                    </td>
                )
            }
            tbody.push(<tr key={i}>{cells}</tr>);
        }

        return (
            <div>
                <table id="board">
                    <tbody>{tbody}</tbody>
                </table>
                {winner}
            </div>
        );
    }
}

// installed npm install --save --force react-chess
export class ChessBoard extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {pieces: this.piecify(this.props.G.history[0])};

        this.onMovePiece = this.onMovePiece.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.updateBoard = this.updateBoard.bind(this);
        this.piecify = this.piecify.bind(this);

        this.current_length = 0;
    }

    piecify(board)
    {
        // convert from position in board to react-chess position string
        return board.map((piece, i) => {
            return piece === null ? null : `${piece}@${String.fromCharCode(97 + (i % 8))}${8-Math.floor(i/8)}`;
        }).filter(i => i !== null);
    }

    updateBoard()
    {
        this.setState({pieces: this.piecify(this.props.G.history[0])});
    }

    // if returns false, will cancel the drag animation
    onDragStart(piece, fromSquare)
    {
        if(!this.props.isActive)
            return false;

        // TODO: add checks for checks
        const black_piece = piece.name.charAt(0) === "B";
        const black_turn = this.props.ctx.currentPlayer === "1";

        if((black_piece && !black_turn) || (!black_piece && black_turn))
            return false;

        return true;
    }

    onMovePiece(piece, fromSquare, toSquare)
    {
        // handle piece capture, snap to grid

        const prev_history = this.props.G.history.length;
        this.props.moves.movePiece(piece, fromSquare, toSquare);

        if(this.props.G.history.length === prev_history)
        {
            console.log('you suck');
            return false;
        }

        // sync with client
        this.updateBoard();
    }
    
    render()
    {
        const s = {
            width: '250px',
            height: '250px',
        };

        const {pieces} = this.state;

        // after any turn, update the board
        if(this.current_length !== this.props.G.history.length)
        {
            this.current_length = this.props.G.history.length;
            this.updateBoard();
        }

        return (
            <div className="board" style={s}>
                <Chess 
                    isWhite={this.props.G}
                    pieces={pieces} 
                    onMovePiece={this.onMovePiece} 
                    onDragStart={this.onDragStart}
                />
            </div>
        )
    }
}