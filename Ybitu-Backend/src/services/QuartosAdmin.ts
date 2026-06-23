import { prisma } from "../libs/prisma.js";
import type { QuartoStatus } from "../generated/prisma/enums.js";

export const listarQuartos = async () => {
    return prisma.quarto.findMany();
}

export const setQuartoStatus = async (numero: number, status: QuartoStatus) => {
    // Montamos o objeto de atualização básico
    const dadosAtualizacao: any = { status };

    // Se o novo status for DISPONIVEL, limpamos as informações de reservas antigas
    if (status === "DISPONIVEL") {
        dadosAtualizacao.reservaUser = null;
        dadosAtualizacao.reservaData = null;
    }

    return prisma.quarto.update({
        where: {
            numero: numero
        },
        data: dadosAtualizacao
    });
}