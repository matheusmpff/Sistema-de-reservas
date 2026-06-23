import { prisma } from "../libs/prisma.js";

const include = {
    reserva: {
        include: {
            user: { include: { adulto: { include: { pessoa: true } } } }
        }
    }
} as const;

export const listarFeedbacks = async () => {
    return prisma.feedbackUser.findMany({ include, orderBy: { createdAt: "desc" } });
};

export const criarFeedback = async (dados: {
    reservaUser: number;
    reservaData: string | Date;
    nota: number;
    comentario: string;
    fotos?: string[];
}) => {
    if (dados.nota < 1 || dados.nota > 5) throw new Error("Nota deve ser entre 1 e 5");

    return prisma.feedbackUser.create({
        data: {
            reservaUser: dados.reservaUser,
            reservaData: new Date(dados.reservaData),
            nota: dados.nota,
            comentario: dados.comentario,
            fotos: dados.fotos ?? []
        },
        include
    });
};

export const deletarFeedback = async (reservaUser: number, reservaData: Date) => {
    return prisma.feedbackUser.delete({
        where: { reservaUser_reservaData: { reservaUser, reservaData } }
    });
};
