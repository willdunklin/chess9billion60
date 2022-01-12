import React from 'react'

const square = 100 / 8;
const squareSize = `${square}%`;
const squareStyles = {
    width: squareSize,
    paddingBottom: squareSize,
    float: 'left',
    position: 'relative',
    pointerEvents: 'none'
};

export const Tile = props => {
    const { xpos, ypos, targetTile, background, text } = props;
    let x = xpos;
    let y = ypos;

    const isTarget = targetTile && targetTile.x === x && targetTile.y === y
    const boxShadow = isTarget ? 'inset 0px 0px 0px 0.4vmin yellow' : undefined
    const styles = Object.assign({background, boxShadow}, squareStyles)

    return (
        <div style={styles}>
            {text}
        </div>
    );
}