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
            <input type="checkbox" id="darkMode" name="darkMode" defaultChecked = {darkMode === "true" ? "true" : ""} onChange={event => {
                  setDarkMode(event.target.checked)
                }}/>
            <input type="color"  id="lightSquareColor" defaultValue={colorl} onChange={event => {
                    setColorl(event.target.value)
                }}></input>
            <input type="color" id="darkSquareColor" defaultValue={colord} onChange={event => {
                setColord(event.target.value)
                }}></input>
            <button onClick={() => {
                setCookie('lightSquareColor', colorl)
                setCookie('darkSquareColor', colord)
                setCookie('volume', volume)
                setCookie('darkMode', darkMode)
                window.location.reload(false)}}
                >Apply!</button>
            <div style={{
                    position: "relative",
                    padding: '5px', 
                    width:  "200px",
                    height: "200px"}}><Chess pieces = {[]} dots = {[]} width = "100%" height = "100%" drawLabels = {false} lightSquareColor = {colorl} darkSquareColor = {colord}/></div>
            </div>
}