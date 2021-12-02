const { Server, Origins } = require("boardgame.io/server");
const { Chess } = require("./Game");

const server = Server({
    games: [Chess],
    origins: [Origins.LOCALHOST]
});

server.run(8000);