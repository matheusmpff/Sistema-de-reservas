import { Router } from "express";
import type { Request, Response } from "express";
import { Auth } from "../middlewares/Auth.js";
import { listarPessoas, buscarPessoa, criarAdulto, criarCrianca, deletarPessoa } from "../services/Pessoa.js";

const router = Router();
router.use(Auth.private);

// GET /pessoas
router.get("/", async (_req: Request, res: Response) => {
    try {
        res.json(await listarPessoas());
    } catch (err: any) {
        res.status(500).json({ erro: "Erro ao listar hóspedes" });
    }
});

// GET /pessoas/:id
router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    try {
        const pessoa = await buscarPessoa(id);
        if (!pessoa) return res.status(404).json({ erro: "Hóspede não encontrado" });
        res.json(pessoa);
    } catch (err: any) {
        res.status(500).json({ erro: "Erro ao buscar hóspede" });
    }
});

// POST /pessoas  — body: { tipo: "adulto"|"crianca", nome, dataNasc, sexo, ...campos do tipo }
router.post("/", async (req: Request, res: Response) => {
    const { tipo, nome, dataNasc, sexo } = req.body;

    if (!tipo || !nome || !dataNasc || !sexo) {
        return res.status(400).json({ erro: "Campos obrigatórios: tipo, nome, dataNasc, sexo" });
    }

    try {
        if (tipo === "adulto") {
            const { email, telefone } = req.body;
            if (!email || !telefone) {
                return res.status(400).json({ erro: "Adulto precisa de email e telefone" });
            }
            const pessoa = await criarAdulto({ nome, dataNasc, sexo, email, telefone });
            return res.status(201).json(pessoa);
        }

        if (tipo === "crianca") {
            const { idResp } = req.body;
            if (!idResp) {
                return res.status(400).json({ erro: "Criança precisa do id do responsável (idResp)" });
            }
            const pessoa = await criarCrianca({ nome, dataNasc, sexo, idResp: Number(idResp) });
            return res.status(201).json(pessoa);
        }

        return res.status(400).json({ erro: 'tipo deve ser "adulto" ou "crianca"' });

    } catch (err: any) {
        if (err.code === "P2002") return res.status(409).json({ erro: "Email já cadastrado" });
        if (err.code === "P2003") return res.status(400).json({ erro: "Responsável não encontrado" });
        res.status(500).json({ erro: "Erro ao cadastrar hóspede", detalhes: err.message });
    }
});

// DELETE /pessoas/:id
router.delete("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

    try {
        await deletarPessoa(id);
        res.status(204).end();
    } catch (err: any) {
        if (err.code === "P2025") return res.status(404).json({ erro: "Hóspede não encontrado" });
        if (err.code === "P2003") return res.status(409).json({ erro: "Hóspede possui reservas ou dependentes vinculados" });
        res.status(500).json({ erro: "Erro ao deletar hóspede", detalhes: err.message });
    }
});

export default router;
