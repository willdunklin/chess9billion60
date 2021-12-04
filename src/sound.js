module.exports = {
    move: new Audio(require("./sounds/Move.ogg").default),
    capture: new Audio(require("./sounds/Capture.ogg").default),
    select: new Audio(require("./sounds/Select.ogg").default),

    end: new Audio(require("./sounds/GenericNotify.ogg").default),

    // draw: new Audio(require("./sounds/Draw.ogg").default),
    // victory: new Audio(require("./sounds/Victory.ogg").default),
    // defeat: new Audio(require("./sounds/Defeat.ogg").default),
}