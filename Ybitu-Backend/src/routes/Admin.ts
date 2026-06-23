import { Router } from "express";
import type { Request, Response} from "express";
import { listarQuartos, setQuartoStatus } from "../services/Admin.js";
import type { QuartoStatus } from "../generated/prisma/enums.js";


const router = Router();

router.get("/", async (_req: Request, res: Response) => {
    try{
        const quartos = await listarQuartos();
        res.json(quartos);
    } catch (error: any) {
        res.status(500).json({erro: "Erro ao buscar quartos"});
    }
})

router.patch("/:numero/status", async (req: Request, res: Response) => {
    const { numero } = req.params;
    const { status } = req.body; // Espera receber {"status": "MANUTENCAO"} por exemplo

    try {
        // Validação rápida em memória para evitar requisições inúteis ao banco
        const statusValidos: QuartoStatus[] = ["DISPONIVEL", "OCUPADO", "MANUTENCAO"];

        if (!statusValidos.includes(status)) {
            return res.status(400).json({
                erro: "Status inválido. Use DISPONIVEL, OCUPADO ou MANUTENCAO."
            });
        }

        // Executa o serviço passando o número e o status tipado
        const quartoAtualizado = await setQuartoStatus(Number(numero), status as QuartoStatus);

        res.json({
            mensagem: `Status do quarto ${numero} atualizado com sucesso!`,
            quarto: quartoAtualizado
        });
    } catch (error: any) {
        res.status(400).json({
            erro: "Erro ao atualizar o status do quarto.",
            detalhes: error.message
        });
    }
});



export default router;