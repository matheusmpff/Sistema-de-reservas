import { Router } from "express";
import type { Request, Response} from "express";
import { listarQuartos, criarQuarto, setQuartoStatus, deletarQuarto, QuartoStatus, QuartoTipo } from "../services/QuartosAdmin.js";
import { Auth } from "../middlewares/Auth.js";

const router = Router();
router.use(Auth.private);

// GET /quartos — lista todos os quartos
router.get("/", async (_req: Request, res: Response) => {
    try {
        res.json(await listarQuartos());
    } catch (error: any) {
        res.status(500).json({ erro: "Erro ao buscar quartos" });
    }
});

// POST /quartos — cria um novo quarto
router.post("/", async (req: Request, res: Response) => {
    const { numero, tipo, capacidade, status } = req.body;

    const tiposValidos = Object.values(QuartoTipo);
    const statusValidos = Object.values(QuartoStatus);

    if (!numero || !tipo || !capacidade || !status) {
        return res.status(400).json({ erro: "Campos obrigatórios: numero, tipo, capacidade, status" });
    }
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({ erro: `Tipo inválido. Use: ${tiposValidos.join(", ")}` });
    }
    if (!statusValidos.includes(status)) {
        return res.status(400).json({ erro: `Status inválido. Use: ${statusValidos.join(", ")}` });
    }

    try {
        const quarto = await criarQuarto({ numero: Number(numero), tipo, capacidade: Number(capacidade), status });
        res.status(201).json(quarto);
    } catch (error: any) {
        if (error.code === "P2002") return res.status(409).json({ erro: "Já existe um quarto com esse número" });
        res.status(500).json({ erro: "Erro ao criar quarto", detalhes: error.message });
    }
});

// PATCH /quartos/:numero/status — muda só o status do quarto
router.patch("/:numero/status", async (req: Request, res: Response) => {
    const numero = Number(req.params.numero);
    const { status } = req.body;

    const statusValidos = Object.values(QuartoStatus);
    if (!statusValidos.includes(status)) {
        return res.status(400).json({ erro: `Status inválido. Use: ${statusValidos.join(", ")}` });
    }

    try {
        const quarto = await setQuartoStatus(numero, status as QuartoStatus);
        res.json({ mensagem: `Status do quarto ${numero} atualizado!`, quarto });
    } catch (error: any) {
        if (error.code === "P2025") return res.status(404).json({ erro: "Quarto não encontrado" });
        res.status(500).json({ erro: "Erro ao atualizar status", detalhes: error.message });
    }
});

// DELETE /quartos/:numero — remove o quarto
router.delete("/:numero", async (req: Request, res: Response) => {
    const numero = Number(req.params.numero);

    try {
        await deletarQuarto(numero);
        res.status(204).end();
    } catch (error: any) {
        if (error.code === "P2025") return res.status(404).json({ erro: "Quarto não encontrado" });
        if (error.code === "P2003") return res.status(409).json({ erro: "Quarto possui reservas vinculadas" });
        res.status(500).json({ erro: "Erro ao deletar quarto", detalhes: error.message });
    }
});

export default router;