import { Router } from "express";
import type { Request, Response } from "express";
import { Auth } from "../middlewares/Auth.js";
import { listarReservas, buscarReserva, criarReserva, atualizarStatus, deletarReserva, TipoStatus } from "../services/Reserva.js";

const router = Router();
router.use(Auth.private);

// Reserva usa chave composta [idUser, dataReserva].
// Na URL: /reservas/:idUser/:dataReserva (dataReserva como ISO string)
function parseData(raw: string): Date | null {
    const d = new Date(decodeURIComponent(raw));
    return isNaN(d.getTime()) ? null : d;
}

// GET /reservas
router.get("/", async (_req: Request, res: Response) => {
    try {
        res.json(await listarReservas());
    } catch (err: any) {
        res.status(500).json({ erro: "Erro ao listar reservas" });
    }
});

// GET /reservas/:idUser/:dataReserva
router.get("/:idUser/:dataReserva", async (req: Request, res: Response) => {
    const idUser = Number(req.params.idUser);
    const dataReserva = parseData(req.params.dataReserva);
    if (isNaN(idUser) || !dataReserva) return res.status(400).json({ erro: "Parâmetros inválidos" });

    try {
        const reserva = await buscarReserva(idUser, dataReserva);
        if (!reserva) return res.status(404).json({ erro: "Reserva não encontrada" });
        res.json(reserva);
    } catch (err: any) {
        res.status(500).json({ erro: "Erro ao buscar reserva" });
    }
});

// POST /reservas
// body: { idUser, checkIn, checkOut, numPessoas, status, valor, quartoNumeros? }
router.post("/", async (req: Request, res: Response) => {
    const { idUser, checkIn, checkOut, numPessoas, status, valor } = req.body;

    if (!idUser || !checkIn || !checkOut || !numPessoas || !status || valor === undefined) {
        return res.status(400).json({ erro: "Campos obrigatórios: idUser, checkIn, checkOut, numPessoas, status, valor" });
    }
    if (!Object.values(TipoStatus).includes(status)) {
        return res.status(400).json({ erro: `Status inválido. Use: ${Object.values(TipoStatus).join(", ")}` });
    }

    try {
        const reserva = await criarReserva({ ...req.body, idUser: Number(idUser) });
        res.status(201).json(reserva);
    } catch (err: any) {
        if (err.code === "P2003") return res.status(400).json({ erro: "Usuário ou quarto inválido" });
        res.status(500).json({ erro: "Erro ao criar reserva", detalhes: err.message });
    }
});

// PATCH /reservas/:idUser/:dataReserva  — body: { status }
router.patch("/:idUser/:dataReserva", async (req: Request, res: Response) => {
    const idUser = Number(req.params.idUser);
    const dataReserva = parseData(req.params.dataReserva);
    if (isNaN(idUser) || !dataReserva) return res.status(400).json({ erro: "Parâmetros inválidos" });

    const { status } = req.body;
    if (!status || !Object.values(TipoStatus).includes(status)) {
        return res.status(400).json({ erro: `Status inválido. Use: ${Object.values(TipoStatus).join(", ")}` });
    }

    try {
        const reserva = await atualizarStatus(idUser, dataReserva, status);
        res.json(reserva);
    } catch (err: any) {
        if (err.code === "P2025") return res.status(404).json({ erro: "Reserva não encontrada" });
        res.status(500).json({ erro: "Erro ao atualizar status", detalhes: err.message });
    }
});

// DELETE /reservas/:idUser/:dataReserva
router.delete("/:idUser/:dataReserva", async (req: Request, res: Response) => {
    const idUser = Number(req.params.idUser);
    const dataReserva = parseData(req.params.dataReserva);
    if (isNaN(idUser) || !dataReserva) return res.status(400).json({ erro: "Parâmetros inválidos" });

    try {
        await deletarReserva(idUser, dataReserva);
        res.status(204).end();
    } catch (err: any) {
        if (err.code === "P2025") return res.status(404).json({ erro: "Reserva não encontrada" });
        if (err.code === "P2003") return res.status(409).json({ erro: "Reserva possui feedback ou acompanhantes vinculados" });
        res.status(500).json({ erro: "Erro ao deletar reserva", detalhes: err.message });
    }
});

export default router;
