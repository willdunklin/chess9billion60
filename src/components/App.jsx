import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Nav } from "./Nav";
import { Multiplayer } from './Multiplayer';
import { Main } from './Main';
import { NotFound } from "./NotFound";

import { CookiesProvider, useCookies } from "react-cookie";
import { nanoid } from "nanoid";
import { New } from "./New";
import { Zoo } from "./Zoo"

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
                        <Route exact path="zoo" element={<Zoo/>}/>
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