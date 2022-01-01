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
    intervals.forEach(([dx, dy]) => {
        let x = startx + dx;
        let y = starty + dy;
        let i = 0;
        // raycast rider piece 
        while (isInBounds(x, y) && i < n) {
            if (history !== null) {
                let target = history[0][x + 8 * (7 - y)];
                if (target === null)
                    squares.push([x, y]);
                else if (target.charAt(0) !== color) {
                    squares.push([x, y]);
                    break;
                } else {
                    break;
                }
            } else {
                squares.push([x, y]);
            }

            x = x + dx;
            y = y + dy;
            i += 1;
        }
    });
    return squares;
}

class Piece {
    allowOnlyOne() {
        this.onlyOne = true
        return this 
    }

    tooStrong() {
        return this.onlyOne
    }

    makePromoter() {
        this.canPromote = true
        return this
    }

    markColorbound() {
        this.colorbound = true
        return this
    }

    getAvailableMoves = function (x, y, gameboard, color) {
        return [];
    }

    isPromoter() {
        return this.canPromote;
    }

    getStrength() {
        return this.strength;
    }

    name(string) {
        this.pieceName = string
        return this
    }

    getName() {
        return this.pieceName;
    }

    setBlurb(string) {
        this.blurb = string
        return this
    }

    getBlurb() {
        return this.blurb;
    }

    constructor(id, strength, getAvailableMoves) {
        this.getAvailableMoves = getAvailableMoves;
        this.id = id;
        this.strength = strength;
        this.canPromote = false;
        this.colorbound = false;
        this.onlyOne = false;
        this.pieceName = "Unnamed Piece";
        this.blurb = "Weird huh"
    }
}

// TODO: export these variables (export const ...)
// have to fix Game.js's use of PieceTypes then
const N =   new Piece("N"  , 315, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,N_leap,1)}).name("Knight").setBlurb("A Chess Classic")
const R =   new Piece("R"  , 500, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W_leap)}).name("Rook").setBlurb("A Chess Classic")
const B =   new Piece("B"  , 315, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F_leap)}).markColorbound().name("Bishop").setBlurb("A Chess Classic")
const Q =   new Piece("Q"  , 975, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap)}).allowOnlyOne().name("Queen").setBlurb("A Chess Classic")
const K =   new Piece("K"  , 100000, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,1)}).allowOnlyOne().name("King").setBlurb("A Chess Classic")
const NR =  new Piece("NR" , 475 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,N_leap)}).name("Knightrider").setBlurb("If knights weren't lazy")
const M =   new Piece("M"  , 375 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,1)}).name("Mann").setBlurb("Like the king, but poor")
const F =   new Piece("F"  , 150 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F_leap,1)}).markColorbound().name("Ferz").setBlurb("Slow and steady wins the race")
const W =   new Piece("W"  , 170 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W_leap,1)}).name("Wazir").setBlurb("Wins some endgames")
const A =   new Piece("A"  , 1250, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap).concat(rider(x,y,gameboard,color,N_leap,1))}).allowOnlyOne().name("Amazon").setBlurb("Terrifying")
const CH =  new Piece("CH" , 800 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W_leap).concat(rider(x,y,gameboard,color,N_leap,1))}).allowOnlyOne().name("Chancellor").setBlurb("The power behind the throne")
const AB =  new Piece("AB" , 770 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F_leap).concat(rider(x,y,gameboard,color,N_leap,1))}).allowOnlyOne().name("Archbishop").setBlurb("Owns a cool cathedral")
const R4 =  new Piece("R4" , 380 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W_leap,4)}).name("Short Rook").setBlurb("Bullies the shorter rook")
const R2 =  new Piece("R2" , 270 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W_leap,2)}).name("Shorter Rook").setBlurb("Bullies the wazir")
const B4 =  new Piece("B4" , 250 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F_leap,4)}).markColorbound().name("Short Bishop").setBlurb("It's not as good as a bishop")
const B2 =  new Piece("B2" , 220 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F_leap,2)}).markColorbound().name("Shorter Bishop").setBlurb("Bullies the Ferz")
const U =   new Piece("U"  , 900 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F_leap).concat(rider(x,y,gameboard,color,N_leap))}).allowOnlyOne().name("Unicorn").setBlurb("Pointy!")
const C =   new Piece("C"  , 220 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,C_leap,1)}).markColorbound().name("Camel").setBlurb("Cannot leave its color")
const Z =   new Piece("Z"  , 180 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,Z_leap,1)}).name("Zebra").setBlurb("Annoying to maneuver")
const ZC =  new Piece("ZC" , 400 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,Z_leap,1).concat(rider(x,y,gameboard,color,C_leap,1))}).allowOnlyOne().name("Zebramel").setBlurb("Watch out for smothered mates!")
const CN =  new Piece("CN" , 600 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,1).concat(rider(x,y,gameboard,color,N_leap,1))}).name("Centaur").setBlurb("A strong piece with limited range")
const CNR = new Piece("CNR", 900 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,1).concat(rider(x,y,gameboard,color,N_leap))}).allowOnlyOne().name("Centaur Rider").setBlurb("Scary")
const BC =  new Piece("BC" , 750 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,C_leap,1).concat(rider(x,y,gameboard,color,F_leap))}).markColorbound().name("Bishop Camel").setBlurb("Queen tier, but just on one color!")
const NZ =  new Piece("NZ" , 600 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,N_leap,1).concat(rider(x,y,gameboard,color,Z_leap,1))}).allowOnlyOne().name("Zorse").setBlurb("Do not leave holes in your position.")
const M2 =  new Piece("M2" , 500 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,2)}).name("Freddie Mercury").setBlurb("Part of Queen!")
//made up strength values
const BM =   new Piece("BM" , 550 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,1).concat(rider(x,y,gameboard,color,F_leap))}).name("Cardinal").setBlurb("Finally the Bishop can reach both colors")
const RM =   new Piece("RM" , 700 , (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K_leap,1).concat(rider(x,y,gameboard,color,W_leap))}).name("Rook Mann").setBlurb("Can often stop a king and pawn")
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
    }).makePromoter().name("Pawn").setBlurb("What will you promote to?")

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