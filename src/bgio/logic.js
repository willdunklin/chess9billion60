const { PieceTypes } = require("./pieces.js");

export function initialBoard() {
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
    } while (colorHasMateInN([board], "W", 2))
    //remove duplicates and sort promotion options by strength
    return board;
}

//checkmate checking is just stalemate + check. logic could either be added to this method or just two calls
export function colorInStalemate(history, color) {
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

export function colorInCheck(board, color) {
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

//TODO, make sure the legal moves are the same in all positions
export function isRepetitionDraw(history) {
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

export function insufficentMaterialDraw(board) {
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

function colorHasMateInN(history, color, N) {
    if (N === 0 || colorInStalemate(history, color))
        return false;
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
                let result = validMove(history, piece, `${String.fromCharCode(97 + from[0])}${1+from[1]}`, `${String.fromCharCode(97 + (x))}${1+y}`);
                if (result !== null) {
                    history.unshift(result);
                    if (colorInCheck(result, otherColor) && colorInStalemate(history, otherColor)) {
                        //fix the board I prepended in stalemate check
                        //console.log("mate at "+ N +  "\n" + history[0] + "\n" + history[1])
                        history.splice(0, 1);
                        return true;
                    } else if (N > 1) {
                        let canDefend = false
                        for (let k = 0; (k < 8 * 8) && !canDefend; k++) {
                            let enemyPiece = history[0][k];
                            let from2 = [k % 8, 7 - Math.floor(k / 8)];
                            if (enemyPiece !== null && enemyPiece.charAt(0) === otherColor) {
                                let responses = PieceTypes[enemyPiece.substring(1)].getAvailableMoves(from2[0], from2[1], history, enemyPiece.charAt(0));
                                for (const [x1, y1] of responses) {
                                    let secondresult = validMove(history, enemyPiece, `${String.fromCharCode(97 + from2[0])}${1+from2[1]}`, `${String.fromCharCode(97 + (x1))}${1+y1}`);
                                    if (secondresult !== null) {
                                        history.unshift(secondresult)
                                        if(!colorHasMateInN(history, color, N - 1))
                                            canDefend = true
                                        history.splice(0, 1);
                                    }
                                }
                            }
                        }
                        if (!canDefend) {
                            //console.log(N +  "\n" + history[0] + "\n" + history[1])
                            history.splice(0, 1);
                            return true;
                        }
                    }
                    //fix the board I prepended
                    history.splice(0, 1);
                }
            }
        }
    }
    return false;
}


// Helpers 
function compareTwoBoards(A, B) {
    for (let i = 0; i < 8 * 8; i++) {
        if (A[i] !== B[i])
            return false;
    }
    return true;
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
