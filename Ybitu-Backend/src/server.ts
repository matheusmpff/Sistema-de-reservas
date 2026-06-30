import "dotenv/config";
import express from "express";
import helmet from "helmet";
import MainRouter from "./routes/MainRouter.js";
import { notDefined, serverError } from "./routes/ErrorHandler.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { populateDB } from "./services/User.js";

await populateDB();

const server = express();

server.use(cors({
  origin: 'http://localhost:5173', // endereço do React
  credentials: true
}))
server.use(cookieParser())
server.use(helmet());
server.use(express.json());

server.use("/", MainRouter);
server.use(notDefined);
server.use(serverError);



const s = server.listen(3000,() => {
    console.log("Servidor está rodando em : http://localhost:3000/");
});

process.on("SIGTERM", () => {
  s.close(() => {
    process.exit(0);
  })
});
