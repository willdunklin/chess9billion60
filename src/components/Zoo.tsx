import CSS from 'csstype';
import { Visualizer } from "./visualizer";
import { PieceTypes } from "../bgio/pieces";

const visualizerStyles: CSS.Properties = {
    padding: "3em",
    paddingTop: "1em",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center"
};

const visualizers: any[] = [];
const temp: string[] = [];
for (let [piece] of Object.entries(PieceTypes)) {
    if (piece !== "P")
        temp.push(piece);
}
temp.sort((a, b) => (PieceTypes[a].strength < PieceTypes[b].strength) ? -1 :1 )
for (let piece of temp) {
    visualizers.push(
        <Visualizer
            key={`${piece}-zoo-visualizer`} // fixes bug when promPieces changes
            piece={piece}
            color={"W"}
            count={7} // TODO this is a stupid name for this or a stupid way of doing this
        />
    );
}

export const Zoo = () => {
    document.title = "Piece Zoo - Fairy Chess Pieces | Chess9b60";

    return (
        <div>
            <h1 style={{textAlign: 'center'}}>Zoo</h1>
            <div style={visualizerStyles}>{visualizers}</div>
        </div>
    );
}
