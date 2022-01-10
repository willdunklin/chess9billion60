import { INVALID_MOVE } from "boardgame.io/core";
const { PieceTypes } = require("./pieces.js");

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


function handleTimers(G, whiteTurn) {
    // const {whiteTime, blackTime, increment, last_event} = timer_state
    const delta = Date.now() - G.last_event;
    if (whiteTurn)
        G.wTime = G.wTime - delta + G.increment;
    else
        G.bTime = G.bTime - delta + G.increment;
    G.last_event = Date.now();
}

//checkmate checking is just stalemate + check. logic could either be added to this method or just two calls
function colorInStalemate(history, color) {
    for (let j = 0; j < 8 * 8; j++) {
        let piece = history[0][j];
        let from = [j % 8, 7 - Math.floor(j / 8)];
        if (piece !== null && piece.charAt(0) === color) {
            let moves = PieceTypes[piece.substring(1)].getAvailableMoves(from[0], from[1], history, piece.charAt(0));
            for (const [x, y] of moves) {
                if (validMove(history, piece, `${String.fromCharCode(97 + from[0])}${1+from[1]}`, `${String.fromCharCode(97 + (x))}${1+y}`) !== null)
                    return false;
            }
        }
    }
    return true;
}

//run on board generation to prevent instant losses 
function colorHasMateInOnes(history, color) {
    let otherColor = "W";
    if (color === "W") {
        otherColor = "B";
    }
    for (let j = 0; j < 8 * 8; j++) {
        let piece = history[0][j];
        let from = [j % 8, 7 - Math.floor(j / 8)];
        if (piece !== null && piece.charAt(0) === color) {
            let moves = PieceTypes[piece.substring(1)].getAvailableMoves(from[0], from[1], history, piece.charAt(0));
            for (const [x, y] of moves) {

                // 
                let result = validMove(history, piece, `${String.fromCharCode(97 + from[0])}${1+from[1]}`, `${String.fromCharCode(97 + (x))}${1+y}`);

                if (result !== null) {
                    history.unshift(result);

                    if (colorInCheck(result, otherColor) && colorInStalemate(history, otherColor)) {
                        //fix the board I prepended in stalemate check
                        history.splice(0, 1);
                        return true;
                    } else {
                        //fix the board I prepended in stalemate check
                        history.splice(0, 1);
                    }
                }
            }
        }
    }

    return false;
}

function colorInCheck(board, color) {
    let kingPos;
    for (let i = 0; i < (8 * 8); i++) {
        if (board[i] === color + "K")
            kingPos = [(i % 8), 7 - Math.floor(i / 8)];
    }
    for (let j = 0; j < (8 * 8); j++) {
        let piece = board[j];
        if (piece !== null && piece.charAt(0) !== color) {
            let moves = PieceTypes[piece.substring(1)].getAvailableMoves(j % 8, 7 - Math.floor(j / 8), [board, board], piece.charAt(0));
            for (const [x, y] of moves) {
                if ((x === kingPos[0]) && (y === kingPos[1])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function generateArmy(lowerBound, upperBound) {
    const pool = Object.keys(PieceTypes);
    let attempts = 0;
    //TODO, gracefully handle when this loop doesn't find an army, or make army generation more intelligent
    //With lowerBound and upperBound as 3000 and 4000 it seems to work almost always, but if we let users choose...
    let army = [];
    while (attempts < 1000) {
        army = [];
        let banned_pieces = ["P", "K"];
        let pieces_found = 0;
        let strength = 0;
        while (pieces_found < 7) {
            let piece = pool[Math.floor(Math.random() * (pool.length))];
            if (!(banned_pieces.includes(piece))) {
                if (army.includes(piece) || PieceTypes[piece].tooStrong()) {
                    banned_pieces.push(piece);
                }
                army.push(piece)
                pieces_found += 1;
                strength += PieceTypes[piece].getStrength();
            }
        }
        if ((lowerBound <= strength) && (strength <= upperBound)) {
            break;
        }
        attempts += 1;
    }
    army.push("K");

    //mix the king in
    shuffleArray(army);

    let evens = [];
    let odds = [];
    let cb = [];
    for (let i = 7; i >= 0; i--) {
        if (PieceTypes[army[i]].colorbound) {
            cb.push(army[i])
            army.splice(i,1)
        }
    }
    //sort cb pieces based on strength, to prevent strange drawish endgames where each side has complete control of a color
    cb.sort((a, b) => (PieceTypes[a].strength > PieceTypes[b].strength) ? 1 :-1 )
    while (cb.length > 0) {
        if (cb.length % 2 === 0)
            evens.push(cb.pop())
        else 
            odds.push(cb.pop())
    }
    while (evens.length < 4)
        evens.push(army.pop());
    while (odds.length < 4)
        odds.push(army.pop());
       
    //mix in the colorbound pieces with the normal ones
    shuffleArray(evens);
    shuffleArray(odds);

    army = [];
    //evens and odds are bad names because of this - it randomizes which is which, though our rules are mirror symmetric atm.
    let randomBit = Math.floor(Math.random() * 2)
    for (let j = 0; j < 8; j++) {
        if (j % 2 === randomBit)
            army.push(evens.pop());
        else
            army.push(odds.pop());
    }
    return army;
}

function initialBoard() {
    let board;
    let random_army = [];
    do {
        board = Array(64).fill(null);
        for (let i = 0; i < 8; i++) {
            board[8 + i] = 'BP';
            board[48 + i] = 'WP';
        }

        random_army = generateArmy(3000, 4000)
        for (let i = 0; i < 8; i++) {
            board[i] = "B" + random_army[i];
            board[56 + i] = "W" + random_army[i];
        }

        // promotablePieces = random_army      
        //         .filter(p => !["K", "P"].includes(p)) // filter pawns and kings
        //         .sort((a, b) => (PieceTypes[a].strength < PieceTypes[b].strength) ? 1 : -1)
        //no instant loss positions
    } while (colorHasMateInOnes([board], "W"))

    //remove duplicates and sort promotion options by strength
    return board;
}

// return null if move is invalid, otherwise return updated board array
export function validMove(history, name, from, to, G, promotion) {
    let progressMade = false;
    let new_board = [...history[0]];
    // coordinates of "from" position
    const from_x = from.toLowerCase().charCodeAt(0) - 97;
    const from_y = Number(from[1]) - 1;

    // coordinates of "to" position
    const to_x = to.toLowerCase().charCodeAt(0) - 97;
    const to_y = Number(to[1]) - 1;

    let moves = PieceTypes[name.substring(1)].getAvailableMoves(from_x, from_y, history, name.charAt(0));

    for (const [x, y] of moves) {
        if ((x === to_x) && (y === to_y)) {
            //Pawn moves are special for 50 move rule, en passant, promotion
            if (name.substring(1) === "P") {
                //en passant handling
                //are we moving to an empty square in a different file
                if (history[0][(to_x + (7 - to_y) * 8)] === null && (from_x !== to_x)) {
                    //take the en passanted piece
                    new_board[(to_x + (7 - from_y) * 8)] = null;
                }
                //a pawn just moved to the last row
                else if (to_y === 0 || to_y === 7) {
                    //are we promoting a legal piece type, and is it our color.
                    if (promotion !== undefined && promotion !== null) {
                        if (G.promotablePieces.indexOf(promotion.substring(1)) > -1 && promotion.charAt(0) === name.charAt(0)) {
                            //we're moving this piece now.
                            name = promotion
                        } else {
                            return null
                        }
                    } else {
                        return null
                    }
                }
                
                //Set 50 move counter to 0 since we made a pawn move
                progressMade = true;
            }

            //will we capture something on the square we are moving to
            if (new_board[(to_x + (7 - to_y) * 8)] !== null)
                progressMade = true;
            new_board[(from_x + (7 - from_y) * 8)] = null;
            new_board[(to_x + (7 - to_y) * 8)] = name;
            //Did we make a move which puts us or leaves us in check
            if (!colorInCheck(new_board, name.charAt(0))) {
                //since the move is being made, we can update G if required. The cursed undefined check is because moving and
                //move validation kinda need to be separate things? But we're also doing fake moves in other methods. Messy!
                if (G !== undefined) {
                    if (progressMade)
                        G.noProgressCounter = 0;
                    else
                        G.noProgressCounter += 1;
                }
                return new_board;
            } else
                return null;
        }
    }

    return null;
}

function compareTwoBoards(A, B) {
    for (let i = 0; i < 8 * 8; i++) {
        if (A[i] !== B[i])
            return false;
    }
    return true;
}

//TODO, make sure the legal moves are the same in all positions
function isRepetitionDraw(history) {
    let count = 0;
    let A = history[0];
    //incrementing by 2 so we don't count a position with other side to move as the same
    for (let i = 0; i < history.length; i += 2)
        if (compareTwoBoards(A, history[i])) {
            count += 1
            if (count >= 3)
                return true;
        }
}

function insufficentMaterialDraw(board) {
    let wa = 0;
    let ba = 0;
    let lsFound = false;
    let dsFound = false;
    for (let i = 0; i < 8 * 8; i++) {
        if (board[i] !== null) {
            let piece = board[i];
            let name = piece.substring(1);
            if (name !== "K") {
                //can this piece give mate on its own
                if (!PieceTypes[name].colorbound) {
                    if (!PieceTypes[name].isInsufficient()) {
                        return false;
                    }
                    //this piece can control both light squares and dark squares
                    lsFound = true;
                    dsFound = true;
                } else {
                    //this returns true in some checkerboard
                    if (((i / 8) + (i % 8)) % 2 === 0)
                        lsFound = true;
                    else
                        dsFound = true;
                }
                if (piece.charAt(0) === "W") {
                    //If we made it here, this piece is not sufficent on its own. We must check if there
                    //was there already a piece on the board which this can mate with (any pair of white pieces can give mate
                    //provided they can control both dark squares and light squares, or if there is a black piece which can control other color)
                    wa += 1;
                    if (wa >= 2 && lsFound && dsFound)
                        return false;
                } else { //same stuff for black
                    ba += 1;
                    if (ba >= 2 && lsFound && dsFound)
                        return false;
                }
            }
        }
    }

    //If we made it here, we know that we did not find many pieces controlling opposite colors
    //either one side has no pieces and the other has insufficient material
    //or both have pieces colorbound to same squares.
    //We only need to return false in the case where both sides have pieces which control opposite color complexes.
    return (wa === 0 || ba === 0) || !(lsFound && dsFound);
}

export const Chess = {
    name: "Chess",

    setup: () => {
        let initialPos = initialBoard();
        let startTime = 600 * 1000;
        return ({
            history: [initialPos],
            promotablePieces: [...new Set(
                initialPos.filter(p => p !== null)
                .map(p => p.substring(1)) // remove color
                .filter(p => !["K", "P"].includes(p)) // filter pawns and kings
                .sort((a, b) => (PieceTypes[a].strength < PieceTypes[b].strength) ? 1 : -1)
            )],

            move_history: [],
            // by default white to move 
            // TODO: change to be dynamic for load from pos
            whiteTurn: true,
            // "" "W" "B" depending on who is in check
            inCheck: "",
            noProgressCounter: 0,

            // times for each of the players (multiplied by 1000 for ms)
            startTime:  startTime,
            wTime:      startTime,
            bTime:      startTime,
            increment:  0 * 1000,
            last_event: Date.now(),
        })
    },

    turn: {
        minMoves: 1,
        maxMoves: 1,
    },

    moves: {
        // moves a piece and produces new board, if move is illegal: returns null
        movePiece: (G, ctx, piece, from, to, promotion) => {
            // simulate move
            let board = validMove(G.history, piece.name, from, to, G, promotion);

            if (board !== null) {
                // don't start timers until first move
                if (G.history.length <= 2) {
                    G.last_event = Date.now();
                    G.wTime = G.startTime;
                    G.bTime = G.startTime;
                }
                else
                    handleTimers(G, G.whiteTurn);
                
                G.history.unshift(board); // prepend new board to history
                G.whiteTurn = piece.name.charAt(0) !== "W";
                G.move_history.unshift([`${piece.name}@${from}`, `${piece.name}@${to}`]);
                const color = G.whiteTurn ? "W" : "B";
                G.inCheck = colorInCheck(board, color) ? color : "";
            } else
                return INVALID_MOVE;
        },
        timeout: (G, ctx) => {
            handleTimers(G, G.whiteTurn);
            // console.log("timeout!", G.wTime, G.bTime);
        },
    },

    endIf: (G, ctx) => {
        // Check for timeout
        if(G.bTime <= 0)
            return {winner: "White"};
        if(G.wTime <= 0)
            return {winner: "Black"};


        const board = G.history[0]; 
        // check if white in stalemate
        if (G.whiteTurn && colorInStalemate(G.history, "W")) {
            if (colorInCheck(board, "W"))
                // winner = black
                return {winner: "Black"};
            return {draw: true};
        }

        // check if black in stalemate
        if (!G.whiteTurn && colorInStalemate(G.history, "B")) {
            if (colorInCheck(board, "B"))
                // winner = white
                return {winner: "White"};
            return {draw: true};
        }

        //check the weird draws
        if (G.noProgressCounter >= 200 || isRepetitionDraw(G.history) || insufficentMaterialDraw(G.history[0]))
            return {draw: true};
    },

};