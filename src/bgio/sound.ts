import { Howl } from 'howler';
import Cookies from 'js-cookie';

import MoveSound from '../assets/sounds/Move.ogg';
import CaptureSound from '../assets/sounds/Capture.ogg';
import GenericNotifySound from '../assets/sounds/GenericNotify.ogg';
import LowTimeSound from '../assets/sounds/LowTime.ogg';

const Move = new Howl({
    src: MoveSound
});
const Capture = new Howl({
    src: CaptureSound
});
const GenericNotify = new Howl({
    src: GenericNotifySound
});
const LowTime = new Howl({
    src: LowTimeSound
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
