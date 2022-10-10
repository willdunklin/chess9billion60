import { Howl } from 'howler';
import Cookies from 'js-cookie';

const Move = new Howl({
    // src: 'https://chess9b60.s3.amazonaws.com/sounds/Move.mp3'
    src: require("../sounds/Move.ogg")
});
const Capture = new Howl({
    // src: 'https://chess9b60.s3.amazonaws.com/sounds/Capture.mp3'
    src: require("../sounds/Capture.ogg")
});
const GenericNotify = new Howl({
    // src: 'https://chess9b60.s3.amazonaws.com/sounds/GenericNotify.mp3'
    src: require("../sounds/GenericNotify.ogg")
});
const LowTime = new Howl({
    // src: 'https://chess9b60.s3.amazonaws.com/sounds/LowTime.mp3'
    src: require("../sounds/LowTime.ogg")
});

export const move = (volume: number) => {
    Move.volume(volume * Number(Cookies.get("volume") ?? 100) / 100); Move.play();
};
export const capture = (volume: number) => {
    Capture.volume(volume * Number(Cookies.get("volume") ?? 100) / 100); Capture.play();
};
export const end = (volume: number) => {
    GenericNotify.volume(volume * Number(Cookies.get("volume") ?? 100) / 100); GenericNotify.play();
};
export const lowtime = (volume: number) => {
    LowTime.volume(volume * Number(Cookies.get("volume") ?? 100) / 100); LowTime.play();
};
