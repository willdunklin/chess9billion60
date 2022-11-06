import { useState } from "react";
import { useCookies } from "react-cookie";
import { Chess } from "../react-chess/react-chess";

interface SettingsProps {
    close: () => void;
}

export const Settings = (props: SettingsProps) => {
    const { close } = props;
    const [ cookies, setCookie ] = useCookies(['lightSquareColor', 'darkSquareColor', 'darkMode', 'volume', 'scroll']);
    let [colorl, setColorl] = useState<string>(cookies.lightSquareColor ?? '#f0d9b5');
    let [colord, setColord] = useState<string>(cookies.darkSquareColor  ?? '#b58863');
    let [darkMode, setDarkMode] = useState<boolean>((cookies.darkMode === "true") ?? false);
    let [scroll, setScroll] = useState<boolean>((cookies.scroll === "true") ?? false);
    let [volume, setVolume] = useState<number>(cookies.volume ?? 100);
    return (
        <div style={{
                padding: '0.5em 0',
                display: "flex",
                flexDirection: "column",
                //justifyContent: "center",
                alignItems: "center",
                zIndex: "1",
            }}>
            <h3>Settings</h3>
            <label htmlFor="volume">Volume</label>
            <input type="range"
                   id="volume"
                   name="volume"
                   defaultValue={volume}
                   onChange={event => {
                       setVolume( Number(event.target.value) )
                   }}
            />
            <div style={{padding:"5px"}}>
                <label htmlFor="darkMode">Dark Mode</label>
                <input type="checkbox"
                       id="darkMode"
                       name="darkMode"
                       checked={darkMode}
                       onChange={event => {setDarkMode(event.target.checked)}}
                />
            </div>
            <div style={{padding:"5px"}}>
                <label htmlFor="darkMode">Scroll Through History</label>
                <input type="checkbox"
                       id="moveScroll"
                       name="scroll"
                       checked={scroll}
                       onChange={event => {setScroll(event.target.checked)}}
                />
            </div>

            <div style={{padding:"5px", paddingTop: '10px'}}>
                <label htmlFor="lightSquareColor">Theme </label>
                <input type="color"
                       id="lightSquareColor"
                       value={colorl}
                       onChange={event => {setColorl(event.target.value)}}
                />
                <input type="color"
                       id="darkSquareColor"
                       value={colord}
                       onChange={event => {setColord(event.target.value)}}
                />
            </div>

            <div style={{padding:"5px"}}>
                <button style={{width: "max-content"}} onClick={() => {
                    setColorl("#f0d9b5");
                    setColord("#b58863");
                }}>Restore Default Theme</button>
            </div>

            <div style={{display: "block"}}>
                <div style={{
                        position: "relative",
                        padding: '5px',
                        width:  "200px",
                        height: "200px"}}>
                    <Chess pieces={["WP@d4","BP@d5","WP@e4","BP@e5","WK@a1","BR@d1","BK@g7"]}
                           dots={["WK@a2","WK@b2"]}
                           highlights={["BR@d1", "BR@g1"]}
                           check={"W"}
                        //    width="100%"
                        //    height="100%"
                           drawLabels={false}
                           lightSquareColor={colorl}
                           darkSquareColor={colord}
                           onDragStart = {() => false}
                    />
                </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                <div className="link noselect" style={{padding:"10px 20px"}}>
                    <div onClick={close}>
                        Close
                    </div>
                </div>
                <div className="link noselect" style={{padding:"10px 20px"}}>
                    <div onClick={() => {
                        setCookie('lightSquareColor', colorl);
                        setCookie('darkSquareColor', colord);
                        setCookie('volume', volume);
                        setCookie('darkMode', darkMode);
                        setCookie('scroll', scroll);
                        window.location.reload();
                    }}>
                        Apply
                    </div>
                </div>
            </div>
        </div>
    );
}
