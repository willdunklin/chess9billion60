import React from 'react';
import CSS from 'csstype';

interface ArrowProps {
    pos1: {
        x: number,
        y: number,
        pos: string,
    };
    pos2: {
        x: number,
        y: number,
        pos: string
    };
    arrowColor: string;
    isWhite: boolean;
    isPreview: boolean;
}

export const Arrow = (props: ArrowProps) => {
    const { pos1, pos2, arrowColor, isWhite, isPreview } = props;
    let { x: x1, y: y1, pos: p1 } = pos1;
    let { x: x2, y: y2, pos: p2 } = pos2;

    if (!isWhite) {
        x1 = 7 - x1;
        y1 = 7 - y1;
        x2 = 7 - x2;
        y2 = 7 - y2;
    }

    const scale = 12.5; // do not change

    const svg_style: CSS.Properties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.7,
        zIndex: 10,
    };

    return (
        <svg style={svg_style}>
            <defs>
                <marker id="arrowhead" markerWidth="4" markerHeight="8" refX="2.05" refY="2.01" orient="auto">
                    <path d="M0,0 V4 L3,2 Z" fill={arrowColor}></path>
                </marker>
            </defs>
            <g>
                {p1 != p2 ?
                    <line strokeWidth={isPreview ? "1.6%" : "1.75%"} strokeLinecap='round' markerEnd="url(#arrowhead)" opacity="1" stroke={arrowColor}
                          x1={`${(x1 + 0.5) * scale}%`} y1={`${(y1 + 0.5) * scale}%`}
                          x2={`${(x2 + 0.5) * scale}%`} y2={`${(y2 + 0.5) * scale}%`} />
                    :
                    <circle strokeWidth={isPreview ? "1%" : "1.2%"} fill="none" opacity="1" stroke={arrowColor}
                            cx={`${(x1 + 0.5) * scale}%`} cy={`${(y1 + 0.5) * scale}%`} r="5.5%" />
                }
            </g>
        </svg>
    );
}
