import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Nav } from "./Nav";
import { Multiplayer } from './Multiplayer';
import { Main } from './Main';
import { NotFound } from "./NotFound";

import { CookiesProvider, useCookies } from "react-cookie";
import { nanoid } from "nanoid";
import { New } from "./New";

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

const App = () => {
    const [ cookies, setCookie ] = useCookies(['user']);
    // Add cookie 
    if (cookies.idtoken === undefined)
        setCookie('idtoken', nanoid());

    return (
        <CookiesProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Nav />}>
                        <Route exact path="new" element={<New/>}/>
                        <Route exact path="zoo" element={<div style={visualizerStyles}>{visualizers}</div>}/>
                        <Route exact path="patreon" element={<h1>patreon</h1>}/>
                        <Route exact path="settings" element={<h1>settings</h1>}/>
                        <Route exact path="" element={<Main />}/>
                        <Route path=":gameid" element={<Multiplayer />}/>
                    </Route>
                    <Route path="*" element={<NotFound />}/>
                </Routes>
            </BrowserRouter>
        </CookiesProvider>
    );
};

export default App;