import express from "express";
import { Auth } from "../middlewares/Auth.js";
import userRouter from "./User.js";

const secret = process.env.JWT_SECRET_KEY;
console.log(secret)
if (!secret) {
  throw new Error("JWT_SECRET não configurado");
}

const MainRouter = express.Router();
MainRouter.use("/user", userRouter);

MainRouter.get("/", Auth.private, (req, res) => {
  res.json({ msg: "Oiii" });
});


export default MainRouter;
