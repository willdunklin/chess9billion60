import React from 'react';

export const Dot = props => {
    const { s, pieces, isWhite, dotColor } = props;
    let {x, y, piece, square} = s;

    if (!isWhite) {
        x = 7 - x
        y = 7 - y
    }

    const scale = 12.5; // do not change
    let size = 5; // scale of dot
    let borderRadius = "100%";
    
    let pieceOnSquare = pieces.find(p => p.split("@")[1] === square) !== undefined;
    // make circle if the dot lands on a piece
    if (pieceOnSquare)
        size = 12;

    const dot_style = {
        position: "absolute",

        width:  `${size}%`,
        height: `${size}%`,
        top:  `${((scale-size)/2) + (scale * (7-y))}%`,
        left: `${((scale-size)/2) + (scale * x)}%`,

        background: `${dotColor}`,
        borderRadius: `${borderRadius}`,
        pointerEvents : "none",
        mask: ''
    };
    
    // make circle if the dot lands on a piece
    if (pieceOnSquare)
        dot_style['background'] = `radial-gradient(ellipse at center, #0000 58%, ${dotColor} 40%)`;

    return (
        <div 
            className="dot"
            key={`dot-${x}-${y}-${piece}`}
            style={dot_style}>
        </div>
    );
  }