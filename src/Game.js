import { INVALID_MOVE } from "boardgame.io/core";


export const TicTacToe = {
    name: "TicTacToe",

    setup: () => ({cells: Array(9).fill(null)}),

    turn: {
        minMoves: 1,
        maxMoves: 1,
    },

    moves: {
        clickCell: (G, ctx, id) => {
            if(G.cells[id] !== null)
                return INVALID_MOVE;

            G.cells[id] = ctx.currentPlayer;
        }
    },

    // endIf: (G, ctx) => {
    //     if(IsVictory(G.cells))
    //         return {winner: ctx.currentPlayer};

    //     if(IsDraw(G.cells))
    //         return {draw: true};
    // },
};

function initialBoard()
{
    // index 0: a8, index 63: h1
    let board = Array(64).fill(null);
    for(let i = 0; i < 8; i++)
    {
        board[8 + i] = 'p';
        board[48 + i] = 'P'
    }
    console.log(board);
    return board;
}

function validMove()
{

}

export const Chess = {
    name: "Chess",

    setup: () => ({
        // TODO: randomize board
        history: [initialBoard()],
    }),

    turn: {
        minMoves: 1,
        maxMoves: 1,
    },

    moves: {
        movePiece: (G, ctx, piece, from, to) => {
            console.log(piece);
            console.log(from);
            console.log(to);
            console.log(G.history);
        },
    },

    // endIf: (G, ctx) => {
        // if(G.cells.length === 4)
        //     return {draw: true};
    // },

};