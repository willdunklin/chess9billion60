import React, { useState } from "react";
import { nanoid } from 'nanoid';
import { Navigate } from 'react-router-dom';
import Modal from 'react-modal';
import { useCookies } from "react-cookie";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

import { PieceTypes } from "../bgio/pieces";
import { initialBoard } from "../bgio/logic";
import { getGame, updatePlayer, makeGame } from "../bgio/api";


// <API>
// TODO: move to actual api
const dbclient = new DynamoDBClient({ region: 'us-east-2', credentials: require("../bgio/creds").creds});
const tableName = "bgio";

function getNewID() {
    // some kind of game id unique string
    const str = nanoid();
    return str.substring(0, 6);
}

async function makeMatch(gameid, start_time=900000, increment=10000, timer_enabled=true) {
    console.log('NEW: making match');
    const board = initialBoard();

    const G = {
        "history": [board],
        "promotablePieces": [...new Set(
            board.filter(p => p !== null)
            .map(p => p.substring(1)) // remove color
            .filter(p => !["K", "P"].includes(p)) // filter pawns and kings
            .sort((a, b) => (PieceTypes[a].strength < PieceTypes[b].strength) ? 1 : -1)
        )],
        "move_history": [],
        "whiteTurn": true,
        "inCheck": "",
        "noProgressCounter": 0,
        "timer_enabled": timer_enabled,
        "startTime": start_time,
        "wTime": start_time,
        "bTime": start_time,
        "increment": increment,
        "last_event": Date.now()        
    }
    const ctx = {
        "numPlayers": 2,
        "turn": 1,
        "currentPlayer": "0",
        "playOrder": ["0", "1"],
        "playOrderPos": 0,
        "phase": null,
        "activePlayers": null,
        "_activePlayersMinMoves": null,
        "_activePlayersMaxMoves": null,
        "_activePlayersNumMoves": {},
        "_prevActivePlayers": [],
        "_nextActivePlayers": null,
        "numMoves": 0
    }
    const plugins = {
        "random": { "data": { "seed": Date.now().toString(36).slice(-10) } },
        "log": { "data": {} },
        "events": { "data": {} }
    }
    const initialState = {
        "G": G,
        "ctx": ctx,
        "plugins": plugins,
        "_undo": {
            "G": G,
            "ctx": ctx,
            "plugins": plugins
        },
        "_redo": [],
        "_stateID": 0
    }

    const content = {
        id: {S: gameid},
        gameName: {S: "Chess"},
        players: {S: "{\"0\":{\"id\":0},\"1\":{\"id\":1}}"},
        setupData: {S: ""},
        gameover: {S: "null"},
        nextMatchID: {S: ""},
        unlisted: {BOOL: true},
        state: {S: JSON.stringify(initialState)},
        initialState: {S: JSON.stringify(initialState)},
        log: {S: "[]"},
    }

    await dbclient.send(new PutItemCommand({
        TableName: tableName,
        Item: content
    }));

    return gameid;
}
// </API>

export const New = props => {
    const [ loadedSuccessfully, setLoadedSuccessfully ] = useState(null);
    const [ isOpen, setIsOpen ] = useState(true);
    const [ exit, setExit ] = useState(false);
    const [ isWhite, setIsWhite ] = useState("0");
    const [ time, setTime ] = useState(900);
    const [ increment, setIncrement ] = useState(10);
    const [ enableTimer, setEnableTimer ] = useState(true);
    const [ spectator, setSpectator ] = useState(false);
    const [ gameid, setGameid ] = useState(getNewID());
    const [ cookies ] = useCookies(['user']);

    React.useEffect(() => {
        if (!isOpen && !spectator) {
            makeMatch(gameid, 1000 * time, 1000 * increment, enableTimer)
                .then(() => {
                    setLoadedSuccessfully(true);
                })
                .catch(e => {
                    console.error('error!', e);
                    setLoadedSuccessfully(false);
                })
        }
    }, [isOpen, spectator, gameid, time, increment, enableTimer]);


    async function start_game() {
        if (isWhite === "random") 
            setIsWhite(Math.random() > 0.5 ? "0" : "1");

        let game = await getGame(dbclient, "games", gameid);
        // if the game doens't exist, make one
        if(!game)
            await makeGame(dbclient, "games", gameid);

        if(await updatePlayer(dbclient, "games", gameid, cookies.idtoken, isWhite === "1") !== cookies.idtoken)
            setSpectator(true);

        setIsOpen(false);
    }
    function close() {
        setIsOpen(false);
        setExit(true);
    }

    if (exit)
        return <Navigate to="/"/>;

    if (loadedSuccessfully || spectator)
        return <Navigate to={`/${gameid}`}/>;

    Modal.setAppElement("#root");
    return (
        <div>
            <Modal isOpen={isOpen}>
                <h3>Game settings</h3>
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
                    <input type="checkbox" id="darkMode" name="darkMode" defaultChecked={enableTimer? "true" : ""} onChange={event => {
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