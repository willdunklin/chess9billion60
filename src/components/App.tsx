import React, { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Main from './Main';
import Loading from './Loading';
import { ScrollToTop } from "./ScrollToTop";
import { NotFound, Error } from "./NotFound";

import { CookiesProvider, useCookies } from "react-cookie";
import { nanoid } from "nanoid";

const Nav = React.lazy(() => import("./Nav"));
const Account = React.lazy(() => import("./Account"));
const CreateAccount = React.lazy(() => import("./CreateAccount"));
const Leaderboard = React.lazy(() => import("./Leaderboard"));
const Zoo = React.lazy(() => import("./Zoo"));
const Multiplayer = React.lazy(() => import('./Multiplayer'));
const New = React.lazy(() => import("./New"));


const App = () => {
    const [ cookies, setCookie ] = useCookies(['idtoken', 'darkMode']);

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
                    <Suspense fallback={<Loading/>}>
                        <Routes>
                            <Route path="/" element={<Nav/>}>
                                <Route path="404" element={<NotFound/>}/>
                                <Route path="error" element={<Error/>}/>
                                <Route path="play" element={<New/>}/>
                                <Route path="zoo" element={<Zoo/>}/>
                                <Route path="" element={<Main/>}/>
                                <Route path="play/:gameid" element={<Multiplayer/>}/>
                                <Route path=":gameid" element={<Multiplayer/>}/>
                                <Route path="leaderboard" element={<Leaderboard/>}/>
                                <Route path="account" element={<Account/>}/>
                                <Route path="account/create/:tokenid" element={<CreateAccount/>}/>
                                <Route path="account/create" element={<Navigate to='/account'/>}/>
                            </Route>
                            <Route path="*" element={<Navigate to="/404"/>}/>
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </CookiesProvider>
        </div>
    );
};

export default App;
