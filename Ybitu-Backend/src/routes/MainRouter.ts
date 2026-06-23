import express from "express";
import { Auth } from "../middlewares/Auth.js";
import userRouter from "./User.js";
import quartosRouter from "./QuartosAdmin.js";
import pessoaRouter from "./Pessoa.js";
import reservaRouter from "./Reserva.js";
import feedbackRouter from "./Feedback.js";
import nodemailer from "nodemailer";

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

MainRouter.get("/", (req, res) => {
  res.json({ msg: "Oiii" });
});

MainRouter.get("/auth", Auth.private, (req, res) => {
  res.status(201).json({
    logged: true,
  })
})

MainRouter.get("/logout", Auth.private, (req, res) => {
  res.clearCookie("token")
  res.status(201).json({
    logged: false
  })
})

MainRouter.post("/email", (req, res) => { 
  console.log(req.body )
  transporter.sendMail({
    from: process.env.GMAIL_ACCOUNT,
    to: process.env.GMAIL_ACCOUNT,
    replyTo: req.body.email,
    subject: `Registro de Contato - Dúvidas de ${req.body.nome}`,
    text: `
    Pessoa que entrou em contato: ${req.body.nome}
    Data de contato: ${new Date().toLocaleDateString("pt-BR")}
    Formas de Contato: 
      email: ${req.body.email},
      telefone: ${req.body.telefone}
    
    Dúvida de ${req.body.nome}:
      ${req.body.comentario}
    `
  }).then(() => {
    res.json({ msg: "Deu Certooo" })
  }).catch(err => {
    console.log(err)
    res.json({ msg: "Deu merda parceiro" })
  })
});


export default MainRouter;
