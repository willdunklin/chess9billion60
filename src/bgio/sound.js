import UIfx from 'uifx';
import Cookies from 'js-cookie';
const Move = new UIfx(require("../sounds/Move.ogg"));
const Capture = new UIfx(require("../sounds/Capture.ogg"));
const GenericNotify = new UIfx(require("../sounds/GenericNotify.ogg"));

export const move = volume => Move.play((Cookies.get("volume") ?? 100) / 100 * volume);
export const capture = volume => Capture.play((Cookies.get("volume") ?? 100) / 100 *volume);
export const end = volume => GenericNotify.play((Cookies.get("volume") ?? 100) / 100 *volume);