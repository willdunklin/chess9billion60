import { INVALID_MOVE } from "boardgame.io/core";
const PieceTypes = require("./pieces.js")

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function generateArmy(lowerBound, upperBound) {
    const pool = Object.keys(PieceTypes)
    var attempts = 0
    //TODO, gracefully handle when this loop doesn't find an army, or make army generation more intelligent
    //With lowerBound and upperBound as 3000 and 4000 it seems to work almost always, but if we let users choose...
    var army = []
    while (attempts < 1000) {
        army = []
        var banned_pieces = []
        var pieces_found = 0
        var strength = 0
        while (pieces_found < 7) {
            var piece = pool[Math.floor(Math.random() * (pool.length))]
            if (!(banned_pieces.includes(piece)) && piece !== "P" && piece !== "K") {
                if (army.includes(piece) || PieceTypes[piece].getStrength() > 750) {
                    banned_pieces.push(piece)
                }
                army.push(piece)
                pieces_found += 1
                strength += PieceTypes[piece].getStrength() 
            }
        }
        if ((lowerBound <= strength) && (strength <= upperBound)) {
            break;
        }
        attempts+=1
    }
    army.push("K")

    //mix the king in
    shuffleArray(army)

    var evens = []
    var odds = []
    var cbCount = 0
    for (var i = 7; i >= 0; i--) {
        if (PieceTypes[army[i]].colorbound) {
            cbCount += 1
            if (cbCount % 2 === 0) {
                evens.push(army[i])
                army.splice(i,1)
            } else {
                odds.push(army[i])
                army.splice(i,1)
            }
        }
    }
    while (evens.length < 4)
        evens.push(army.pop())
    while (odds.length < 4)
        odds.push(army.pop())
    shuffleArray(evens)
    shuffleArray(odds)
    army = []
    //evens and odds are bad names because of this - it randomizes which is which
    var randomBit = Math.floor(Math.random() * 2)
    for (var j = 0; j < 8; j++) {
        if (j % 2 === randomBit)
            army.push(evens.pop())
        else
            army.push(odds.pop())
    }
    return army;
}

function initialBoard()
{
    // index 0: a8, index 63: h1
    let board = Array(64).fill(null);
    for(let i = 0; i < 8; i++)
    {
        board[8 + i] = 'BP';
        board[48 + i] = 'WP';
    }

    var random_army = generateArmy(3000, 4000)
    for (var i = 0; i < 8; i++) {
        board[i] = "B"+random_army[i]
        board[56+i] = "W"+random_army[i]
    }
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

    let moves = PieceTypes[piece.name.substring(1)].getAvailableMoves(from_x, from_y, board, piece.name.charAt(0));

    for(const [x, y] of moves) {
        if ((x === to_x) && (y === to_y)) {
            new_board[(from_x + (7-from_y)*8)] = null;
            new_board[(to_x + (7-to_y)*8)] = piece.name;
            return new_board
        }
    }

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
            else
                return INVALID_MOVE;
        },
    },

    

    // TODO: ending conditions
    // endIf: (G, ctx) => {
        // if(G.cells.length === 4)
        //     return {draw: true};
    // },

};