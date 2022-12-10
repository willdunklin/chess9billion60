import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import CSS from 'csstype';

export const Leaderboard = () => {
    document.title = "Leaderboard | Chess9b60";

    const [ ranking, setRanking ] = useState<JSX.Element[]>([]);

    useEffect(() => {
        // fetch('http://localhost:8080/leaderboard')
        fetch('https://chess9b60-api.herokuapp.com/leaderboard')
            .then(res => res.json())
            .then(data => {
                if (data.length === 0)
                    return;

                setRanking(data.map((user: {username: string, elo: number}, index: number) => {
                    return (
                        <li key={`leaderboard-${user.username}-${index}`}>
                            <span>{user.username} - {user.elo}</span>
                        </li>
                    );
                }))
            })
            .catch(err => console.log(err));
    }, []);

    const leaderboardStyles: CSS.Properties = {
        margin: 'auto',
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    return (
        <div>
            <h1 style={{textAlign: 'center'}}>Leaderboard</h1>
            <div style={leaderboardStyles}>
                <ol>
                    {ranking}
                </ol>
                <Link className="homeButton link" to='/'>Home</Link>
            </div>
        </div>
    );
}
