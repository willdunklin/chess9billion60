import React from 'react';
import CSS from 'csstype';

interface PromoterProps {
    piece: string;
    Piece: (props: any) => JSX.Element;
    promotionFile: number;
    i: number;
    lightSquareColor: string;
    darkSquareColor: string;
}

export const Promoter = (props: PromoterProps) => {
    const { piece, Piece, promotionFile, i, lightSquareColor, darkSquareColor } = props;

    const styles: CSS.Properties = {
        position: 'absolute',
        left: `${12.5 * promotionFile}%`,

        //center them
        top: `${i * 12.5 + 0.5}%`,
        background: (promotionFile + i) % 2 === 0 ? lightSquareColor : darkSquareColor,
        //boxShadow : piece === chosenPromoter ? 'inset 0px 0px 0px 0.4vmin red' : undefined,

        //size of one square
        width: '12.5%',
        height: '12.5%',

        textAlign: 'center',
        cursor: 'grab',
        zIndex: 1000
    };

    //The y=7 comes from piecePositionHoc, which sends 7 to 7 - y. This maps 7 to 0 later, so I'm really just telling it to
    //put the piece on the div.
    return (
        <div style={styles}>
            <Piece key={i+''+piece+'-promoter'}
                   x={0}
                   y={7}
                   size={'100%'}
                   cursor="default"
            />
        </div>
    );
}
