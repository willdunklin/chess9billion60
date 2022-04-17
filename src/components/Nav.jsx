import React, { useState } from "react";
import "../css/nav.css";
import { Outlet, Link } from 'react-router-dom';
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import Modal from 'react-modal';
import { Settings } from "./Settings";

export const Nav = props => {
    const [isOpen, setIsOpen] = useState('false');
    const [navbarOpen, setNavbarOpen] = useState(false);

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
                    <button onClick={toggleNavbar}>
                        {navbarOpen ? (
                            <MdClose className="openNav"/>
                        ) : (
                            <FiMenu className="closeNav"/>
                        )}
                    </button>
                    <ul className={`menuNav ${navbarOpen ? "showMenu" : ""}`}>
                        <li><Link className="homeButton" to="/" onClick={closeNavbar}>
                            <h2>Chess 9,000,000,060</h2>
                        </Link></li>
                        <li><Link to="/play" onClick={closeNavbar}><h4>Create new game</h4></Link></li>
                        <li><Link to="/zoo" onClick={closeNavbar}><h4>Piece zoo</h4></Link></li>
                        <li><a href="https://www.patreon.com/chess9b60" target="_blank" rel="noopener noreferrer" onClick={closeNavbar}><h4>Patreon</h4></a></li>
                        <li><a href="https://discord.gg/qu9MP3QRYx" target="_blank" rel="noopener noreferrer" onClick={closeNavbar}><h4>Discord</h4></a></li>
                        <li><div className="settings link" onClick={openSettings}>
                            <h4>Settings</h4>
                        </div></li>
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