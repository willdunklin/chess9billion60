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


export const Nav = () => {
    const [isOpen, setIsOpen] = useState('false');
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [ profile, setProfile ] = useState<string>('');
    const [ cookies, setCookie ] = useCookies(['idtoken', 'darkMode']);

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

    const clientId = "133618897899-r09kll12dns8j0q1rv8iiulf8qel485h.apps.googleusercontent.com";
    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: 'openid'
            });
        };
        gapi.load('client:auth2', initClient);
    });

    const onSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if('profileObj' in res) {
            console.log('Login Success: currentUser:', res.googleId);
            setCookie('idtoken', res.googleId, { path: '/' });
            setProfile(res.profileObj.givenName);
        }
    };

    const onFailure = (err: any) => {
        console.log('failed', err);
    };

    const logOut = () => {
        setProfile('');
        setCookie('idtoken', nanoid(), { path: '/' });
    };


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
                            { profile !== '' ? 
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
