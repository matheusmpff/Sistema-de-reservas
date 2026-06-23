import { prisma } from "../libs/prisma.js";
import { TipoStatus } from "../generated/prisma/client.js";

export { TipoStatus };

// include padrão: traz nome do user + quartos vinculados
const include = {
    user: {
        include: {
            adulto: { include: { pessoa: true } }
        }
    },
    reservaQuartos: { include: { Quartos: true } },
    acompanhante: { include: { pessoa: true } },
    feedbackUser: true
} as const;

export const listarReservas = async () => {
    return prisma.reserva.findMany({ include, orderBy: { dataReserva: "desc" } });
};

export const buscarReserva = async (idUser: number, dataReserva: Date) => {
    return prisma.reserva.findUnique({
        where: { idUser_dataReserva: { idUser, dataReserva } },
        include
    });
};

export type ReservaInput = {
    idUser: number;
    checkIn: string | Date;
    checkOut: string | Date;
    numPessoas: number;
    status: TipoStatus;
    valor: number;
    quartoNumeros?: number[];
};

export const criarReserva = async (dados: ReservaInput) => {
    const dataReserva = new Date();

    return prisma.$transaction(async (tx) => {
        const reserva = await tx.reserva.create({
            data: {
                idUser: dados.idUser,
                dataReserva,
                checkIn: new Date(dados.checkIn),
                checkOut: new Date(dados.checkOut),
                numPessoas: dados.numPessoas,
                status: dados.status,
                valor: dados.valor,
            }
        });

        // Se vieram quartos, cria o ReservaQuartos e vincula os quartos
        if (dados.quartoNumeros && dados.quartoNumeros.length > 0) {
            await tx.reservaQuartos.create({
                data: { reservaUser: dados.idUser, reservaData: dataReserva, custo_frigobar: 0, multa: 0 }
            });
            await tx.quarto.updateMany({
                where: { numero: { in: dados.quartoNumeros } },
                data: { reservaUser: dados.idUser, reservaData: dataReserva, status: "OCUPADO" }
            });
        }

        return tx.reserva.findUnique({
            where: { idUser_dataReserva: { idUser: dados.idUser, dataReserva } },
            include
        });
    });
};

export const atualizarStatus = async (idUser: number, dataReserva: Date, status: TipoStatus) => {
    return prisma.$transaction(async (tx) => {
        await tx.reserva.update({
            where: { idUser_dataReserva: { idUser, dataReserva } },
            data: { status }
        });

        // Atualiza status dos quartos vinculados conforme o evento
        if (status === "IN") {
            await tx.quarto.updateMany({
                where: { reservaUser: idUser, reservaData: dataReserva },
                data: { status: "OCUPADO" }
            });
        } else if (status === "OUT" || status === "CANCELADO") {
            await tx.quarto.updateMany({
                where: { reservaUser: idUser, reservaData: dataReserva },
                data: { status: "DISPONIVEL", reservaUser: null, reservaData: null }
            });
        }

        return tx.reserva.findUnique({
            where: { idUser_dataReserva: { idUser, dataReserva } },
            include
        });
    });
};

export const deletarReserva = async (idUser: number, dataReserva: Date) => {
    return prisma.reserva.delete({
        where: { idUser_dataReserva: { idUser, dataReserva } }
    });
};
