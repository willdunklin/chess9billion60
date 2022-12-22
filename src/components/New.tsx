import React, { useState, useCallback } from "react";
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { MultiRangeSlider } from "./MultiRangeSlider";

import '../css/modal.css';

const New = () => {
    document.title = "Play | Chess9b60";

    const [ loadedSuccessfully, setLoadedSuccessfully ] = useState(false);
    const [ isOpen, setIsOpen ] = useState(true);
    const [ isWhite, setIsWhite ] = useState("0");
    const [ time, setTime ] = useState(900);
    const [ increment, setIncrement ] = useState(10);
    const [ enableTimer, setEnableTimer ] = useState(true);
    const [ url, setUrl ] = useState("");
    const [ gameid, setGameid ] = useState("");
    const [ cookies ] = useCookies(['idtoken']);

    const [ minStrength, setMinStrength ] = useState(30);
    const [ maxStrength, setMaxStrength ] = useState(40);

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

        if (time < 1)
            setTime(1);
        if (increment < 0)
            setIncrement(0);

        axios.post('https://chess9b60-api.herokuapp.com/create', {
        // axios.post('http://localhost:8080/create', {
            time: time * 1000,
            increment: increment * 1000,
            timer: enableTimer,
            lower_strength: minStrength * 100,
            upper_strength: maxStrength * 100,
            white: whitetoken,
            black: blacktoken
        })
        .then(res => {
            if (res.status === 200) {
                setGameid(res.data);
                setLoadedSuccessfully(true);
                setIsOpen(false);
            }
        })
        .catch(e => {
            console.log('error!', e);
        });
    }

    const join_pool = useCallback(async (q_id: number) => {
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

    const join_url = () => {
        if (url === "")
            return;

        const url_split = url.split('/');
        const gameid = url_split[url_split.length - 1];

        if (!gameid || gameid.length !== 6)
            return;

        setGameid(gameid);
        setLoadedSuccessfully(true);
        setIsOpen(false);
    }

    React.useEffect(() => {
        const interval = setInterval(() => {
            join_pool(lobby);
        }, 4500);

        if (lobby === -1)
            clearInterval(interval);

        return () => clearInterval(interval);
    }, [lobby, join_pool]);


    if (loadedSuccessfully)
        return <Navigate to={`/${gameid}`}/>;

    return (
        <>
            <div className="games">
                <div className="gameCol" id="joinGame">
                    <div className="gameCol" style={{width: '100%'}}>
                        <aside>
                            <h2 style={{marginBottom: 0, marginTop: '1em'}}>Join A Game</h2>
                            <p className="modalAside" style={{margin: '0.5em 0 0 0'}}><i>Enter a game id/url</i></p>
                        </aside>
                        <div className="gameRow" style={{alignItems: 'baseline'}}>
                            <p>Game ID:</p>
                            <input type="text"
                                defaultValue={url}
                                onChange={event => {
                                    setUrl( event.target.value );
                                }}
                            />
                            <div className='link' style={{padding: '0.9em 0.5em'}} onClick={join_url}>Join</div>
                        </div>
                    </div>
                </div>

                <div className="gameCol" id="customGame">
                    <aside>
                        <h2 style={{marginBottom: 0, marginTop: '1.2em'}}>Create a Custom Game</h2>
                        <p className="modalAside"><i>(Share the link once customized game is created)</i></p>
                    </aside>
                    <div className="gameRow">
                        <p>Color: </p>
                        <button onClick={() => {setIsWhite("0")}} className={isWhite === "0" ? "buttonHighlight specButton" : "specButton"}>White</button>
                        <button onClick={() => {setIsWhite("1")}} className={isWhite === "1" ? "buttonHighlight specButton" : "specButton"}>Black</button>
                        <button onClick={() => {setIsWhite("random")}} className={isWhite === "random" ? "buttonHighlight specButton" : "specButton"}>Random</button>
                    </div>
                    <div className="gameRow">
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
                    <div className="gameRow">
                        <p>Start time: </p>
                        <input type="text"
                            defaultValue={time}
                            onChange={event => {
                                setTime( Number(event.target.value) );
                            }}
                        />
                    </div>
                    <div className="gameRow">
                        <p>Increment: </p>
                        <input type="text"
                            defaultValue={increment}
                            onChange={event => {
                                setIncrement( Number(event.target.value) );
                            }}
                        />
                    </div>
                    <div className="gameRow">
                        <p>Strength:</p>
                        <MultiRangeSlider
                            min={20}
                            max={55}
                            startLeft={30}
                            startRight={40}
                            onChange={(min: number, max: number) => {
                                // Set min/max between 20- and 55+
                                setMinStrength(min === 20 ? 0 : min);
                                setMaxStrength(max === 55 ? 1000 : max);
                            }}
                        />
                    </div>
                    <div className="links gameRow">
                        <div className='link' onClick={close}>Cancel</div>
                        <div className='link' onClick={start_game}>Start</div>
                    </div>
                </div>

                <div className="gameCol">
                    <aside>
                        <h2 style={{marginBottom: 0, marginTop: '1em'}}>Join a Lobby</h2>
                        <p className="modalAside"><i>Choose a time control</i></p>
                    </aside>
                    <div className="gameRow">
                        <button onClick={() => { join_lobby(0) }} className={lobby === 0 ? "buttonHighlight specButton" : "specButton"}>
                            3 | 2
                        </button>
                        <button onClick={() => { join_lobby(1) }} className={lobby === 1 ? "buttonHighlight specButton" : "specButton"}>
                            5 | 3
                        </button>
                        <button onClick={() => { join_lobby(2) }} className={lobby === 2 ? "buttonHighlight specButton" : "specButton"}>
                            10 | 10
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default New;
