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
    onMove(piece, fromSquare, toSquare)
    {
        console.log(piece);
        console.log(fromSquare);
        console.log(toSquare);
        console.log();
    }
    
    render()
    {
        const s = {
            width: '500px',
            height: '500px',
        };
        
        return (
            <div style={s}>
                <Chess onMovePiece={this.onMove}/>
            </div>
        )
    }
}