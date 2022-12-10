import React from 'react';
import CSS from 'csstype';

const square = 100 / 8;
const squareSize = `${square}%`;
const squareStyles: CSS.Properties = {
    width: squareSize,
    paddingBottom: squareSize,
    float: 'left',
    position: 'relative',
    //pointerEvents: 'none'
};

interface TileProps {
    xpos: number;
    ypos: number;
    targetTile: { x: number, y: number } | null;
    background: string;
    text: string | JSX.Element;
    onClick: (xpos: number, ypos: number) => void;
}

export const Tile = (props: TileProps) => {
    const { xpos, ypos, targetTile, background, text, onClick } = props;
    let x = xpos;
    let y = ypos;

    const isTarget = targetTile !== null && targetTile.x === x && targetTile.y === y;
    const boxShadow = isTarget ? 'inset 0px 0px 0px 0.4vmin yellow' : undefined;
    const styles: CSS.Properties = Object.assign({background, boxShadow}, squareStyles);

    return (
        <div style={styles} onClick={() => {onClick(x, y)}}>
            {text}
        </div>
    );
}
