import express from "express";
import { createUser, loginUser, userData } from "../services/User.js";

const MainRouter = express.Router();

MainRouter.get("/", (req, res) => {
    res.json({ msg: "Oiii" });
});

MainRouter.get("/user", async (req, res) => {
    const {email, senha} = req.body;

     try {
        const user = await loginUser({
            email,
            senha
        });

        if (user) {
            return res.json({ msg: "Login realizado com sucesso" });
        }
        return res.json({ msg: "Dados inválidos"});

    } catch (err) {
        console.error(JSON.stringify(err, null, 2));
        throw err;
    }

});

MainRouter.post("/user", async (req, res) => {
    console.log("a rota foi chamada")
    const { nome, email, data, sexo, telefone, senha } = req.body;

    if (!nome || !email || !data || !sexo || !telefone || !senha) {
        return res.status(400).json({ msg: "Campos obrigatorios faltando." })
    }

    try {
        const user = await createUser({
            nome,
            email,
            data: new Date(data),
            sexo,
            telefone,
            senha
        });

        if (user) {
            return res.json({ msg: "Cadastrado com Sucesso" });
        }
        return res.json({ msg: "Usuário já cadastrado" });

    } catch (err) {
        console.error(JSON.stringify(err, null, 2));
        throw err;
    }
})

MainRouter.get("/user/data", async (req, res) => {
    const { email } = req.query;
    console.log("ROTA /user/data FOI CHAMADA");
    console.log("EMAIL:", req.query.email);

     try {
        res.json( await userData(email as string))
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Erro do servidor"});
    }
});


export default MainRouter;