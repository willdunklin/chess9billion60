import { Link } from 'react-router-dom';

export const Main = props => {
    return (
        <div style={{display: "flex", justifyContent: "center", padding: "4em"}}>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
                <h2>Welcome to Chess 9,000,000,060</h2>
                <Link to="/new">Create new game</Link>
            </div>
        </div>
    );
}