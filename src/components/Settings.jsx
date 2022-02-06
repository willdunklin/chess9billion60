import { useState } from "react";
import {useCookies } from "react-cookie";
const {Chess} = require("../react-chess/react-chess.js");

export const Settings = () => {
    const [ cookies, setCookie ] = useCookies(['user']);
    let [colorl, setColorl] = useState(cookies.lightSquareColor ?? '#f0d9b5')
    let [colord, setColord] = useState(cookies.darkSquareColor  ?? '#b58863')
    let [darkMode, setDarkMode] = useState(cookies.darkMode ?? "false") 
    let [volume, setVolume] = useState(cookies.volume ?? 100) 
    return <div style={{
                padding: '50px',
                display: "flex",
                flexDirection: "column",
                //justifyContent: "center",
                alignItems: "center",
                zIndex: "1",
            }}>
            <label for="volume">Volume</label>
            <input type="range" id="volume" name="volume" defaultValue={volume} onChange={event => {
                    setVolume( event.target.value)
                }}/>
            <div style={{padding:"5px"}}>
                <label for="darkMode">Dark Mode</label>
                <input type="checkbox" id="darkMode" name="darkMode" defaultChecked = {darkMode === "true" ? "true" : ""} onChange={event => {setDarkMode(event.target.checked)}}/>
            </div>
            
            <div style={{padding:"5px"}}>
                <label for = "lightSquareColor">Theme </label>
                <input type="color" id="lightSquareColor" defaultValue={colorl} onChange={event => {setColorl(event.target.value)}}></input>
                <input type="color" id="darkSquareColor" defaultValue={colord} onChange={event => {setColord(event.target.value)}}></input>
            </div>
            
            <div style={{
                    position: "relative",
                    padding: '5px', 
                    width:  "200px",
                    height: "200px"}}><Chess pieces = {["WP@d4","BP@d5","WP@e4","BP@e5","WK@a1","BR@b1"]} dots = {["WK@a2","WK@b2"]} highlights = {["BR@b1", "BR@g1"]} check = {"W"} width = "100%" height = "100%" drawLabels = {false} lightSquareColor = {colorl} darkSquareColor = {colord} onDragStart = {() => {return false}}/>
            </div>
            <div style={{padding:"5px"}}>
                <button onClick={() => {
                setCookie('lightSquareColor', colorl)
                setCookie('darkSquareColor', colord)
                setCookie('volume', volume)
                setCookie('darkMode', darkMode)
                window.location.reload(false)}}
                >Apply</button>
            </div>
            
            </div>

            
}