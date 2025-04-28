import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import express from "express";
import { createContext } from "./src/Controller/trpc";
import { procedures } from "./src/Controller/router";
import { handleSSE } from './src/Controller/eventsProcedures';

const app = express();

app.use(cookieParser("totally secure secret"));
app.use("/api", createExpressMiddleware({
    router: procedures,
    createContext
}));

app.listen(8001, () => {
    console.log("Listening on http://localhost:8001");
});

app.get('/api/events', handleSSE);