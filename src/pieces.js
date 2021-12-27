const W_leap = leaper(1, 0);
const F_leap = leaper(1, 1);
const N_leap = leaper(2, 1);
const C_leap = leaper(3, 1);
const Z_leap = leaper(3, 2);
//const J_leap = leaper(4, 1);
//const L_leap = leaper(4, 3);
const K_leap = W_leap.concat(F_leap);

function leaper(dx, dy, x = 0, y = 0) {
    return [
        [x + dx, y + dy],
        [x - dx, y + dy],
        [x + dx, y - dy],
        [x - dx, y - dy],
        [x + dy, y + dx],
        [x - dy, y + dx],
        [x + dy, y - dx],
        [x - dy, y - dx]
    ]
}

function isInBounds(x, y) {
    return ((0 <= x) && (x <= 7) && (0 <= y) && (y <= 7));
}

function rider(startx, starty, history, color, intervals, n = 7) {
    let squares = [];
    // let squares = intervals.map(
    //     ([x, y]) => {
    //         // look at continuation of vector to n steps
    //         return [...Array(n-1).keys()].map(a => [(a+1)*x,(a+1)*y])
    //     }).flat().map(
    //         // adjust by offset
    //         ([x, y]) => [startx+x, starty+y]
    //     ).filter(
    //         // filter for moves w/i bounds
    //         ([x, y]) => isInBounds(x,y)
    //     );
    // squares = [...new Set(squares)];

    let gameboard = history[0]
    intervals.forEach(([dx, dy]) => {
        let x = startx + dx;
        let y = starty + dy;
        let i = 0;
        // raycast rider piece 
        while (isInBounds(x, y) && i < n) {
            let target = gameboard[x + 8 * (7 - y)];
            if (target === null)
                squares.push([x, y]);
            else if (target.charAt(0) !== color) {
                squares.push([x, y]);
                break;
            } else {
                break;
            }

            x = x + dx;
            y = y + dy;
            i += 1;
        }
    });
    return squares;
}

class Piece {

    getAvailableMoves = function (x, y, gameboard, color) {
        return [];
    }

    isPromoter() {
        return this.canPromote;
    }

    getStrength() {
        return this.strength;
    }

    constructor(id, strength, getAvailableMoves, canPromote = false, colorbound = false) {
        this.getAvailableMoves = getAvailableMoves;
        this.id = id;
        this.strength = strength;
        this.canPromote = canPromote;
        this.colorbound = colorbound;
    }
}

// TODO: export these variables (export const ...)
// have to fix Game.js's use of PieceTypes then
const N =   new Piece("N"  , 315, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,N_leap,1)})
const R =   new Piece("R"  , 500, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W_leap)})
const B =   new Piece("B"  , 315, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F_leap)}, false, true)
const Q =   new Piece("Q"  , 975, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap)})
const K =   new Piece("K"  , 100000, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,1)})
const NR =  new Piece("NR" , 475 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,N_leap)})
const M =   new Piece("M"  , 375 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,1)})
const F =   new Piece("F"  , 150 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F_leap,1)}, false, true)
const W =   new Piece("W"  , 170 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W_leap,1)})
const A =   new Piece("A"  , 1250, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap).concat(rider(x,y,gameboard,color,N_leap,1))})
const CH =  new Piece("CH" , 800 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W_leap).concat(rider(x,y,gameboard,color,N_leap,1))})
const AB =  new Piece("AB" , 770 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F_leap).concat(rider(x,y,gameboard,color,N_leap,1))})
const R4 =  new Piece("R4" , 380 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W_leap,4)})
const R2 =  new Piece("R2" , 270 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W_leap,2)})
const B4 =  new Piece("B4" , 250 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F_leap,4)}, false, true)
const B2 =  new Piece("B2" , 220 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F_leap,2)}, false, true)
const U =   new Piece("U"  , 900 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F_leap).concat(rider(x,y,gameboard,color,N_leap))})
const C =   new Piece("C"  , 220 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,C_leap,1)}, false, true)
const Z =   new Piece("Z"  , 180 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,Z_leap,1)})
const ZC =  new Piece("ZC" , 400 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,Z_leap,1).concat(rider(x,y,gameboard,color,C_leap,1))})
const CN =  new Piece("CN" , 600 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,1).concat(rider(x,y,gameboard,color,N_leap,1))})
const CNR = new Piece("CNR", 900 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,1).concat(rider(x,y,gameboard,color,N_leap))})
const BC =  new Piece("BC" , 750 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,C_leap,1).concat(rider(x,y,gameboard,color,F_leap))}, false, true)
const NZ =  new Piece("NZ" , 600 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,N_leap,1).concat(rider(x,y,gameboard,color,Z_leap,1))})
const M2 =  new Piece("M2" , 500 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,2)})
//made up strength values
const BM =   new Piece("BM" , 550 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,1).concat(rider(x,y,gameboard,color,F_leap))})
const RM =   new Piece("RM" , 700 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,1).concat(rider(x,y,gameboard,color,W_leap))})
//TODO, fix en passant
const P =   new Piece("P", 100, (x, y, history, color) => {
        let gameboard = history[0];
        let direction = 1;
        let home_rank = 1;
        let en_passant_rank = 4;
        if (color === "B") {
            direction = -1;
            home_rank = 7 - home_rank;
            en_passant_rank = 7 - en_passant_rank;
        }
        let moves = [];
        let xtemp = x;
        let ytemp = y + direction;
        //check for forward moves, including double moves on first turn
        if (isInBounds(xtemp, ytemp)) {
            if (gameboard[xtemp + 8 * (7 - ytemp)] === null) {
                moves.push([xtemp, ytemp])
                if (y === home_rank) {
                    ytemp += direction;
                    if (gameboard[xtemp + 8 * (7 - ytemp)] === null) {
                        moves.push([xtemp, ytemp]);
                    }
                }
            }
        }

        //check for taking one way
        ytemp = y + direction;
        xtemp = x - 1;
        if (isInBounds(xtemp, ytemp)) {
            if (gameboard[xtemp + 8 * (7 - ytemp)] !== null) {
                if (gameboard[xtemp + 8 * (7 - ytemp)].charAt(0) !== color)
                    moves.push([xtemp, ytemp]);
                //begin vague enpassant check - requires knowledge of history to be perfect. 
            } else if (y === en_passant_rank && (gameboard[xtemp + 8 * (7 - y)] === "WP" || gameboard[xtemp + 8 * (7 - y)] === "BP")) {
                if (gameboard[xtemp + 8 * (7 - y)].charAt(0) !== color)
                    //was the last move a double pawn push in the direction I want to take? Calling history[1] here is fine since the pawns can't en passant move 1
                    if (history[1][xtemp + 8 * (7 - (y + 2 * direction))] === gameboard[xtemp + 8 * (7 - y)] && gameboard[xtemp + 8 * (7 - (y + 2 * direction))] === null)
                        moves.push([xtemp, ytemp]);
            }
        }

        //check for taking one way
        ytemp = y + direction;
        xtemp = x + 1;
        if (isInBounds(xtemp, ytemp)) {
            if (gameboard[xtemp + 8 * (7 - ytemp)] !== null) {
                if (gameboard[xtemp + 8 * (7 - ytemp)].charAt(0) !== color)
                    moves.push([xtemp, ytemp]);
                //begin vague enpassant check - requires knowledge of history to be perfect. 
            } else if (y === en_passant_rank && (gameboard[xtemp + 8 * (7 - y)] === "WP" || gameboard[xtemp + 8 * (7 - y)] === "BP")) {
                if (gameboard[xtemp + 8 * (7 - y)].charAt(0) !== color)
                    //was the last move a double pawn push in the direction I want to take? Calling history[1] here is fine since the pawns can't en passant move 1
                    if (history[1][xtemp + 8 * (7 - (y + 2 * direction))] === gameboard[xtemp + 8 * (7 - y)] && gameboard[xtemp + 8 * (7 - (y + 2 * direction))] === null)
                        moves.push([xtemp, ytemp]);
            }
        }
        return moves;
    }, true)

module.exports = {
    "N": N,
    "R": R,
    "B": B,
    "Q": Q,
    "K": K,
    "NR": NR,
    "M": M,
    "F": F,
    "W": W,
    "A": A,
    "CH": CH,
    "AB": AB,
    "R4": R4,
    "R2": R2,
    "B4": B4,
    "B2": B2,
    "U": U,
    "C": C,
    "Z": Z,
    "ZC": ZC,
    "CN": CN,
    "CNR": CNR,
    "BC": BC,
    "NZ": NZ,
    "M2": M2,
    "BM": BM,
    "RM": RM,
    "P": P,
}