import { prisma } from "../libs/prisma.js";
import type { QuartoStatus } from "../generated/prisma/enums.js";

export const listarReservas() = async () => {
    return prisma.reserva.findMany({
        include: {
            user: {
                include: {
                    adulto: {
                        include : {
                            pessoa: true,
                        }
                    }
                }
            },
            reservaQuartos: {
                include: {
                    Quartos: true,
                }
            }
        }
    });
};

export const criarReservas() = async () => {};

export const alterarQuarto();

export const alterarDataReserva();

export const alterarStatusPagamentoReserva();

export const alterarValorReserva();

export const alterarStatusQuarto();

export const alterarHospedeDados(); // Documento cadastrado errado, telefone, etc...

export const alterarHospedeStatus();  // Hospedado, check-in, check-out, etc...

export const alterarHospedeTipo();  // Adulto ou criança

export const listarFeedbacks() = async () => {
    return prisma.fee
}