const W = leaper(1, 0);
const F = leaper(1, 1);
const N = leaper(2, 1);
const C = leaper(3, 1);
const Z = leaper(3, 2);
const J = leaper(4, 1);
const L = leaper(4, 3);
const K = W.concat(F);

function leaper(dx, dy, x=0, y=0) {
    return [[x+dx, y+dy], [x-dx, y+dy], [x+dx, y-dy], [x-dx, y-dy], [x+dy, y+dx], [x-dy, y+dx], [x+dy, y-dx], [x-dy, y-dx]] 
}

function isInBounds(x, y) {
    return((0 <= x) && (x <= 7)  && (0 <= y) && (y <= 7));
}

function rider(startx, starty, gameboard, color, intervals, n=7) {
    var squares = [];
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
        let i = 0
        // raycast rider piece 
        while (isInBounds(x, y) && i <= n) {
            var target = gameboard[x + 8 * (7 - y)];
            if (target === null)
                squares.push([x, y]);
            else if (target.charAt(0) !== color) {
                squares.push([x, y]);
                break;
            }
            else {
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

    getAvailableMoves = function(x, y, gameboard, color) {return []}

    canPromote() {
        return this.canPromote;
    }

    isColorbound() {
        return this.colorbound;
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
    "N" : new Piece("N", 315, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,N,1)}),
    "R" : new Piece("R", 500, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W)}),
    "B" : new Piece("B", 315, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F)}),
    "Q" : new Piece("Q", 975, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K)}),
    "K" : new Piece("K", 10000, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K,1)}),
    //TODO, FIX
    "P" : new Piece("P", 100, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W,1)}),
    "NR" : new Piece("NR", 475, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,N)}),
    "M" : new Piece("M", 375, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K,1)}),
    "F" : new Piece("F", 150, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F,1)}),
    "W" : new Piece("W", 170, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W,1)}),
    "A" : new Piece("A", 1250, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K).concat(rider(x,y,gameboard,color,N,1))}),
    "CH" : new Piece("CH", 800, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W).concat(rider(x,y,gameboard,color,N,1))}),
    "AB" : new Piece("AB", 770, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F).concat(rider(x,y,gameboard,color,N,1))}),
    "R4" : new Piece("R4", 380, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W,4)}),
    "R2" : new Piece("R2", 270, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,W,2)}),
    "B4" : new Piece("B4", 250, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F,4)}),
    "B2" : new Piece("B2", 220, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F,2)}),
    "U" : new Piece("U", 900, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F).concat(rider(x,y,gameboard,color,N))}),
    "C" : new Piece("C", 220, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,C,1)}),
    "Z" : new Piece("Z", 180, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,Z,1)}),
    "ZC" : new Piece("ZC", 400, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,Z,1).concat(rider(x,y,gameboard,color,C,1))}),
    "CN" : new Piece("CN", 600, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K,1).concat(rider(x,y,gameboard,color,N,1))}),
    "CNR" : new Piece("CNR", 900, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K,1).concat(rider(x,y,gameboard,color,N))}),
    "BC" : new Piece("BC", 750, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,C,1).concat(rider(x,y,gameboard,color,F))}),
    "NZ" : new Piece("NZ", 600, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,N,1).concat(rider(x,y,gameboard,color,Z,1))}),
    "M2" : new Piece("M2", 500, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,K,2)}),
}