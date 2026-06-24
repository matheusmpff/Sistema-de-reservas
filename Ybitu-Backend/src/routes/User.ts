import { Router } from "express";
import { deleteAccount, alterData, createUser, feedback, loginUser, userBooking, userData } from "../services/User.js";
import { type LoginInput, isSignupInput } from "../types.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import multer from "multer"
import path from "path"
import { Auth } from "../middlewares/Auth.js";

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
        const arr = await loginUser(login_input);

        if (arr) {
            const token = jwt.sign({ email: req.body.email, id: arr[0], admin: arr[1], nome: arr[2] }, secret, { expiresIn: "30m" });
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 30 * 60 * 1000
            })
            return res.json({ msg: "Login realizado com sucesso",nome: arr[2] });
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
router.get("/data", Auth.private, async (req, res) => {
    const token = req.cookies.token;
    const content = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    console.log("ROTA /user/data FOI CHAMADA");
    console.log("EMAIL:", content.email);

    try {
        res.json(await userData(content.email));
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Erro do servidor" });
    }
});

router.get("/booking", Auth.private, async (req, res) => {
    try {
        const token = req.cookies.token;
        const content = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
        let resposta = await userBooking(content.email);
        console.log(resposta);
        return res.status(201).json({ booking: resposta });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Erro do servidor" })
    }
})

router.post("/feedback", upload.array("photos", 3), async (req, res, next) => {
    const files = req.files as Express.Multer.File[];
    const checkIn = new Date(req.body.checkIn);
    const checkOut = new Date(req.body.checkOut);
    console.log(checkIn, checkOut)
    let urls: string[] = []

    if (req.files != undefined) {
        for (let photo of files) {
            urls.push(photo.path)
        }
    }
    console.log(urls)

    try {
        const resposta = await feedback(req.body.email, req.body.comentario, urls, checkIn, checkOut, req.body.nota);

        if (resposta) {
            res.status(201).json({ msg: "Feedback cadastrado" })
        }
        else {
            res.status(400).json({ error: "Erro, já existe feedback e\ou dados invalidos" })
        }
    }
    catch {
        res.json({ msg: "Erro no servidor" })
    }
})

router.post("/alterData", async (req, res) => {
    console.log("entrei aqui");
    const token = req.cookies.token;
    const content = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;

    console.log(req.body);
    try {
        const success = await alterData(content.id, {
            email: req.body.email,
            nome: req.body.nome,
            dataNasc: req.body.dataNasc
        });
        if (success) {
            const token2 = jwt.sign({ email: req.body.email, id: content.id }, secret, { expiresIn: "30m" });
            res.cookie("token", token2, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 30 * 60 * 1000
            })
            res.status(200).json("Alteração realizada com sucesso!")
        }
        else {
            console.log(success);
            res.status(400).json("Email já está sendo utilizado")
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "Erro no servidor" })
    }

})

router.get("/delete", Auth.private, async (req, res) => {
    const token = req.cookies.token;
    const content = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;

    if (await deleteAccount(content.id)) {
        res.clearCookie("token")
        res.status(200).json({ msg: "Conta deletada." });
    }
    else{
        res.status(500).json({msg: "Erro no servidor."})
    }

})

export default router;