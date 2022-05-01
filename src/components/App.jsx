import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Nav } from "./Nav";
import { Multiplayer } from './Multiplayer';
import { Main } from './Main';
import { NotFound, Error } from "./NotFound";

import { CookiesProvider, useCookies } from "react-cookie";
import { nanoid } from "nanoid";
import { New } from "./New";
import { Zoo } from "./Zoo";
import { ScrollToTop } from "./ScrollToTop";

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
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<Nav />}>
                            <Route exact path="404" element={<NotFound/>}/>
                            <Route exact path="error" element={<Error/>}/>
                            <Route exact path="play" element={<New/>}/>
                            <Route exact path="zoo" element={<Zoo/>}/>
                            <Route exact path="" element={<Main/>}/>
                            <Route path="play/:gameid" element={<Multiplayer/>}/>
                            <Route path=":gameid" element={<Multiplayer/>}/>
                        </Route>
                        <Route path="*" element={<Navigate to="/404"/>}/>
                    </Routes>
                </BrowserRouter>
            </CookiesProvider>
        </div>
    );
};

export default App;