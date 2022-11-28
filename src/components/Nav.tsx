import React, { useState, useEffect } from "react";
import "../css/nav.css";
import { Outlet, Link } from 'react-router-dom';
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import Modal from 'react-modal';
import { Settings } from "./Settings";

import { GoogleLogin, GoogleLogout, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { gapi } from 'gapi-script';
import { useCookies } from "react-cookie";
import { nanoid } from 'nanoid';
import axios from "axios";


export const Nav = () => {
    const [ isOpen, setIsOpen ] = useState('false');
    const [ navbarOpen, setNavbarOpen ] = useState(false);
    const [ profile, setProfile ] = useState<string>('');
    const [ cookies, setCookie ] = useCookies(['idtoken', 'darkMode', 'googleSession']);

    const toggleNavbar = () => {
        setNavbarOpen(!navbarOpen);
    }
    const closeNavbar = () => {
        setNavbarOpen(false);
    }
    const openSettings = () => {
        setIsOpen('true');
        closeNavbar();
    }
    const closeModal = () => {
        setIsOpen('false');
    }
    Modal.setAppElement("#root");

    const clientId: string = import.meta.env.VITE_GOOGLE_LOGIN || 'invalid';
    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: 'openid'
            });
        };
        gapi.load('client:auth2', initClient);
    });

    const onSuccess = async (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if('profileObj' in res) {
            const resp = await axios.post('http://localhost:8080/auth/google', {
                token: res.tokenId
            });
            if (resp.status !== 200 || !resp.data)
                return;

            if (resp.data.id === '')
                // Navigate to create account page
                return;

            setCookie('googleSession', res.tokenId);
            setCookie('idtoken', resp.data.id, { path: '/' });
            setProfile(resp.data.username);
        }
    };

    const onFailure = (err: any) => {
        console.log('failed', err);
    };

    const logOut = () => {
        setProfile('');
        setCookie('idtoken', nanoid(), { path: '/' });
        setCookie('googleSession', '', { path: '/' });
    };

    useEffect(() => {
        if (!cookies.googleSession)
            setProfile('');

        if (profile === '' && cookies.googleSession) {
            axios.post('http://localhost:8080/auth/google', {
                token: cookies.googleSession
            }).then(res => {
                if (res.status === 200) {
                    if (res.data.id === '') {
                        setProfile('');
                        setCookie('googleSession', '', { path: '/' });
                        return;
                    }

                    setCookie('idtoken', res.data.id, { path: '/' });
                    setProfile(res.data.username);
                }
            }).catch(e => {
                console.log('error!', e);
            });
        }
    }, []);

    return (
        <div>
            <nav className="navBar">
                <div className="navBackground">
                    <button className="openClose" onClick={toggleNavbar}>
                        {navbarOpen ? (
                            <MdClose className="openNav"/>
                        ) : (
                            <FiMenu className="closeNav"/>
                        )}
                    </button>
                    <div style={{position: 'relative'}}>
                        <div className="play">
                            <Link to='/play'>START GAME</Link>
                        </div>
                    </div>
                    <ul className={`menuNav ${navbarOpen ? "showMenu" : ""}`}>
                        <li><Link className="homeButton link" to="/" onClick={closeNavbar}>
                            <h2>Chess 9,000,000,060</h2>
                        </Link></li>
                        <li><Link className="link" to="/play" onClick={closeNavbar}><h4>Create new game</h4></Link></li>
                        <li><Link className="link" to="/zoo" onClick={closeNavbar}><h4>Piece zoo</h4></Link></li>
                        <li><a className="link" href="https://www.patreon.com/chess9b60" target="_blank" rel="noopener noreferrer" onClick={closeNavbar}><h4>Patreon</h4></a></li>
                        <li><a className="link" href="https://discord.gg/qu9MP3QRYx" target="_blank" rel="noopener noreferrer" onClick={closeNavbar}><h4>Discord</h4></a></li>
                        <li><div className="settings link" onClick={openSettings}>
                            <h4>Settings</h4>
                        </div></li>

                        <li>
                            { cookies.googleSession ?
                            <div className="signin" style={{display: 'flex', justifyContent: 'space-around'}}>
                                <p>{profile}</p>
                                <GoogleLogout
                                    clientId={clientId}
                                    buttonText="Logout"
                                    onLogoutSuccess={logOut}
                                    icon={false}
                                />
                            </div>
                            :
                            <div className="signin" style={{display: 'flex', justifyContent: 'center'}}>
                                <GoogleLogin
                                    clientId={clientId}
                                    buttonText="Sign in with Google"
                                    onSuccess={onSuccess}
                                    onFailure={onFailure}
                                    cookiePolicy={'single_host_origin'}
                                    icon={false}
                                />
                            </div>
                            }
                        </li>
                    </ul>
                </div>
            </nav>
            <Modal isOpen={isOpen === 'true'} onRequestClose={closeModal} style={{content: {maxWidth: '400px'}}}>
                <Settings close={closeModal}/>
            </Modal>
            <Outlet />
        </div>
    );
}
