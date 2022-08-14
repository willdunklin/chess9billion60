const { Server, Origins } = require("boardgame.io/server");
const { Chess } = require("./bgio/Game");
const serve = require("koa-static");
const path = require("path");
const { DynamnoStore } = require("./bgio/db.ts");
const { creds } = require("./bgio/creds.js");

const db = new DynamnoStore("us-east-2", creds, "bgio");

const server = Server({
    games: [Chess],
    origins: [Origins.LOCALHOST],
    db: db,
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