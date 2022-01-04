import React from "react";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

import { Multiplayer, Spectator } from './components/Multiplayer';
import { Main } from './components/Main';


const App = () => (
    <BrowserRouter>
        <Routes>
            <Route key="1" exact path="/:gameid/:playerid" element={<Multiplayer />} />
            <Route key="2" exact path="/:gameid/" element={<Spectator />} />
            <Route key="3" exact path="/" element={<Main />} />
        </Routes>
    </BrowserRouter>
);

export default App;