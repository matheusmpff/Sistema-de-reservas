import express from "express";
import { Auth } from "../middlewares/Auth.js";
import userRouter from "./User.js";
import quartosRouter from "./QuartosAdmin.js";
import nodemailer from "nodemailer";
import * as zod from "zod"

import userRouter from "./User.js";

const secret = process.env.JWT_SECRET_KEY;
console.log(secret)
if (!secret) {
  throw new Error("JWT_SECRET não configurado");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASSWORD
  }
});

const MainRouter = express.Router();
MainRouter.use("/user", userRouter);

MainRouter.get("/", (_req, res) => {
  res.json({ msg: "Oiii" });
});

MainRouter.get("/auth", Auth.private, (_req, res) => {
  res.status(201).json({
    logged: true,
  })
})

MainRouter.get("/logout", Auth.private, (_req, res) => {
  res.clearCookie("token")
  res.status(201).json({
    logged: false
  })
})

const duvidaSchema = zod.object({
  userEmail: zod.email(),
  userName: zod.string().min(2),
  userPhone: zod.e164(),
  userMessage: zod.string().min(5).max(255),
})

MainRouter.post("/email", (req, res) => { 
  console.log(req.body)

  try {
    let answerData = duvidaSchema.parse(req.body);

    transporter.sendMail({
      from: process.env.GMAIL_ACCOUNT,
      to: process.env.GMAIL_ACCOUNT,
      replyTo: answerData.userEmail,
      subject: `Registro de Contato - Dúvidas de ${answerData.userName}`,
      text: `
      Pessoa que entrou em contato: ${answerData.userName}
      Data de contato: ${new Date().toLocaleDateString("pt-BR")}
      Formas de Contato: 
        email: ${answerData.userEmail},
        telefone: ${answerData.userPhone}
    
      Dúvida de ${answerData.userName}:
        ${answerData.userMessage}
      `
    }).then(() => {
      res.json({ msg: "Deu Certooo" })
    }).catch(err => {
      console.log(err)
      res.json({ msg: "Deu merda parceiro" })
    })
  }
  catch (error){
    console.log("Erro em MainRouter");
    if (error instanceof zod.ZodError) {
      console.log("Validação do answerData falhou");
      console.log(error.issues);
    }
    res.status(400).json(error)
  }
});


export default MainRouter;
