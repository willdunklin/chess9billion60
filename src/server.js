const { Server, Origins } = require("boardgame.io/server");
const { Chess } = require("./Game");
const serve = require("koa-static");
const path = require("path");

const server = Server({
    games: [Chess],
    origins: [Origins.LOCALHOST],
    // generateCredentials,
    // authenticateCredentials,
});

const frontEndAppBuildPath = path.resolve(__dirname, '../build');
server.app.use(serve(frontEndAppBuildPath));

const PORT = (process.env.NODE_ENV === "production") ? process.env.PORT || 8000 : 8000;
server.run(PORT, () => {
    server.app.use(
        async (ctx, next) => serve(frontEndAppBuildPath)(
            Object.assign(ctx, { path: 'index.html' }),
            next
        )
    )
});