import React from "react";
import "../css/nav.css";
import { Outlet, Link } from 'react-router-dom';

export const Nav = props => {
    return (
        <div>
            <nav>
                <div className="navlinks">
                    <Link className="homeButton" to="/">
                        <h2 style={{color: "#fff"}}>Chess 9,000,000,060</h2>
                    </Link>
                    <Link to="/new"><h4>Create new game</h4></Link>
                    <Link to="/zoo"><h4>Piece zoo</h4></Link>
                    <Link to="/patreon"><h4>Patreon</h4></Link>
                </div>
                <Link className="settings" to="/settings">
                    <h4>Settings</h4>
                </Link>
            </nav>
            <Outlet />
        </div>
    );
}