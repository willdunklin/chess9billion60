import { Howl } from 'howler';
import Cookies from 'js-cookie';

const Move = new Howl({
    src: 'https://chess9b60.s3.amazonaws.com/sounds/Move.mp3'
});
const Capture = new Howl({
    src: 'https://chess9b60.s3.amazonaws.com/sounds/Capture.mp3'
});
const GenericNotify = new Howl({
    src: 'https://chess9b60.s3.amazonaws.com/sounds/GenericNotify.mp3'
});

export const move = volume => {Move.volume(volume * (Cookies.get("volume") ?? 100) / 100); Move.play();}
export const capture = volume => {Capture.volume(volume * (Cookies.get("volume") ?? 100) / 100); Capture.play();}
export const end = volume => {GenericNotify.volume(volume * (Cookies.get("volume") ?? 100) / 100); GenericNotify.play();}
