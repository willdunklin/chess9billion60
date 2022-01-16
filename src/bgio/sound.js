import UIfx from 'uifx';
const Move = new UIfx(require("../sounds/Move.ogg"));
const Capture = new UIfx(require("../sounds/Capture.ogg"));
const GenericNotify = new UIfx(require("../sounds/GenericNotify.ogg"));

export const move = volume => Move.play(volume);
export const capture = volume => Capture.play(volume);
export const end = volume => GenericNotify.play(volume);