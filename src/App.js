import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Multiplayer } from './components/Multiplayer';
import { Main } from './components/Main';

import { CookiesProvider, useCookies } from "react-cookie";
import { nanoid } from "nanoid";

const App = () => {
    const [ cookies, setCookie ] = useCookies(['user']);
    // Add cookie 
    if (cookies.idtoken === undefined)
        setCookie('idtoken', nanoid());

    return (
        <CookiesProvider>

            <BrowserRouter>
                <Routes>
                    <Route exact path="/:gameid/" element={<Multiplayer />} />
                    <Route exact path="/" element={<Main />} />
                </Routes>
            </BrowserRouter>

        </CookiesProvider>
    );
};

export default App;