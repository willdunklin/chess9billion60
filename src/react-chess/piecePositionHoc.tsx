import React from 'react';

export const piecePositionHoc = (Piece: (props: any) => JSX.Element): ((props: any) => JSX.Element) =>
{
  return function (props: any) {
    let onMouseDown = props.onMouseDown,
        onMouseUp = props.onMouseUp,
        onTouchEnd = props.onTouchEnd,
        onTouchStart = props.onTouchStart,
        style = props.style,
        isMoving = props.isMoving,
        cursor = props.cursor;

    let y = 7 - props.y;

    let styles = Object.assign({}, style, {
      position: 'absolute',
      left: props.x * 12.5 + '%',
      top: (y * 12.5 + 0.5) + '%',
      //The pieces on the board are always 12.5% of the board, but if we want to render little ones this is good,
      //or if we want the pieces to be contained in something which isn't the board
      width: props.size === undefined ? '12.5%' : props.size,
      height: props.size === undefined ? '12.5%' : props.size,
      textAlign: 'center',
      cursor: cursor,
      userSelect: 'none',
      zIndex: isMoving ? 2 : undefined
    });

    return (
      <div
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        onTouchStart={onTouchStart}
        style={styles}
      >
        <Piece size={'85%'} />
      </div>
    );
  };
}
