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

//checkmate checking is just stalemate + check. logic could either be added to this method or just two calls
function colorInStalemate(history, color) {
    for (var j = 0; j < 8*8; j++) {
        var piece = history[0][j]
        var from = [j % 8, 7-Math.floor(j/8)]
        if (piece !== null && piece.charAt(0) === color) {
            let moves = PieceTypes[piece.substring(1)].getAvailableMoves(from[0], from[1], history, piece.charAt(0));
            for(const [x, y] of moves) {
                if (validMove(history, piece, `${String.fromCharCode(97 + from[0])}${1+from[1]}`, `${String.fromCharCode(97 + (x))}${1+y}`) !== null)
                    return false
            }
        }
    }
    return true
}

//run on board generation to prevent instant losses 
function colorHasMateInOnes(history, color) {
    var board = history[0]
    var otherColor = "W"
    if (color === "W") {
        otherColor = "B"
    }
    for (var j = 0; j < 8*8; j++) {
        var piece = history[0][j]
        var from = [j % 8, 7-Math.floor(j/8)]
        if (piece !== null && piece.charAt(0) === color) {
            let moves = PieceTypes[piece.substring(1)].getAvailableMoves(from[0], from[1], history, piece.charAt(0));
            for(const [x, y] of moves) {
                //console.log(history)
                var result = validMove(history, piece, `${String.fromCharCode(97 + from[0])}${1+from[1]}`, `${String.fromCharCode(97 + (x))}${1+y}`)
                //console.log(result)
                if (result !== null) {
                    // TODO: why???
                    history.unshift(result)
                    //console.log(otherColor)
                    //console.log(history)
                    if (colorInCheck(result, otherColor) && colorInStalemate(history, otherColor)) {
                        //fix the board I prepended in stalemate check
                        history.splice(0,1)
                        return true
                    }
                    //fix the board I prepended in stalemate check
                    history.splice(0,1)
                }
            }
        }
    }
    
    return false
}

function colorInCheck(board, color) {
    var kingPos
    for (var i = 0; i < (8*8); i++) {
        if (board[i] === color + "K")
            kingPos = [(i % 8), 7-Math.floor(i/8)]
    }
    for (var j = 0; j < (8*8); j++) {
        var piece = board[j];
        if (piece !== null && piece.charAt(0) !== color) {
            let moves = PieceTypes[piece.substring(1)].getAvailableMoves(j % 8, 7-Math.floor(j/8), [board,board], piece.charAt(0));
            for(const [x, y] of moves) {
                if ((x === kingPos[0]) && (y === kingPos[1])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function generateArmy(lowerBound, upperBound) {
    const pool = Object.keys(PieceTypes)
    var attempts = 0
    //TODO, gracefully handle when this loop doesn't find an army, or make army generation more intelligent
    //With lowerBound and upperBound as 3000 and 4000 it seems to work almost always, but if we let users choose...
    var army = []
    while (attempts < 1000) {
        army = []
        var banned_pieces = ["P","K"]
        var pieces_found = 0
        var strength = 0
        while (pieces_found < 7) {
            var piece = pool[Math.floor(Math.random() * (pool.length))]
            if (!(banned_pieces.includes(piece))) {
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
    var board = Array(64).fill(null);
    do {
        board = Array(64).fill(null);
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
        //no instant loss positions
    } while (colorHasMateInOnes([board],"W"))
    return board;
}

// return null if move is invalid, otherwise return updated board array
function validMove(history, name, from, to)
{
        
    let new_board = [...history[0]];
    // coordinates of "from" position
    const from_x = from.toLowerCase().charCodeAt(0) - 97;
    const from_y = Number(from[1]) - 1;

    // coordinates of "to" position
    const to_x = to.toLowerCase().charCodeAt(0) - 97;
    const to_y = Number(to[1]) - 1;

    let moves = PieceTypes[name.substring(1)].getAvailableMoves(from_x, from_y, history, name.charAt(0));

    for(const [x, y] of moves) {
        if ((x === to_x) && (y === to_y)) {
            //en passant handling
            if (name.substring(1) === "P") {
                //are we moving to an empty square in a different file
                if (history[0][(to_x + (7-to_y)*8)] === null && (from_x !== to_x)) {
                    //take the en passanted piece
                    new_board[(to_x + (7-from_y)*8)] = null;
                }
            }
            new_board[(from_x + (7-from_y)*8)] = null;
            new_board[(to_x + (7-to_y)*8)] = name;
            //Did we make a move which puts us or leaves us in check
            if (!colorInCheck(new_board, name.charAt(0)))
                return new_board
            else
                return null
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
            board = validMove(G.history, piece.name, from, to);

            if(board !== null)
                G.history.unshift(board); // prepend new board to history
            else
                return INVALID_MOVE;
        },
    },

    endIf: (G, ctx) => {
        const board = G.history[0];
        // check if white in stalemate
        if(colorInStalemate(G.history, "W"))
        {
            if(colorInCheck(board, "W"))
                // winner = black
                return {winner: "Black"};
            return {draw: true};
        }

        // check if black in stalemate
        if(colorInStalemate(G.history, "B"))
        {
            if(colorInCheck(board, "B"))
                // winner = white
                return {winner: "White"};
            return {draw: true};
        }
    },

};