const React = require('react')
const {Chess} = require("./react-chess/react-chess.js");
const PropTypes = require('prop-types')
const { PieceTypes } = require("./pieces.js");

const boardWidth = 180
const result_style = {
    width: boardWidth + "px",
    height: ((2* boardWidth) + 50) + "px", //pretty arbitrary, don't worry about it
    top: "0",
    left: "0",
    padding: '5px',

    display: "flex",
    flexDirection: "column",
    //justifyContent: "center",
    alignItems: "center",
    zIndex: "1",
    userSelect: "none",
}

const container = {
    "position": "relative",
    "width": boardWidth + "px",
    "height": boardWidth + "px",
    padding: '5px',
};

const board_style = {
    "width": "100%",
    "height": "100%",
};

const name_style = {
    "fontSize" : "large"
}

const blurb_style = {
    "fontSize" : "small",
    "textAlign" : "center"
}


export class Visualizer extends React.Component {

    constructor(props) {
        super(props);
        const {piece, color} = this.props;
        
        this.handleMovePiece1 = this.handleMovePiece1.bind(this);
        this.handleMovePiece2 = this.handleMovePiece2.bind(this);

        let x = 4
        let y = 4

        let dot_locations1 = PieceTypes[piece].getAvailableMoves(x,y,null,"W").map(([to_x, to_y]) => `${String.fromCharCode(97 + (to_x))}${1+to_y}`) // map from coordinates to square
        .map(to_square => `${color + piece}@${to_square}`); // of the form piece_name@to_square

        x = 0
        y = 0
        let dot_locations2 = PieceTypes[piece].getAvailableMoves(x,y,null,"W").map(([to_x, to_y]) => `${String.fromCharCode(97 + (to_x))}${1+to_y}`) // map from coordinates to square
        .map(to_square => `${color + piece}@${to_square}`); // of the form piece_name@to_square

        this.state = {pieces1: [color + piece + "@e5"], pieces2: [color + piece + "@a1"],dots1: [...new Set(dot_locations1)],dots2: [...new Set(dot_locations2)]};
        //this.handleClickPiece = this.handleClickPiece.bind(this);
      }
    
      handleMovePiece1(piece, fromSquare, toSquare, promotion) {

        const x = toSquare.toLowerCase().charCodeAt(0) - 97
        const y = Number(toSquare[1]) - 1

        this.setState({pieces1: [`${piece.name}@${toSquare}`]})
        let dot_locations1 = PieceTypes[piece.name.substring(1)].getAvailableMoves(x,y,null,"W").map(([to_x, to_y]) => `${String.fromCharCode(97 + (to_x))}${1+to_y}`) // map from coordinates to square
        .map(to_square => `${piece.name}@${to_square}`); // of the form piece_name@to_square
        this.setState({dots1: [...new Set(dot_locations1)]})
      }

      handleMovePiece2(piece, fromSquare, toSquare, promotion) {
        const x = toSquare.toLowerCase().charCodeAt(0) - 97
        const y = Number(toSquare[1]) - 1
        
        this.setState({pieces2: [`${piece.name}@${toSquare}`]})

        let dot_locations2 = PieceTypes[piece.name.substring(1)].getAvailableMoves(x,y,null,"W").map(([to_x, to_y]) => `${String.fromCharCode(97 + (to_x))}${1+to_y}`) // map from coordinates to square
        .map(to_square => `${piece.name}@${to_square}`); // of the form piece_name@to_square
        this.setState({dots2: [...new Set(dot_locations2)]})
      }

    
    render() {
        const {piece} = this.props;
        const {pieces1, pieces2, dots1, dots2} = this.state;

        return (
            <div style={result_style}>
                <div style={name_style}>{PieceTypes[piece].getName()}</div>
                <div style={container}>
                    <div className="board" style={board_style}>
                        <Chess
                            pieces={pieces1}
                            drawLabels = {false}
                            dots={dots1}
                            onMovePiece={this.handleMovePiece1} 
                        />
                    </div>
                </div>
                <div style={container}>
                    <div className="board" style={board_style}>
                        <Chess
                            pieces={pieces2}
                            drawLabels = {false}
                            dots={dots2}
                            onMovePiece={this.handleMovePiece2}
                        />
                    </div>
                </div>
                <div style={blurb_style}>{PieceTypes[piece].getRules()}</div>
                <div style={blurb_style}><em>{PieceTypes[piece].getBlurb()}</em></div>
            </div>
        )
    }
}

Visualizer.propTypes = {
    // vanilla react-chess
    color: PropTypes.string,
    piece: PropTypes.string,
  }