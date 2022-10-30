import { PieceTypes } from "../bgio/pieces";
import CSS from "csstype";
import React, { useState } from 'react';
import { move } from "../bgio/sound";
import { charCodeOffset } from "../react-chess/decode";
import { Chess, PieceType } from "../react-chess/react-chess";
                //0 1 2 3 4 5 6 7 8
const widthMap = [4,4,4,4,4,3,3,4,4]; //anything below 4 looks dumb, don't really like 3.

const board_style: CSS.Properties = {
    "width": "100%",
    "height": "100%",
};

const name_style: CSS.Properties = {
    "fontSize" : "large"
};

const blurb_style: CSS.Properties = {
    "fontSize" : "small",
    "textAlign" : "center"
};

// Thanks SO
const getWidth = (count: number) => {
    const page_width = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
    return Math.max(180, Math.floor((page_width - 120) / widthMap[count]));
}

type VisualizerProps = {
    piece: string,
    color: string,
    count: number,
    size?: number,
};

export const Visualizer = (props: VisualizerProps) => {
    const {piece, color, count, size} = props;
    const [pieces, setPieces] = useState<string[]>([]);
    const [dots, setDots] = useState<string[]>([]);
    const [boardWidth, setBoardWidth] = useState<number>(Math.min(size || getWidth(count), getWidth(count)));
    const [x, setX] = useState(4);
    const [y, setY] = useState(4);

    const handleMove = (_p: PieceType, _fromSquare: string, toSquare: string, _promotion: string | null) => {
        setX(toSquare.toLowerCase().charCodeAt(0) - charCodeOffset);
        setY(Number(toSquare[1]) - 1);
        move(0.05);
    }

    React.useEffect(() => {
        const dot_locations1 = PieceTypes[piece].getAvailableMoves(x,y,null,"W")
                                   .map(([to_x, to_y]) => `${color + piece}@${String.fromCharCode(charCodeOffset + (to_x))}${1+to_y}`); // piece_name@to_square
        let s = getWidth(count);
        if(size !== undefined && size !== null)
            s = Math.min(s, size);

        setPieces([`${color}${piece}@${String.fromCharCode(charCodeOffset + x)}${y+1}`]);
        setDots([...new Set(dot_locations1)]);
        setBoardWidth(s);
    }, [color, count, x, y, size, piece]);

    return (
        <div style={{
                top: "0",
                left: "0",
                padding: '5px',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: "1",
                userSelect: "none",
                width: boardWidth + "px",
                height: (boardWidth + 120) + "px"
        }}>
            <div style={name_style}>{PieceTypes[piece].getName()}</div>
            <div style={{
                position: "relative",
                padding: '5px',
                width: boardWidth + "px",
                height: boardWidth + "px"
            }}>
                <div className="board" style={board_style}>
                    <Chess
                        pieces={pieces}
                        drawLabels={false}
                        dots={dots}
                        onMovePiece={handleMove}
                        onDragStart={(_p: PieceType, _f: string) => true}
                    />
                </div>
            </div>
            <div style={blurb_style}>{PieceTypes[piece].getRules()}</div>
            <div style={blurb_style}><em>{PieceTypes[piece].getBlurb()}</em></div>
        </div>
    );
}
