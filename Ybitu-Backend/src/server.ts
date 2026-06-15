import "dotenv/config";
import express from "express";
import helmet from "helmet";
import MainRouter from "./routes/MainRouter.js";
import { notDefined, serverError } from "./routes/ErroHandler.js";


const server = express();
server.use(helmet());
server.use(express.json());

server.use("/", MainRouter);
server.use(notDefined);
server.use(serverError);



server.listen(3000,() => {
    console.log("Servidor está rodando em : http://localhost:3000/");
})

