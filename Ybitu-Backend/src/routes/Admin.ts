import { Router } from "express";
import * as admin from "../services/Admin.js"
import * as tipos from "../types.js"
import jwt, { type JwtPayload } from "jsonwebtoken";
import multer from "multer"
import path from "path"
import { Auth } from "../middlewares/Auth.js";
import { error } from "console";

const upload = multer({dest:path.resolve("uploads")});

const secret = process.env.JWT_SECRET_KEY;
// console.log(secret);
if (!secret) throw new Error("Falha na autenticação JWT");

const router = Router();
router.use(Auth.privateAdmin);

router.get("/reservas", async (req, res) => {

    try {
        const reservas = await admin.listarReservas();
        res.json(reservas);
    } catch (err) {
        res.status(500).json({error: "Erro ao listar reservas."})
    }

});

router.post("/reservas", async (req, res) => {
    
    try {

        const {idUser, checkIn, checkOut, numPessoas, valor, numeroQuarto} = req.body;
        const reserva = await admin.criarReservas(
            idUser, 
            new Date(checkIn),
            new Date(checkOut),
            numPessoas,
            valor, 
            numeroQuarto
        );

        res.status(201).json(reserva);

    } catch(err: any) {
        res.status(400).json({
            error: err.message
        })
    }

});

router.patch("/reservas/quarto", async (req, res) => {

    try {
        
        const {idUser, dataReserva, numeroNovoQuarto} = req.body;
        const novoQuarto = await admin.alterarQuarto(
            idUser,
            new Date(dataReserva), 
            numeroNovoQuarto
        );

        res.status(200).json(novoQuarto);

    } catch (err: any) {
        res.status(400).json({
            error: err.message
        })
    }


});

router.patch("/reservas/data", async (req, res) => {

    try {

        const {idUser, dataReserva, novoCheckIn, novoCheckOut} = req.body;
        const novaData = await admin.alterarDataReserva(
            idUser,
            new Date(dataReserva),
            new Date(novoCheckIn),
            new Date(novoCheckOut),
        );
        res.status(200).json(novaData);

    } catch (err: any) {
        res.status(400).json({
            error: err.message
        })
    }


});

router.patch("/reservas/status", async (req, res) => {

    try {

        const {idUser, dataReserva, novoStatus} = req.body;
        const status = await admin.alterarStatusPagamentoReserva(
            idUser,
            new Date(dataReserva),
            novoStatus
        );
        res.status(200).json(status);

        
    } catch (err: any) {
        res.status(400).json({
            error: err.message
        })
    } 

});

router.patch("/reservas/valor", async (req, res) => {

    try {

        const {idUser, dataReserva, valorAdicionado} = req.body;
        const valor = await admin.alterarValorReserva(
            idUser, 
            new Date(dataReserva),
            valorAdicionado
        )
        res.status(200).json(valor);

    } catch (err: any) {
        res.status(400).json({
            error: err.message
        })
    }

});

router.patch("/quartos/status", async (req, res) => {

    try {

        const { numeroQuarto, novoStatus} = req.body;
        const status = await admin.alterarStatusQuarto(
            numeroQuarto,
            novoStatus
        )
        res.status(200).json(status);

    } catch (err: any) {
        res.status(400).json({
            error: err.message
        })
    }
        
});

router.patch("/hospedes/tipos", async(req, res) => {

    try {

        const {idPessoa, email, telefone } = req.body;
        const tipo = await admin.alterarHospedeTipo(
            idPessoa, 
            email,
            telefone
        )
        res.status(200).json(tipo);


    } catch (err: any) {
        res.status(400).json({
            error: err.message
        })
    }

});

router.patch("/hospedes/dados", async(req, res) => {

    try {

        const {idPessoa, ...dados} = req.body;
        await admin.alterarHospedeDados(idPessoa, dados);
        res.status(200).json({mgs: "Dados atualizados com sucesso!"})

    } catch (err: any) {
        res.status(400).json({
            error: err.message
        })
    }

});

router.get("/feedbacks", async (req, res) => {
    
    try {
        const feedbacks = await admin.listarFeedbacks();
        res.status(200).json(feedbacks);

    } catch (err: any) {
        res.status(400).json({
            error: err.message
        })
    }


})

router.get("/quartos", async (req, res) => {
    try {
        res.json(await admin.listarQuartos());
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar quartos" });
    }
});

router.get("/hospedes", async (req, res) => {
    try {
        res.json(await admin.listarHospedes());
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar hóspedes" });
    }
});


export default router;

