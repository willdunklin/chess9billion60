import React, { useState, useCallback } from "react";
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { useCookies } from "react-cookie";

import '../css/modal.css';

export const New = () => {
    document.title = "Play | Chess9b60";

    const [ loadedSuccessfully, setLoadedSuccessfully ] = useState(false);
    const [ isOpen, setIsOpen ] = useState(true);
    const [ isWhite, setIsWhite ] = useState("0");
    const [ time, setTime ] = useState(900);
    const [ increment, setIncrement ] = useState(10);
    const [ enableTimer, setEnableTimer ] = useState(true);
    const [ gameid, setGameid ] = useState("");
    const [ cookies ] = useCookies(['idtoken']);

    const [ lobby, setLobby ] = useState(-1);

    const navigate = useNavigate();

    async function start_game() {
        let whitetoken: string | null = null;
        let blacktoken: string | null = null;

        if (isWhite === "0")
            whitetoken = cookies.idtoken;
        else if (isWhite === "1")
            blacktoken = cookies.idtoken;
        else if (isWhite === "random") {
            if (Math.random() > 0.5)
                whitetoken = cookies.idtoken;
            else
                blacktoken = cookies.idtoken;
        }

        axios.post('https://chess9b60-api.herokuapp.com/create', {
        // axios.post('http://localhost:8080/create', {
            time: time * 1000,
            increment: increment * 1000,
            timer: enableTimer,
            lower_strength: 3000,
            upper_strength: 4000,
            white: whitetoken,
            black: blacktoken
        })
        .then(res => {
            if (res.status === 200) {
                // console.log('gameid: ', res.data);
                setGameid(res.data);
                setLoadedSuccessfully(true);
                setIsOpen(false);
            }
            // console.log(res);
        })
        .catch(e => {
            console.log('error!', e);
        });
    }

    // async function refresh_players() {
    //     // axios.get('https://chess9b60-api.herokuapp.com/queue', {})
    //     axios.get('http://localhost:8080/queue', {})
    //     .then(res => {
    //         if (res.status === 200) {
    //             console.log('queue: ', res.data);
    //             // setLobbyPlayers(res.data);
    //         }
    //     })
    //     .catch(e => {
    //         console.log('error!', e);
    //     });
    // }

    const join_pool = useCallback(async (q_id) => {
        axios.post('https://chess9b60-api.herokuapp.com/pool', {
        // axios.post('http://localhost:8080/pool', {
            token: cookies.idtoken,
            q_id: q_id,
        })
        .then(res => {
            if (res.status === 200) {
                const gid = res.data['id']; // gameid

                if (gid === undefined || gid === "unjoined")
                    return false;
                if (gid === 'timeout') {
                    setLobby(-1);
                    // refresh_players();
                    return false;
                }

                setGameid(res.data['id']);
                setLoadedSuccessfully(true);
                setIsOpen(false);
                return true;
            }
        })
        .catch(e => {
            console.log('error!', e);
        });
    }, [cookies.idtoken]);

    async function join_lobby(lobby_id: number) {
        if (lobby === lobby_id || lobby_id === -1) {
            setLobby(-1);
            return;
        }

        setLobby(lobby_id);
        join_pool(lobby_id);
    }

    function close() {
        setIsOpen(false);
        navigate(-1);
    }

    React.useEffect(() => {
        const interval = setInterval(() => {
            join_pool(lobby);
            // refresh_players();
        }, 4500);

        if (lobby === -1)
            clearInterval(interval);

        return () => clearInterval(interval);
    }, [lobby, join_pool]);


    if (loadedSuccessfully)
        return <Navigate to={`/${gameid}`}/>;

    Modal.setAppElement("#root");

    return (
        <div>
            <Modal isOpen={isOpen}>
                <h2>Join a Lobby</h2>
                <div>
                    <button onClick={() => { join_lobby(0) }} className={lobby === 0 ? "buttonHighlight" : ""}>
                        3 | 2
                    </button>
                    <button onClick={() => { join_lobby(1) }} className={lobby === 1 ? "buttonHighlight" : ""}>
                        5 | 3
                    </button>
                    <button onClick={() => { join_lobby(2) }} className={lobby === 2 ? "buttonHighlight" : ""}>
                        10 | 10
                    </button>
                    {/* <button onClick={refresh_players}>Refresh</button> */}
                </div>
                <h2>Create a Custom Game</h2>
                <div>
                    <p>Color: </p>
                    <div>
                        <button onClick={() => {setIsWhite("0")}} className={isWhite === "0" ? "buttonHighlight" : ""}>White</button>
                        <button onClick={() => {setIsWhite("1")}} className={isWhite === "1" ? "buttonHighlight" : ""}>Black</button>
                        <button onClick={() => {setIsWhite("random")}} className={isWhite === "random" ? "buttonHighlight" : ""}>Random</button>
                    </div>
                </div>
                <div>
                    <p>Enable Timers:</p>
                    <input type="checkbox"
                           id="darkMode"
                           name="darkMode"
                           checked={enableTimer}
                           onChange={event => {
                                setEnableTimer(event.target.checked);
                           }}
                    />
                </div>
                <div>
                    <p>Start time: </p>
                    <input type="text"
                           defaultValue={time}
                           onChange={event => {
                               setTime( Number(event.target.value) );
                           }}
                    />
                </div>
                <div>
                    <p>Increment: </p>
                    <input type="text"
                           defaultValue={increment}
                           onChange={event => {
                               setIncrement( Number(event.target.value) );
                           }}
                    />
                </div>
                <div className="links">
                    <div className='link' onClick={close}>Cancel</div>
                    <div className='link' onClick={start_game}>Start</div>
                </div>
            </Modal>
        </div>
    );
}
