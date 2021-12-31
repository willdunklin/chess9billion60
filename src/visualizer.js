const React = require('react')
const {Chess} = require("./react-chess/react-chess.js");
const PropTypes = require('prop-types')
const PieceTypes = require("./pieces.js");

export class Visualizer extends React.Component {
    render() {

        const result_style = {
            width: "240px",
            height: "560px",
            top: "0",
            left: "0",

            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1",
            userSelect: "none",
        }

        const container = {
            "position": "relative",
            "width": "240px",
            "height": "240px",
        };

        const board_style = {
            "width": "85%",
            "height": "85%",
        };

        var x = 4
        var y = 4

        let dot_locations = PieceTypes[this.props.piece].getAvailableMoves(x,y,null,"W").map(([to_x, to_y]) => `${String.fromCharCode(97 + (to_x))}${1+to_y}`) // map from coordinates to square
        .map(to_square => `${"W" + this.props.piece}@${to_square}`); // of the form piece_name@to_square
        let dots1 = [...new Set(dot_locations)]

        x = 0
        y = 0
        dot_locations = PieceTypes[this.props.piece].getAvailableMoves(x,y,null,"W").map(([to_x, to_y]) => `${String.fromCharCode(97 + (to_x))}${1+to_y}`) // map from coordinates to square
        .map(to_square => `${"W" + this.props.piece}@${to_square}`); // of the form piece_name@to_square
        let dots2 = [...new Set(dot_locations)]

        return (
            <div style={result_style}>
                <div style={container}>
                    <div className="board" style={board_style}>
                        <Chess
                            pieces={["W" + this.props.piece + '@e5']}
                            highlights={[]}
                            drawLabels = {false}
                            dots={dots1}
                            onDragStart = {() => {return false;}}
                            check={""}
                            promotablePieces = {[]}
                            whiteTurn={false}
                            isWhite={true}
                        />
                    </div>
                </div>
                <div style={container}>
                    <div className="board" style={board_style}>
                        <Chess
                            pieces={["W" + this.props.piece + '@a1']}
                            highlights={[]}
                            drawLabels = {false}
                            dots={dots2}
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
  }