import React, { useState } from "react";
import "../css/nav.css";
import { Outlet, Link } from 'react-router-dom';
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";

export const Nav = props => {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const toggleNavbar = () => {
        setNavbarOpen(!navbarOpen);
    }
    const closeNavebar = () => {
        setNavbarOpen(false);
    }

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
                        <li><Link className="homeButton" to="/" onClick={closeNavebar}>
                            <h2>Chess 9,000,000,060</h2>
                        </Link></li>
                        <li><Link to="/new" onClick={closeNavebar}><h4>Create new game</h4></Link></li>
                        <li><Link to="/zoo" onClick={closeNavebar}><h4>Piece zoo</h4></Link></li>
                        <li><Link to="/patreon" onClick={closeNavebar}><h4>Patreon</h4></Link></li>
                        <li><Link className="settings" to="/settings" onClick={closeNavebar}>
                            <h4>Settings</h4>
                        </Link></li>
                    </ul>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}