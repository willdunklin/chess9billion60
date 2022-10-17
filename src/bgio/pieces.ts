const atomList : {[key : string] : number[][]} = {
    "W" : leaper(1, 0),
    "F" : leaper(1, 1),
    "N" : leaper(2, 1),
    "C" : leaper(3, 1),
    "Z" : leaper(3, 2),
    "K" : leaper(1, 0).concat(leaper(1, 1))
}

function leaper(dx: number, dy: number, x: number=0, y: number=0) {
    return [
        [x + dx, y + dy],
        [x - dx, y + dy],
        [x + dx, y - dy],
        [x - dx, y - dy],
        [x + dy, y + dx],
        [x - dy, y + dx],
        [x + dy, y - dx],
        [x - dy, y - dx]
    ];
}

function isInBounds(x: number, y: number) {
    return ((0 <= x) && (x <= 7) && (0 <= y) && (y <= 7));
}

function rider(startx: number, starty: number, history: Array<Array<string|null>>|null, color: string, intervals: Array<Array<number>>, n = 7) {
    //TODO there seems to be an implicit assumption here that the atoms never overlap eachother. Should probably prevent adding duplicate squares 
    let squares: Array<Array<number>> = [];
    
    intervals.forEach(([dx, dy]: Array<number>) => {
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

export class Piece {
    id: string;
    strength: number;
    canPromote: boolean;
    colorbound: boolean;
    onlyOne: boolean;
    pieceName: string;
    blurb: string;
    ruleText: string;
    canMate: boolean;
    betza: string;

    allowOnlyOne() {
        this.onlyOne = true;
        return this;
    }

    tooStrong() {
        return this.onlyOne;
    }

    makePromoter() {
        this.canPromote = true;
        return this;
    }

    markColorbound() {
        this.canMate = false;
        this.colorbound = true;
        return this;
    }

    getAvailableMoves = function (_x: number, _y: number, _gameboard: Array<Array<string|null>>|null, _color: string): number[][] {
        return [];
    }

    isPromoter() {
        return this.canPromote;
    }

    getStrength() {
        return this.strength;
    }

    name(string: string) {
        this.pieceName = string;
        return this;
    }

    getName() {
        return this.pieceName;
    }

    setBlurb(string: string) {
        this.blurb = string;
        return this;
    }

    getBlurb() {
        return this.blurb;
    }

    setRules(string: string) {
        this.ruleText = string;
        return this;
    }

    getRules() {
        return this.ruleText;
    }

    cantMate() {
        this.canMate = false;
        return this;
    }

    isInsufficient() {
        return !this.canMate;
    }

    constructor(id: string, strength: number, atoms: Array<[string, number]>, move_function?: (x: number, y: number, gameboard: Array<Array<string | null>> | null, color: string) => number[][]) {
        if (move_function === undefined || move_function === null) {
            this.getAvailableMoves = (x,y,gameboard,color) => {
                let moves: number[][]
                if (atoms[0][1] === 0)
                        moves = rider(x,y,gameboard,color, atomList[atoms[0][0]])
                    else
                        moves = rider(x,y,gameboard,color, atomList[atoms[0][0]], atoms[0][1])
                for (let i = 1; i < atoms.length; i++) {
                    if (atoms[i][1] === 0)
                        moves.push(...rider(x,y,gameboard,color, atomList[atoms[i][0]]))
                    else
                        moves.push(...rider(x,y,gameboard,color, atomList[atoms[i][0]], atoms[i][1]))
                }
                return moves
            }
        } else {
            this.getAvailableMoves = move_function
        }
        this.id = id;
        this.strength = strength;
        this.canPromote = false;
        this.colorbound = false;
        this.onlyOne = false;
        this.pieceName = "Unnamed Piece";
        this.blurb = "Weird huh";
        this.ruleText = "Moves like Something";
        this.canMate = true;
        this.betza = ""
        if (id !== "P") {
            for (let i = 0; i < atoms.length; i++) {
                const num = atoms[i][1].toString();
                this.betza += atoms[i][0] + (num === '1' ? '' : num);
            }
        } else {
            this.betza = "fmWfceF"
        }
    }
}

// TODO: export these variables (export const ...)
// have to fix Game.js's use of PieceTypes then
const N   =  new Piece("N"  , 315   , [["N", 1]]).name("Knight").setBlurb("A chess classic").setRules("Standard knight moves").cantMate();
const R   =  new Piece("R"  , 500   , [["W", 0]]).name("Rook").setBlurb("A chess classic").setRules("Standard rook moves");
const B   =  new Piece("B"  , 315   , [["F", 0]]).name("Bishop").setBlurb("A chess classic").setRules("Standard bishop moves").markColorbound();
const Q   =  new Piece("Q"  , 975   , [["K", 0]]).name("Queen").setBlurb("A chess classic").setRules("Standard queen moves").allowOnlyOne();
const K   =  new Piece("K"  , 100000, [["K", 1]]).name("King").setBlurb("A chess classic").setRules("Standard king moves").allowOnlyOne();
const NR  =  new Piece("NR" , 475   , [["N", 0]]).name("Knightrider").setBlurb("If knights weren't lazy").setRules("Knight moves, but can keep going").cantMate();
const M   =  new Piece("M"  , 375   , [["K", 1]]).name("Mann").setBlurb("Like the king, but poor").setRules("Moves like a King");
const F   =  new Piece("F"  , 150   , [["F", 1]]).name("Ferz").setBlurb("Slow and steady wins the race").setRules("Bishop moves up to one square").markColorbound();
const W   =  new Piece("W"  , 170   , [["W", 1]]).name("Wazir").setBlurb("Wins some endgames").setRules("Rook moves up to one square").cantMate();
const A   =  new Piece("A"  , 1250  , [["K", 0], ["N", 1]]).name("Amazon").setBlurb("Terrifying").setRules("Combo queen and knight").allowOnlyOne();
const CH  =  new Piece("CH" , 800   , [["W", 0], ["N", 1]]).name("Chancellor").setBlurb("The power behind the throne").setRules("Combo rook and knight").allowOnlyOne();
const AB  =  new Piece("AB" , 770   , [["F", 0], ["N", 1]]).name("Archbishop").setBlurb("Owns a cool cathedral").setRules("Combo bishop and knight").allowOnlyOne();
const R4  =  new Piece("R4" , 380   , [["W", 4]]).name("Short Rook").setBlurb("Bullies the shorter rook").setRules("Rook moves up to four squares");
const R2  =  new Piece("R2" , 270   , [["W", 2]]).name("Shorter Rook").setBlurb("Bullies the wazir").setRules("Rook moves up to two squares");
const B4  =  new Piece("B4" , 250   , [["F", 4]]).name("Short Bishop").setBlurb("Not as good as a bishop").setRules("Bishop moves up to four squares").markColorbound();
const B2  =  new Piece("B2" , 220   , [["F", 2]]).name("Shorter Bishop").setBlurb("Not as good as a short bishop").setRules("Bishop moves up to two squares").markColorbound();
const U   =  new Piece("U"  , 900   , [["N", 0], ["F", 0]]).name("Unicorn").setBlurb("Twelve directions!").setRules("Combo knightrider and bishop").allowOnlyOne();
const C   =  new Piece("C"  , 220   , [["C", 1]]).name("Camel").setBlurb("Cannot leave its color").setRules("3 one way 1 the other").markColorbound();
const Z   =  new Piece("Z"  , 180   , [["Z", 1]]).name("Zebra").setBlurb("Annoying to maneuver").setRules("3 one way 2 the other").cantMate();
const ZC  =  new Piece("ZC" , 400   , [["Z", 1], ["C", 1]]).name("Zebramel").setBlurb("Watch out for smothered mates!").setRules("Combo Camel (3,1) and Zebra (3,2)").allowOnlyOne();
const CN  =  new Piece("CN" , 600   , [["N", 1], ["K", 1]]).name("Centaur").setBlurb("A strong piece with limited range").setRules("King and Knight moves");
const CNR =  new Piece("CNR", 900   , [["N", 0], ["K", 1]]).name("Centaur Rider").setBlurb("Scary").setRules("King and Knightrider moves").allowOnlyOne();
const BC  =  new Piece("BC" , 750   , [["F", 0], ["C", 1]]).name("Bishop Camel").setBlurb("Queen tier, but just on one color!").setRules("Combo Camel (3,1) and Bishop").markColorbound();
const NZ  =  new Piece("NZ" , 600   , [["N", 1], ["Z", 1]]).name("Zorse").setBlurb("Do not leave holes in your position.").setRules("Combo Zebra (3,2) and Knight").cantMate().allowOnlyOne();
const M2  =  new Piece("M2" , 500   , [["K", 2]]).name("Freddie Mercury").setBlurb("Part of Queen!").setRules("Queen moves up to two squares");
const BM  =  new Piece("BM" , 550   , [["K", 1], ["F", 0]]).name("Cardinal").setBlurb("Can reach both colors!").setRules("Combo Bishop and King");
const RM  =  new Piece("RM" , 700   , [["K", 1], ["W", 0]]).name("Rook Mann").setBlurb("The rook's been working out").setRules("Combo Rook and King");
//Pawn is very special
const P =  new Piece("P", 100, [], (x, y, history, color) => {
        let direction = 1;
        let home_rank = 1;
        let en_passant_rank = 4;
        if (color === "B") {
            direction = -1;
            home_rank = 7 - home_rank;
            en_passant_rank = 7 - en_passant_rank;
        }
        let moves: number[][] = [];
        let xtemp = x;
        let ytemp = y + direction;

        if (history === null) {
            moves.push([xtemp, ytemp])
            if (isInBounds(xtemp+1, ytemp))
                moves.push([xtemp+1, ytemp]);
            if (isInBounds(xtemp-1, ytemp))
                moves.push([xtemp-1, ytemp]);
            if (y === home_rank) {
                ytemp += direction;
                moves.push([xtemp, ytemp]);
            }
            return moves;
        }
        let gameboard = history[0];
        //check for forward moves, including double moves on first turn
        if (isInBounds(xtemp, ytemp)) {
            if (gameboard[xtemp + 8 * (7 - ytemp)] === null) {
                moves.push([xtemp, ytemp]);
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
                if (gameboard[xtemp + 8 * (7 - ytemp)]?.charAt(0) !== color)
                    moves.push([xtemp, ytemp]);
                //begin vague enpassant check - requires knowledge of history to be perfect.
            } else if (y === en_passant_rank && (gameboard[xtemp + 8 * (7 - y)] === "WP" || gameboard[xtemp + 8 * (7 - y)] === "BP")) {
                if (gameboard[xtemp + 8 * (7 - y)]?.charAt(0) !== color)
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
                if (gameboard[xtemp + 8 * (7 - ytemp)]?.charAt(0) !== color)
                    moves.push([xtemp, ytemp]);
                //begin vague enpassant check - requires knowledge of history to be perfect.
            } else if (y === en_passant_rank && (gameboard[xtemp + 8 * (7 - y)] === "WP" || gameboard[xtemp + 8 * (7 - y)] === "BP")) {
                if (gameboard[xtemp + 8 * (7 - y)]?.charAt(0) !== color)
                    //was the last move a double pawn push in the direction I want to take? Calling history[1] here is fine since the pawns can't en passant move 1
                    if (history[1][xtemp + 8 * (7 - (y + 2 * direction))] === gameboard[xtemp + 8 * (7 - y)] && gameboard[xtemp + 8 * (7 - (y + 2 * direction))] === null)
                        moves.push([xtemp, ytemp]);
            }
        }
        return moves;
    }).name("Pawn").setBlurb("Google en passant").setRules("Standard pawn moves").makePromoter();

export const PieceTypes: { [key: string]: Piece } = {
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
};
