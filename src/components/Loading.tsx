import { useState, useEffect } from "react";

const Loading = () => {
    const [ ellipsis, setEllipsis ] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            if (ellipsis.length < 3)
                setEllipsis(ellipsis + '.');
            else
                setEllipsis('');
        }, 400);
        return () => clearInterval(interval);
    }, [ellipsis]);

    return (
        <main>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                margin: "auto",
                padding: "4em",
            }}>
                <h1>Loading{ellipsis}</h1>
                <p>Please bear with us, we're getting the page you're looking for</p>
            </div>
        </main>
    );
};

export default Loading;
