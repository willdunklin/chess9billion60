import { Server, Origins } from "boardgame.io/server";
import serve from "koa-static";
import * as Application from "koa";
import path from "path";
import { DynamnoStore } from "./bgio/db";
import { creds } from "./bgio/creds";
import { Chess } from "./bgio/Game";

const db = new DynamnoStore("us-east-2", creds(), "bgio");

const server = Server({
    games: [Chess],
    origins: [Origins.LOCALHOST],
    db: db,
});

const frontEndAppBuildPath = path.resolve(__dirname, '../dist');
server.app.use(serve(frontEndAppBuildPath));

const PORT = (process.env.NODE_ENV === "production") ? Number(process.env.PORT || 8000) : 8000;
server.run(PORT, () => {
    server.app.use(
        async (ctx: Application.Context, next: Application.Next) =>
            serve(frontEndAppBuildPath)(
                Object.assign(ctx, { path: 'index.html' }),
                next
            )
    )
});
