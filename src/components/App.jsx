import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Nav } from "./Nav";
import { Multiplayer } from './Multiplayer';
import { Main } from './Main';
import { NotFound, Error } from "./NotFound";

import { CookiesProvider, useCookies } from "react-cookie";
import { nanoid } from "nanoid";
import { New } from "./New";
import { Zoo } from "./Zoo"

const App = () => {
    const [ cookies, setCookie ] = useCookies(['user']);
    // Add cookie 
    if (cookies.idtoken === undefined)
        setCookie('idtoken', nanoid());

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', cookies.darkMode === 'true' ? 'dark' : 'light');
    }, [cookies.darkMode])
    
    return (
        <div className="app">
            <CookiesProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Nav />}>
                            <Route exact path="404" element={<NotFound/>}/>
                            <Route exact path="error" element={<Error/>}/>
                            <Route exact path="new" element={<New/>}/>
                            <Route exact path="zoo" element={<Zoo/>}/>
                            <Route exact path="patreon" element={<h1>patreon</h1>}/>
                            <Route exact path="" element={<Main/>}/>
                            <Route path=":gameid" element={<Multiplayer/>}/>
                        </Route>
                        <Route path="*" element={<NotFound />}/>
                    </Routes>
                </BrowserRouter>
            </CookiesProvider>
        </div>
    );
};

export default App;