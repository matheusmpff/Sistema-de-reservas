import { prisma } from "../libs/prisma.js";
import type { QuartoStatus, QuartoTipo, TipoStatus } from "../generated/prisma/enums.js";
import type { Prisma } from "../generated/prisma/client.js";
import { includes } from "zod";

const verificaConflito = async (
    tx: Prisma.TransactionClient,
    numeroQuarto: number,
    checkIn: Date,
    checkOut: Date,
    ignorarIdUser?: number,
    ignorarDataReserva?: Date
) => {
    return tx.reserva.findFirst({
        where: {
            reservaQuartos: {
                Quartos: { some: { numero: numeroQuarto } }
            },
            checkIn: { lt: checkOut },
            checkOut: { gt: checkIn },
            status: { notIn: ["CANCELADO", "OUT"] },
            ...(ignorarIdUser && ignorarDataReserva && {
                NOT: {
                    idUser: ignorarIdUser,
                    dataReserva: ignorarDataReserva,
                }
            })
        }
    });
};

export const listarReservas = async () => {
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

export const criarReservas = async (idUser: number, checkIn: Date, checkOut: Date, numPessoas: number, valor: number, numeroQuarto: number) => {
    return prisma.$transaction(async (tx) => {

        const conflito = await verificaConflito(tx, numeroQuarto, checkIn, checkOut);

        if (conflito){
            throw new Error("Quarto solicitado indisponível na data selecionada.");
        }

        const reserva = await tx.reserva.create({
            data: {
                idUser,
                dataReserva: new Date(),
                checkIn,
                checkOut,
                numPessoas,
                valor,
                status: "EM_ANALISE"
            }
        });

        await tx.reservaQuartos.create({
            data: {
                reservaUser: reserva.idUser,
                reservaData: reserva.dataReserva,
                custo_frigobar: 0,
                multa: 0,
                Quartos: {
                    connect: { numero: numeroQuarto }
                }
            }
        });

        return reserva;
    })
};

export const alterarQuarto = async (idUser: number, dataReserva: Date, numeroNovoQuarto: number) => {
    return prisma.$transaction(async (tx) => {

        const reservaAtual = await tx.reserva.findUnique({
            where: {
                idUser_dataReserva: {idUser, dataReserva}
            }
        })

        if (!reservaAtual){
            throw new Error("Reserva não encontrada");
        }

        const conflito = await verificaConflito(tx, numeroNovoQuarto, reservaAtual?.checkIn, reservaAtual?.checkOut);

        if (conflito){
            throw new Error("Quarto solicitado indisponível na data selecionada.")
        }

        const reservaQuartos = await tx.reservaQuartos.findUnique({
            where: {
                reservaUser_reservaData: {reservaUser: idUser, reservaData: dataReserva}
            },
            include: {Quartos: true}
        });

        if (!reservaQuartos || reservaQuartos.Quartos.length === 0) {
            throw new Error("Reserva não possui quarto vinculado");
        }

        const quartoAntigo = reservaQuartos.Quartos[0]?.numero as number;

        await tx.quarto.update({
            where: { numero: quartoAntigo },
            data: { status: "DISPONIVEL"}
        });

        await tx.reservaQuartos.update({
            where: {
                reservaUser_reservaData: { reservaUser: idUser, reservaData: dataReserva }
            },
            data: {
                Quartos: {
                    disconnect: { numero: quartoAntigo},
                    connect: { numero: numeroNovoQuarto }
                }
            }
        });

        // Marca o novo quarto como ocupado
        await tx.quarto.update({
            where: { numero: numeroNovoQuarto },
            data: { status: "OCUPADO" }
        });
    })
};

export const alterarDataReserva = async(idUser: number, dataReserva: Date, novoCheckIn: Date, novoCheckOut: Date) => {
    return prisma.$transaction(async(tx) => {

        const reservaAtual = await tx.reserva.findUnique({
            where: {
                idUser_dataReserva: {idUser: idUser, dataReserva: dataReserva},
            },
        })

        if (!reservaAtual) throw new Error("Reserva não encontrada");

        const reservaQuarto = await tx.reservaQuartos.findUnique({
            where: {
                reservaUser_reservaData: {reservaUser: idUser, reservaData: dataReserva},
            },
            include:{Quartos: true}
        })

        if (!reservaQuarto || reservaQuarto.Quartos.length === 0) throw new Error("Reserva sem nenhum quarto associado");

        let quarto = reservaQuarto.Quartos[0]?.numero as number;

        const conflito = await verificaConflito(tx, quarto, novoCheckIn, novoCheckOut);

        if (conflito) {

            const tipoQuarto = reservaQuarto.Quartos[0]?.tipo as QuartoTipo;

            const quartosDoMesmoTipo = await tx.quarto.findMany({
                where: {tipo: tipoQuarto}
            });

            let quartoNovo = null;
            for (const q of quartosDoMesmoTipo){
                const conflitoNovo = await verificaConflito(tx, q.numero, novoCheckIn, novoCheckOut);
                if (!conflitoNovo) {
                    quartoNovo  = q;
                    break;
                }
            }

            if (!quartoNovo) throw new Error("Nenhum quarto do mesmo tipo disponível na data selecionada")

            quarto = quartoNovo.numero;

            await tx.quarto.update({
                where: {numero: reservaQuarto.Quartos[0]?.numero as number},
                data: {status: "DISPONIVEL"},
            })

            await tx.reservaQuartos.update({
                where: {
                    reservaUser_reservaData: {reservaUser: idUser, reservaData: dataReserva}
                },
                data: {
                    Quartos: {
                        disconnect: {numero: reservaQuarto.Quartos[0]?.numero as number},
                        connect: {numero: quarto},
                    }
                }
            });

            await tx.quarto.update({
                where: {numero: quarto},
                data: {status: "OCUPADO"},
            });

        }

        await tx.reserva.update({
            where:{
                idUser_dataReserva: {idUser: idUser, dataReserva: dataReserva},
            },
            data: {
                checkIn: novoCheckIn,
                checkOut: novoCheckOut,
            }
        });
    })
}

export const alterarStatusPagamentoReserva = async (idUser: number, dataReserva: Date, novoStatus: TipoStatus) => {
    return prisma.$transaction(async (tx) => {

        const reserva = await tx.reserva.findUnique({
            where: { idUser_dataReserva: { idUser, dataReserva } },
            include: {
                reservaQuartos: { include: { Quartos: true } }
            }
        });

        if (!reserva) throw new Error("Reserva não encontrada");

        const numeroQuarto = reserva.reservaQuartos?.Quartos?.[0]?.numero;

        const atualizada = await tx.reserva.update({
            where: { idUser_dataReserva: { idUser, dataReserva } },
            data: { status: novoStatus }
        });

        if (numeroQuarto) {
            if (novoStatus === "IN") {
                await tx.quarto.update({
                    where: { numero: numeroQuarto },
                    data: { status: "OCUPADO" }
                });
            } else if (novoStatus === "OUT" || novoStatus === "CANCELADO") {
                await tx.quarto.update({
                    where: { numero: numeroQuarto },
                    data: { status: "DISPONIVEL" }
                });
            }
        }

        return atualizada;
    });
};

export const alterarValorReserva = async (idUser: number, dataReserva: Date, valorAdicionado: number) => {
    return prisma.$transaction(async (tx) => {

        const reservaAtual = await tx.reserva.findUnique({
            where: {
                idUser_dataReserva: {
                    idUser: idUser,
                    dataReserva: dataReserva,
                }
            }
        })

        if (!reservaAtual) throw new Error("Reserva não encontrada");

        let valorAtual = reservaAtual.valor;
        valorAtual += valorAdicionado;

        await tx.reserva.update({
            where: {
                idUser_dataReserva: {
                    idUser: idUser,
                    dataReserva: dataReserva,
                }
            },
            data: {valor: valorAtual},
        });
        
    });
}

export const alterarStatusQuarto = async (numeroQuarto: number, novoStatus: QuartoStatus) => {
    return prisma.quarto.update({
        where: {numero: numeroQuarto},
        data: {status: novoStatus}
    });
}

// Documento cadastrado errado, telefone, etc...
export const alterarHospedeDados = async (
    idPessoa: number, 
    dados: {
        telefone?: string;
        email?: string;
        dataNasc?: Date;
        nome?: string;
        sexo?: string;
    }
) => {
    return prisma.$transaction(async(tx) => {

        const pessoa = tx.pessoa.findUnique({
            where: {id: idPessoa}
        });

        if (!pessoa) throw new Error("Hóspede não encontrado.");

        if (dados.dataNasc || dados.nome || dados.sexo){
            await tx.pessoa.update({
                where: {id: idPessoa},
                data: {
                    ...(dados.nome && {nome: dados.nome}),
                    ...(dados.dataNasc && {dataNasc: dados.dataNasc}),
                    ...(dados.sexo && {sexo: dados.sexo}),
                }
            });
        }

        if (dados.telefone || dados.email) {
            await tx.adulto.update({
                where: { idPessoa },
                data: {
                    ...(dados.telefone && { telefone: dados.telefone }),
                    ...(dados.email && { email: dados.email }),
                }
            })
        }


    })
}; 


// criança -> adulto
export const alterarHospedeTipo = async (idPessoa: number, email: string, telefone: string) => {
    return prisma.$transaction(async(tx) => {

        const crianca = await tx.crianca.findUnique({
            where: {idPessoa}
        });

        if (!crianca) throw new Error("Hóspede é maior de idade.");

        await tx.crianca.delete({
            where: {idPessoa}
        });

        await tx.adulto.create({
            data: {
                idPessoa,
                email,
                telefone,
            }
        });

    })

};

export const listarFeedbacks = async () => {
    return prisma.feedbackUser.findMany({
        include: {
            reserva: {
                include: {
                    user: {
                        include: {
                            adulto: {
                                include: {
                                    pessoa: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
};

export const listarQuartos = async () => {
    return prisma.quarto.findMany();
}

export const listarHospedes = async () => {
    return prisma.pessoa.findMany({
        include: {
            adulto: true,
            crianca: {
                include: {
                    responsavel: {
                        include: {
                            pessoa: true,
                        }
                    }
                }
            }
        }
    })
}