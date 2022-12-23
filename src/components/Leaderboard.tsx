import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import CSS from 'csstype';
import '../css/leaderboard.css';

const Leaderboard = () => {
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
                        <li key={`leaderboard-${user.username}-${index}`} style={{width: '100%'}}>
                            <span style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <p className="leaderboardName" style={{paddingRight: '2em'}}>{user.username}</p>
                                <p>
                                    {'9,000,000,000'.slice(0, -user.elo.toLocaleString('en-US').length)}
                                    <b>{user.elo.toLocaleString('en-US')  }</b>
                                </p>
                            </span>
                        </li>
                    );
                }))
            })
            .catch(err => console.log(err));
    }, []);

    const leaderboardStyles: CSS.Properties = {
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    return (
        <>
            <h1 style={{textAlign: 'center'}}>Leaderboard</h1>
            <div style={leaderboardStyles}>
                <ol style={{...leaderboardStyles, width: '30%', minWidth: 'min-content'}}>
                    {ranking}
                </ol>
                <Link className="homeButton link" to='/'>Home</Link>
            </div>
        </>
    );
}

export default Leaderboard;
