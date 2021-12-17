const W = leaper(1, 0);
const F = leaper(1, 1);
const N = leaper(2, 1);
const C = leaper(3, 1);
const Z = leaper(3, 2);
//const J = leaper(4, 1);
//const L = leaper(4, 3);
const K = W.concat(F);

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

module.exports = {
    "N"   : new Piece("N"  , 315, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,N,1)}),
    "R"   : new Piece("R"  , 500, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W)}),
    "B"   : new Piece("B"  , 315, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F)}, false, true),
    "Q"   : new Piece("Q"  , 975, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K)}),
    "K"   : new Piece("K"  , 100000, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K,1)}),
    "NR"  : new Piece("NR" , 475 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,N)}),
    "M"   : new Piece("M"  , 375 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K,1)}),
    "F"   : new Piece("F"  , 150 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F,1)}, false, true),
    "W"   : new Piece("W"  , 170 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W,1)}),
    "A"   : new Piece("A"  , 1250, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K).concat(rider(x,y,gameboard,color,N,1))}),
    "CH"  : new Piece("CH" , 800 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W).concat(rider(x,y,gameboard,color,N,1))}),
    "AB"  : new Piece("AB" , 770 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F).concat(rider(x,y,gameboard,color,N,1))}),
    "R4"  : new Piece("R4" , 380 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W,4)}),
    "R2"  : new Piece("R2" , 270 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W,2)}),
    "B4"  : new Piece("B4" , 250 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F,4)}, false, true),
    "B2"  : new Piece("B2" , 220 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F,2)}, false, true),
    "U"   : new Piece("U"  , 900 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F).concat(rider(x,y,gameboard,color,N))}),
    "C"   : new Piece("C"  , 220 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,C,1)}, false, true),
    "Z"   : new Piece("Z"  , 180 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,Z,1)}),
    "ZC"  : new Piece("ZC" , 400 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,Z,1).concat(rider(x,y,gameboard,color,C,1))}),
    "CN"  : new Piece("CN" , 600 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K,1).concat(rider(x,y,gameboard,color,N,1))}),
    "CNR" : new Piece("CNR", 900 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K,1).concat(rider(x,y,gameboard,color,N))}),
    "BC"  : new Piece("BC" , 750 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,C,1).concat(rider(x,y,gameboard,color,F))}, false, true),
    "NZ"  : new Piece("NZ" , 600 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,N,1).concat(rider(x,y,gameboard,color,Z,1))}),
    "M2"  : new Piece("M2" , 500 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K,2)}),
    //made up strength values
    "BM"  : new Piece("BM" , 550 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K,1).concat(rider(x,y,gameboard,color,F))}),
    "RM"  : new Piece("RM" , 700 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K,1).concat(rider(x,y,gameboard,color,W))}),
    //TODO, fix en passant
    "P"   : new Piece("P", 100, (x, y, history, color) => {
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
}