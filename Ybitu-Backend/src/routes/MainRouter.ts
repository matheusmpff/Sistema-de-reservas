import express from "express";
import { Auth } from "../middlewares/Auth.js";
import userRouter from "./User.js";
import quartosRouter from "./QuartosAdmin.js";
import pessoaRouter from "./Pessoa.js";
import reservaRouter from "./Reserva.js";
import feedbackRouter from "./Feedback.js";

const secret = process.env.JWT_SECRET_KEY;
if (!secret) {
    throw new Error("JWT_SECRET_KEY não configurado no .env");
}

const MainRouter = express.Router();

MainRouter.use("/user", userRouter);
MainRouter.use("/quartos", quartosRouter);
MainRouter.use("/pessoas", pessoaRouter);
MainRouter.use("/reservas", reservaRouter);
MainRouter.use("/feedbacks", feedbackRouter);

// Rota de health-check (pública)
MainRouter.get("/", (_req, res) => {
    res.json({ msg: "Ybitu API online" });
});

export default MainRouter;
