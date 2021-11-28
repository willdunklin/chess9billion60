const { Server, Origins } = require("boardgame.io/server");
const { TicTacToe } = require("./Game")

const server = Server({
    games: [TicTacToe],
    origins: [Origins.LOCALHOST]
});

server.run(8000);