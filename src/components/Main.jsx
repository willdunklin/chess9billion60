import { nanoid } from 'nanoid';
import { Link } from 'react-router-dom';
import React from 'react';

export const Main = props => {
    function getNewID() {
        // some kind of game id unique string
        const str = nanoid();
        return str.substring(0, 6);
    }

    return (
        <div style={{display: "flex", justifyContent: "center", padding: "4em"}}>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                
                <h2>Welcome to Chess 9,000,000,060</h2>
                <Link to={getNewID()}>Create new game</Link>
            </div>
        </div>
    );
}