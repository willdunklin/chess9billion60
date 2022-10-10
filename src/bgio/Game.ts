import type { Game, Move } from 'boardgame.io';
import { INVALID_MOVE } from "boardgame.io/core";
const { PieceTypes } = require("./pieces");
const { initialBoard, validMove, colorInCheck, colorInStalemate, isRepetitionDraw, insufficentMaterialDraw } = require("./logic");

console.log('pieces', PieceTypes);

export interface GameState {
    history: (string | null)[][];
    promotablePieces: string[];
    move_history: string[][];
    whiteTurn: boolean;
    inCheck: string;
    noProgressCounter: number;
    timer_enabled: boolean;
    startTime: number;
    wTime: number;
    bTime: number;
    increment: number;
    last_event: number;
}

function handleTimers(G: GameState, add_increment: boolean) {
    if (G.wTime <= 0 || G.bTime <= 0)
        return;

    let delta = Date.now() - G.last_event;
    if (add_increment)
        delta -= G.increment;
    if (G.whiteTurn)
        G.wTime = G.wTime - delta;
    else
        G.bTime = G.bTime - delta;
    G.last_event = Date.now();
}

const movePiece: Move<GameState> = (G, _ctx, piece, from, to, promotion) => {
    console.log(typeof(initialBoard));
    // simulate move
    let board = validMove(G.history, piece.name, from, to, G, promotion);

    if (board !== null) {
        // don't start timers until first move
        if (G.history.length <= 2 || !G.timer_enabled) {
            G.last_event = Date.now();
            G.wTime = G.startTime;
            G.bTime = G.startTime;
        }
        else {
            handleTimers(G, true);
        }

        G.history.unshift(board); // prepend new board to history
        G.whiteTurn = piece.name.charAt(0) !== "W";
        G.move_history.unshift([`${piece.name}@${from}`, `${piece.name}@${to}`]);
        const color = G.whiteTurn ? "W" : "B";
        G.inCheck = colorInCheck(board, color) ? color : "";
    } else
        return INVALID_MOVE;
}

export const Chess: Game<GameState> = {
    name: "Chess",

    setup: () => {
        const initialPos: (string|null)[] = initialBoard(3000, 4000);
        const initialTime = 15 * 60 * 1000;
        return ({
            history: [initialPos],
            promotablePieces: [...new Set(
                initialPos.filter(p => p !== null)
                    .map(p => p?.substring(1) || 'X') // remove color
                    .filter(p => !["K", "P"].includes(p)) // filter pawns and kings
                    .sort((a, b) => (PieceTypes[a].strength < PieceTypes[b].strength) ? 1 : -1)
            )],

            move_history: [],
            whiteTurn: true,
            // "" "W" "B" depending on who is in check
            inCheck: "",
            noProgressCounter: 0,

            // times for each of the players (multiplied by 1000 for ms)
            timer_enabled: true,
            startTime:  initialTime,
            wTime:      initialTime,
            bTime:      initialTime,
            increment:  10 * 1000,
            last_event: Date.now(),
        });
    },

    turn: {
        minMoves: 1,
        maxMoves: 1,
    },

    moves: {
        // moves a piece and produces new board, if move is illegal: returns null
        movePiece: movePiece,
        timeout: (G, ctx) => {
            handleTimers(G, false);
            if (G.bTime > 0 && G.wTime > 0)
                return INVALID_MOVE;
            ctx.events?.endGame({ winner: G.whiteTurn ? "Black" : "White" });
        },
        resign: (G, ctx) => {
            ctx.events?.endGame({ winner: G.whiteTurn ? "Black" : "White" });
        }
    },

    endIf: (G, _ctx) => {
        // Check for timeout
        if(G.bTime <= 0)
            return {winner: "White"};
        if(G.wTime <= 0)
            return {winner: "Black"};

        const board = G.history[0];
        // check if white in stalemate
        if (G.whiteTurn && colorInStalemate(G.history, "W")) {
            if (colorInCheck(board, "W"))
                // winner = black
                return {winner: "Black"};
            return {draw: true};
        }

        // check if black in stalemate
        if (!G.whiteTurn && colorInStalemate(G.history, "B")) {
            if (colorInCheck(board, "B"))
                // winner = white
                return {winner: "White"};
            return {draw: true};
        }

        //check the weird draws
        if (G.noProgressCounter >= 200 || isRepetitionDraw(G.history) || insufficentMaterialDraw(G.history[0]))
            return {draw: true};
    }
};
