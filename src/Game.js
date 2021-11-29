import { INVALID_MOVE } from "boardgame.io/core";
const PieceTypes = require("./pieces.js")

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
        board[8 + i] = 'BZ';
        board[48 + i] = 'WB';
    }
    console.log(board);
    return board;
}

// return null if move is invalid, otherwise return updated board array
function validMove(board, piece, from, to)
{
    let new_board = [...board];
    // coordinates of "from" position
    const from_x = from.toLowerCase().charCodeAt(0) - 97;
    const from_y = Number(from[1]) - 1;

    // coordinates of "to" position
    const to_x = to.toLowerCase().charCodeAt(0) - 97;
    const to_y = Number(to[1]) - 1;

    console.log(PieceTypes[piece.name].getAvailableMoves(from_x, from_y, board, piece.name.charAt(0)))
    if ([to_x, to_y] in PieceTypes[piece.name].getAvailableMoves(from_x, from_y, board, piece.name.charAt(0))) {
        // naive assumption that player is not breaking the law
        new_board[(from_x + (8-from_y)*8)] = null;
        new_board[(to_x + (8-to_y)*8)] = piece.name;
        return new_board;
    } else {
        return null
    }
}

export const Chess = {
    name: "Chess",

    setup: () => ({
        // TODO: randomize board
        history: [initialBoard()],
        // update board variable to refresh after each turn
        update: true,
    }),

    turn: {
        minMoves: 1,
        maxMoves: 1,

    },

    moves: {
        // moves a piece and produces new board, if move is illegal: returns null
        movePiece: (G, ctx, piece, from, to) => {
            // console.log(piece); // object: {notation: "P@a2", name: "P", index: 0, position: "a2"}
            // console.log(from); // "a2"
            // console.log(to); // "a3"
            // console.log(G.history); // array of array(64)

            // using the most recent board in history
            let board = G.history[0];
            // simulate move
            board = validMove(board, piece, from, to);

            if(board !== null)
                G.history.unshift(board); // prepend new board to history


            G.update = true;
        },
    },

    

    // TODO: ending conditions
    // endIf: (G, ctx) => {
        // if(G.cells.length === 4)
        //     return {draw: true};
    // },

};