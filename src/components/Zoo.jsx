const { Visualizer } = require("./visualizer.js");
const { PieceTypes } = require("../bgio/pieces");

const visualizerStyles = {
    paddingTop: "50px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
}

const visualizers = []
const temp = []
for (let [piece] of Object.entries(PieceTypes)) {
    if (piece !== "P")
        temp.push(piece)
}
temp.sort((a, b) => (PieceTypes[a].strength < PieceTypes[b].strength) ? -1 :1 )
for (let piece of temp) {
    visualizers.push(<Visualizer 
        key={`${piece}-zoo-visualizer`} // fixes bug when promPieces changes
        piece={piece} 
        color={"W"}
        count={5} // TODO this is a stupid name for this or a stupid way of doing this
        />
    )
}

export const Zoo = () => {
    return <div style={visualizerStyles}>{visualizers}</div>
}