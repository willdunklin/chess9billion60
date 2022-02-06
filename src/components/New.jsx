import React from "react";
import { nanoid } from 'nanoid';
import { Navigate } from 'react-router-dom';


function getNewID() {
    // some kind of game id unique string
    const str = nanoid();
    return str.substring(0, 6);
}

export const New = props => {
    return (
        <Navigate to={`/${getNewID()}`}/>
    );
}