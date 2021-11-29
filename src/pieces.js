const W = leaper(1, 0);
const F = leaper(1, 1);
const N = leaper(2, 1);
const C = leaper(3, 1);
const Z = leaper(3, 2);
const J = leaper(4, 1);
const L = leaper(4, 3);
const K = W.concat(F);

function leaper(int1, int2, x=0, y=0) {
    return [[x+int1, y+int2], [x-int1, y+int2], [x+int1, y-int2], [x-int1, y-int2], [x+int2, y+int1], [x-int2, y+int1], [x+int2, y-int1], [x-int2, y-int1]] 
}

function isInBounds(int1, int2) {
    return( 0 <= int1 <= 7 && 0 <= int2 <= 7);
}

function rider(startx, starty, gameboard, color, intervals, n=100) {
    var answers = []
    intervals.forEach((vector) => {
        var xtemp = startx + vector[0]
        var ytemp = starty + vector[1]
        var i = 0
        while (isInBounds(xtemp,ytemp)) {
            var target = gameboard[xtemp + 8* (7 - ytemp)]
            console.log(target)
            if (target === null)
                answers.push([xtemp, ytemp])
            else if (target.charAt(0) !== color) {
                answers.push([xtemp, ytemp])
                break
            }
            else
                break

            xtemp = xtemp + vector[0]
            ytemp = ytemp + vector[1]
            i += 1
        }
    });
    return answers
}

class Piece {

    getAvailableMoves = function(x, y, gameboard, color) {return []}

    constructor(id, strength, getAvailableMoves, canPromote = false) {
        this.getAvailableMoves = getAvailableMoves
        this.id = id
        this.strength = strength
        this.canPromote = canPromote
    }
}

module.exports = {
    "BZ" : new Piece("BZ", 180, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,Z)}),
    "WB" : new Piece("WB", 180, (x,y,gameboard,color) => {return rider(x,y,gameboard,color,F)})
}