import { prisma } from "../libs/prisma.js";
import { QuartoStatus, QuartoTipo } from "../generated/prisma/client.js";

export { QuartoStatus, QuartoTipo };

export const listarQuartos = async () => {
    return prisma.quarto.findMany({ orderBy: { numero: "asc" } });
};

export const criarQuarto = async (data: {
    numero: number;
    tipo: QuartoTipo;
    capacidade: number;
    status: QuartoStatus;
}) => {
    return prisma.quarto.create({ data });
};

export const setQuartoStatus = async (numero: number, status: QuartoStatus) => {
    const dadosAtualizacao: any = { status };

    if (status === "DISPONIVEL") {
        dadosAtualizacao.reservaUser = null;
        dadosAtualizacao.reservaData = null;
    }

    return prisma.quarto.update({ where: { numero }, data: dadosAtualizacao });
};

export const deletarQuarto = async (numero: number) => {
    return prisma.quarto.delete({ where: { numero } });
};