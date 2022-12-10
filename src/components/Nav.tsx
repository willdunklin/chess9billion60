import { useState } from "react";
import "../css/nav.css";
import { Outlet, Link } from 'react-router-dom';
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import Modal from 'react-modal';
import { Settings } from "./Settings";
import { Signin } from "./Signin";


export const Nav = () => {
    const [ isOpen, setIsOpen ] = useState('false');
    const [ navbarOpen, setNavbarOpen ] = useState(false);

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
                        <li><Link className="link" to="/leaderboard" onClick={closeNavbar}><h4>Leaderboard</h4></Link></li>
                        <li><Link className="link" to="/zoo" onClick={closeNavbar}><h4>Piece zoo</h4></Link></li>
                        <li><a className="link" href="https://www.patreon.com/chess9b60" target="_blank" rel="noopener noreferrer" onClick={closeNavbar}><h4>Patreon</h4></a></li>
                        <li><a className="link" href="https://discord.gg/qu9MP3QRYx" target="_blank" rel="noopener noreferrer" onClick={closeNavbar}><h4>Discord</h4></a></li>
                        <li><div className="settings link" onClick={openSettings}>
                            <h4>Settings</h4>
                        </div></li>

                        <li>
                            <Signin showLogout={true} nav={true} />
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
