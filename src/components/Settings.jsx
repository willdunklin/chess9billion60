import { useState } from "react";
import {useCookies } from "react-cookie";
const {Chess} = require("../react-chess/react-chess.js");

export const Settings = () => {
    const [ cookies, setCookie ] = useCookies(['user']);
    let [colorl, setColorl] = useState(cookies.lightSquareColor === undefined ? '#f0d9b5': cookies.lightSquareColor)
    let [colord, setColord] = useState(cookies.darkSquareColor === undefined ? '#b58863': cookies.darkSquareColor)
    let [darkMode, setDarkMode] = useState() 
    let [volume, setVolume] = useState() 
    return <div style={{
                padding: '50px',
                display: "flex",
                flexDirection: "column",
                //justifyContent: "center",
                alignItems: "center",
                zIndex: "1",
            }}>
            <label for="volume">Volume</label>
            <input type="range" id="volume" name="volume" defaultValue={cookies.volume === undefined ? '100': cookies.volume} onChange={event => {
                    setVolume( event.target.value)
                }}/>
            <input type="checkbox" id="darkMode" name="darkMode" onChange={event => {
                  setDarkMode(event.target.value)
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