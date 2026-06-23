import { Router } from "express";
import type { Request, Response } from "express";
import { Auth } from "../middlewares/Auth.js";
import { listarFeedbacks, criarFeedback, deletarFeedback } from "../services/Feedback.js";

const router = Router();
router.use(Auth.private);

function parseData(raw: string): Date | null {
    const d = new Date(decodeURIComponent(raw));
    return isNaN(d.getTime()) ? null : d;
}

// GET /feedbacks
router.get("/", async (_req: Request, res: Response) => {
    try {
        res.json(await listarFeedbacks());
    } catch (err: any) {
        res.status(500).json({ erro: "Erro ao listar feedbacks" });
    }
});

// POST /feedbacks — body: { reservaUser, reservaData, nota, comentario, fotos? }
router.post("/", async (req: Request, res: Response) => {
    const { reservaUser, reservaData, nota, comentario } = req.body;

    if (!reservaUser || !reservaData || !nota || !comentario) {
        return res.status(400).json({ erro: "Campos obrigatórios: reservaUser, reservaData, nota, comentario" });
    }

    try {
        const fb = await criarFeedback({
            reservaUser: Number(reservaUser),
            reservaData,
            nota: Number(nota),
            comentario,
            fotos: req.body.fotos
        });
        res.status(201).json(fb);
    } catch (err: any) {
        if (err.message === "Nota deve ser entre 1 e 5") return res.status(400).json({ erro: err.message });
        if (err.code === "P2002") return res.status(409).json({ erro: "Essa reserva já tem feedback" });
        if (err.code === "P2003") return res.status(400).json({ erro: "Reserva não encontrada" });
        res.status(500).json({ erro: "Erro ao salvar feedback", detalhes: err.message });
    }
});

// DELETE /feedbacks/:reservaUser/:reservaData
router.delete("/:reservaUser/:reservaData", async (req: Request, res: Response) => {
    const reservaUser = Number(req.params.reservaUser);
    const reservaData = parseData(req.params.reservaData);
    if (isNaN(reservaUser) || !reservaData) return res.status(400).json({ erro: "Parâmetros inválidos" });

    try {
        await deletarFeedback(reservaUser, reservaData);
        res.status(204).end();
    } catch (err: any) {
        if (err.code === "P2025") return res.status(404).json({ erro: "Feedback não encontrado" });
        res.status(500).json({ erro: "Erro ao deletar feedback", detalhes: err.message });
    }
});

export default router;
