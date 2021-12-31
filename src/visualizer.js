const React = require('react')
const {Chess} = require("./react-chess/react-chess.js");
const PropTypes = require('prop-types')
const PieceTypes = require("./pieces.js");

export class Visualizer extends React.Component {
    render() {
        const container = {
            "position": "relative",
            "width": "600px",
            "height": "600px",
        };

        const board_style = {
            "width": "85%",
            "height": "85%",
        };

        const x = this.props.square.toLowerCase().charCodeAt(0) - 97
        const y = Number(this.props.square[1]) - 1

        let dot_locations = PieceTypes[this.props.piece].getAvailableMoves(x,y,null,this.props.color).map(([to_x, to_y]) => `${String.fromCharCode(97 + (to_x))}${1+to_y}`) // map from coordinates to square
        .map(to_square => `${this.props.color + this.props.piece}@${to_square}`); // of the form piece_name@to_square
        let dots = [...new Set(dot_locations)]
        return (
            <div style={container}>
                <div>
                    <div className="board" style={board_style}>
                        <Chess
                            pieces={[this.props.color + this.props.piece + '@' + this.props.square]}
                            highlights={[]}
                            drawLabels = {false}
                            dots={dots}
                            onDragStart = {() => {return false;}}
                            check={""}
                            promotablePieces = {[]}
                            whiteTurn={false}
                            isWhite={true}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

Visualizer.propTypes = {
    // vanilla react-chess
    color: PropTypes.string,
    piece: PropTypes.string,
    square: PropTypes.string,
  }