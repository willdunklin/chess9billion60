import React from "react";
import { Link } from 'react-router-dom';
import CSS from 'csstype';
// import { test } from "../server";

const center: CSS.Properties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "2em"
};

const Exit = () => {
    return (
        <div style={center}>
            <Link to="/">Home</Link>
        </div>
    );
}

export const NotFound = () => {
    document.title = "Missing Page | Chess9b60";

    // test();

    return (
        <div style={center}>
            <h2>404: Page not found</h2>
            <Exit />
        </div>
    );
}

export const Error = () => {
    document.title = "Something went wrong... | Chess9b60";

    return (
        <div style={center}>
            <h2>Error: could not load page</h2>
            <Exit />
        </div>
    );
}
