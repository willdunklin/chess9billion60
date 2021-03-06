import React, { useState } from "react";
import { Navigate } from 'react-router-dom';
import Modal from 'react-modal';
import { useCookies } from "react-cookie";

import '../css/modal.css';

const axios = require('axios');

export const New = _props => {
    document.title = "Play | Chess9b60";

    const [ loadedSuccessfully, setLoadedSuccessfully ] = useState(null);
    const [ isOpen, setIsOpen ] = useState(true);
    const [ exit, setExit ] = useState(false);
    const [ isWhite, setIsWhite ] = useState("0");
    const [ time, setTime ] = useState(900);
    const [ increment, setIncrement ] = useState(10);
    const [ enableTimer, setEnableTimer ] = useState(true);
    const [ gameid, setGameid ] = useState("");
    const [ cookies ] = useCookies(['user']);

    const [ lobby1, setLobby1 ] = useState(false);
    const [ lobby1Players, setLobby1Players ] = useState("0");

    async function start_game() {
        let whitetoken = null;
        let blacktoken = null;

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

        console.log('whitetoken:', whitetoken);
        console.log('black:', blacktoken);

        axios.post('https://chess9b60-api.herokuapp.com/create', {
            time: time * 1000,
            increment: increment * 1000,
            timer: enableTimer,
            white: whitetoken,
            black: blacktoken
        })
        .then(res => {
            if (res.status === 200) {
                console.log('gameid: ', res.data)
                setGameid(res.data);
                setLoadedSuccessfully(true);
                setIsOpen(false);
            }
            console.log(res);
        })
        .catch(e => {
            console.log('error!', e);
        });
    }

    async function refresh_players() {
        axios.post('https://chess9b60-api.herokuapp.com/queue', {})
        .then(res => {
            if (res.status === 200) {
                setLobby1Players(res.data);
            }
            console.log(res);
        })
        .catch(e => {
            console.log('error!', e);
        });
    }

    async function join_pool() {
        axios.post('https://chess9b60-api.herokuapp.com/pool', {
            token: cookies.idtoken,
        })
        .then(res => {
            if (res.status === 200) {
                console.log('gameid: ', res.data)
                setGameid(res.data);
                setLoadedSuccessfully(true);
                setIsOpen(false);
            }
            console.log(res);
        })
        .catch(e => {
            console.log('error!', e);
        });
    }

    function close() {
        setIsOpen(false);
        setExit(true);
    }

    if (exit)
        return <Navigate to="/"/>;

    if (loadedSuccessfully)
        return <Navigate to={`/${gameid}`}/>;

    refresh_players();

    Modal.setAppElement("#root");

    return (
        <div>
            <Modal isOpen={isOpen}>
                <h2>Join a Lobby</h2>
                <div>
                    <button onClick={() => {setLobby1(true); join_pool(); refresh_players()}} className={lobby1 ? "buttonHighlight" : ""}>
                        10 | 10 <b>{lobby1Players}</b>
                    </button>
                    <button onClick={() => {refresh_players()}}>Refresh</button>
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
                    <input type="checkbox" id="darkMode" name="darkMode" defaultChecked={enableTimer ? "true" : ""} onChange={event => {
                        setEnableTimer(event.target.checked === "true");
                    }}/>
                </div>
                <div>
                    <p>Start time: </p>
                    <input type="text" defaultValue={time} onChange={event => {
                        setTime(event.target.value);
                    }}/>
                </div>
                <div>
                    <p>Increment: </p>
                    <input type="text" defaultValue={increment} onChange={event => {
                        setIncrement(event.target.value);
                    }}/>
                </div>
                <div className="links">
                    <div className='link' onClick={close}>Cancel</div>
                    <div className='link' onClick={start_game}>Start</div>
                </div>
            </Modal>
        </div>
    );
}