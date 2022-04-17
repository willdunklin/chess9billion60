import React from "react";
import { Link } from 'react-router-dom';

const center = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "2em"
}

const Exit = props => {
    return (
        <div style={center}>
            <Link to="/">Home</Link>
        </div>
    );
}

export const NotFound = props => {
    document.title = "Missing Page | Chess9b60";

    return (
        <div style={center}>
            <h2>404: Page not found</h2>
            <Exit />
        </div>
    );
}

export const Error = props => {
    document.title = "Something went wrong... | Chess9b60";

    return (
        <div style={center}>
            <h2>Error: could not load page</h2>
            <Exit />
        </div>
    );
}