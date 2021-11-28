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

// return null if move is invalid, otherwise return updated board array
function validMove(board, piece, from, to)
{
    return null;
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
        // moves a piece and produces new board, if move is illegal: returns null
        movePiece: (G, ctx, piece, from, to) => {
            // console.log(piece);
            // console.log(from);
            // console.log(to);
            // console.log(G.history);

            // using the most recent board in history
            let board = G.history[G.history.length - 1];
            // simulate move
            board = validMove(board, piece, from, to);

            if(board !== null)
                G.history.push(board);

            return board;
        },
    },

    // TODO: ending conditions
    // endIf: (G, ctx) => {
        // if(G.cells.length === 4)
        //     return {draw: true};
    // },

};