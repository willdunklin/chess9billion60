import React from 'react';
// TODO: change this to nanoid
import {parse, v4} from "uuid";

export const Main = props => {
    function getNewID() {
        // some kind of game id unique string
        const bytes = [...parse(v4())].map((v) => v.toString(16).padStart(2, '0'));
        const str = bytes[0] + bytes[3] + bytes[7];
        return str;
    }

    return (
        <div>
            <h1>main menu</h1>
            <h3>{getNewID()}</h3>
        </div>
    );
}