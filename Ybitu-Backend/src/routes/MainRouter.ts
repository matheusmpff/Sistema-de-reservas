import express from "express";
import { createUser, loginUser, userData } from "../services/User.js";
import { Auth } from "../middlewares/Auth.js";
import jwt from "jsonwebtoken";
import { type LoginInput, isSignupInput } from "../types.js";
import userRouter from "./User.js";

const secret = process.env.JWT_SECRET_KEY;
console.log(secret)
if (!secret) {
  throw new Error("JWT_SECRET não configurado");
}

const MainRouter = express.Router();
MainRouter.use("/user", userRouter);

MainRouter.get("/",Auth.private, (_req, res) => {
    res.json({ msg: "Oiii" });
});

// User tries to login


export default MainRouter;
