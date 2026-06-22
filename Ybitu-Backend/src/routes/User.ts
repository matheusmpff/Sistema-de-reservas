import { Router } from "express";
import { createUser, feedback, loginUser, userData } from "../services/User.js";
import { type LoginInput, isSignupInput } from "../types.js";
import jwt from "jsonwebtoken";
import multer from "multer"
import path from "path"

const upload = multer({ dest: path.resolve("uploads") });

const secret = process.env.JWT_SECRET_KEY;
console.log(secret)
if (!secret) {
    throw new Error("JWT_SECRET não configurado");
}

const router = Router();

// User tries to login
router.post("/login", async (req: { body: LoginInput }, res) => {
    const login_input = req.body;

    try {
        const user = await loginUser(login_input);

        if (user) {
            const token = jwt.sign({ email: req.body.email }, secret, { expiresIn: "1h" });
            return res.json({ msg: "Login realizado com sucesso", token });
        }
        return res.json({ msg: "Dados inválidos" });

    } catch (err) {
        console.error(JSON.stringify(err, null, 2));
        throw err;
    }

});

// User tries to signup his info with email and password
router.post("/", async (req, res) => {
    console.log("a rota foi chamada");
    const userData = req.body;

    if (isSignupInput(userData)) {
        try {
            const user = await createUser(userData);

            if (user) {
                return res.status(201).json({ msg: "Cadastrado com Sucesso" });
            }
            return res.status(400).json({ msg: "Usuário já cadastrado" });

        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
            throw err;
        }
    }
    return res.status(400).json({ msg: "Campos obrigatorios faltando." });
})

// Client wants the data for a user with requested email
router.get("/data", async (req: { query: { email: string } }, res) => {
    const email = req.query.email;
    console.log("ROTA /user/data FOI CHAMADA");
    console.log("EMAIL:", email);

    try {
        res.json(await userData(email));
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Erro do servidor" });
    }
});

router.post("/feedback", upload.array("photos", 3), async (req, res, next) => {
    const checkIn = new Date(req.body.checkIn);
    const checkOut = new Date(req.body.checkOut);
    console.log(checkIn, checkOut)
    try {
        const resposta = await feedback(req.body.email, req.body.comentario, ["123"], checkIn, checkOut);
        
        if(resposta){
            res.status(201).json({msg: "Feedback cadastrado"})
        }
        else{
            res.status(400).json({error: "Erro, já existe feedback e\ou dados invalidos"})
        }
    }
    catch { 
        res.json({msg: "Erro no servidor"})
    }
})

export default router;