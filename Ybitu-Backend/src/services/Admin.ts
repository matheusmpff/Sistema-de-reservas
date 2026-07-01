import { prisma } from "../libs/prisma.js";
import type { QuartoStatus, QuartoTipo, TipoStatus } from "../generated/prisma/enums.js";
import type { Prisma } from "../generated/prisma/client.js";

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
                some: { numeroQuarto: numeroQuarto } // Correção no filtro de relacionamento 1-N
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
                    Quarto: true,
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
                numeroQuarto: numeroQuarto, // Passando o ID do quarto diretamente
                custo_frigobar: 0,
                multa: 0,
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

        const conflito = await verificaConflito(tx, numeroNovoQuarto, reservaAtual.checkIn, reservaAtual.checkOut);

        if (conflito){
            throw new Error("Quarto solicitado indisponível na data selecionada.")
        }

        // Alterado de findUnique para findFirst devido à chave composta incompleta
        const reservaQuartos = await tx.reservaQuartos.findFirst({
            where: {
                reservaUser: idUser,
                reservaData: dataReserva
            }
        });

        if (!reservaQuartos) {
            throw new Error("Reserva não possui quarto vinculado");
        }

        const quartoAntigo = reservaQuartos.numeroQuarto;

        await tx.quarto.update({
            where: { numero: quartoAntigo },
            data: { status: "DISPONIVEL"}
        });

        // Como numeroQuarto faz parte da chave PK composta, precisamos passar todos os 3 campos no where para atualizar
        await tx.reservaQuartos.update({
            where: {
                reservaUser_reservaData_numeroQuarto: { 
                    reservaUser: idUser, 
                    reservaData: dataReserva, 
                    numeroQuarto: quartoAntigo 
                }
            },
            data: {
                numeroQuarto: numeroNovoQuarto
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
                idUser_dataReserva: {idUser, dataReserva},
            },
        })

        if (!reservaAtual) throw new Error("Reserva não encontrada");

        // Alterado para findFirst e corrigido o include (Quarto no singular)
        const reservaQuarto = await tx.reservaQuartos.findFirst({
            where: {
                reservaUser: idUser,
                reservaData: dataReserva,
            },
            include:{ Quarto: true }
        })

        if (!reservaQuarto) throw new Error("Reserva sem nenhum quarto associado");

        let quarto = reservaQuarto.numeroQuarto;

        // Passamos os dados atuais para ignorar conflito com ela mesma caso as datas se sobreponham
        const conflito = await verificaConflito(tx, quarto, novoCheckIn, novoCheckOut, idUser, dataReserva);

        if (conflito) {
            const tipoQuarto = reservaQuarto.Quarto.tipo;

            const quartosDoMesmoTipo = await tx.quarto.findMany({
                where: { tipo: tipoQuarto }
            });

            let quartoNovo = null;
            for (const q of quartosDoMesmoTipo){
                const conflitoNovo = await verificaConflito(tx, q.numero, novoCheckIn, novoCheckOut, idUser, dataReserva);
                if (!conflitoNovo) {
                    quartoNovo = q;
                    break;
                }
            }

            if (!quartoNovo) throw new Error("Nenhum quarto do mesmo tipo disponível na data selecionada")

            const quartoAntigo = quarto;
            quarto = quartoNovo.numero;

            await tx.quarto.update({
                where: { numero: quartoAntigo },
                data: { status: "DISPONIVEL" },
            })

            await tx.reservaQuartos.update({
                where: {
                    reservaUser_reservaData_numeroQuarto: {
                        reservaUser: idUser,
                        reservaData: dataReserva,
                        numeroQuarto: quartoAntigo
                    }
                },
                data: {
                    numeroQuarto: quarto
                }
            });

            await tx.quarto.update({
                where: { numero: quarto },
                data: { status: "OCUPADO" },
            });
        }

        await tx.reserva.update({
            where:{
                idUser_dataReserva: { idUser, dataReserva },
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
                reservaQuartos: true // reservaQuartos é uma lista mapeada no model Reserva
            }
        });

        if (!reserva) throw new Error("Reserva não encontrada");

        // Acessando o primeiro item do array de relações de forma segura
        const numeroQuarto = reserva.reservaQuartos?.[0]?.numeroQuarto;

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
                idUser_dataReserva: { idUser, dataReserva }
            }
        })

        if (!reservaAtual) throw new Error("Reserva não encontrada");

        let valorAtual = reservaAtual.valor;
        valorAtual += valorAdicionado;

        await tx.reserva.update({
            where: {
                idUser_dataReserva: { idUser, dataReserva }
            },
            data: { valor: valorAtual },
        });
        
    });
}

export const alterarStatusQuarto = async (numeroQuarto: number, novoStatus: QuartoStatus) => {
    return prisma.quarto.update({
        where: { numero: numeroQuarto },
        data: { status: novoStatus }
    });
}

export const alterarHospedeDados = async (
    idPessoa: number, 
    dados: {
        telefone?: string;
        email?: string;
        dataNasc?: Date | string;
        nome?: string;
        sexo?: string;
    }
) => {
    return prisma.$transaction(async(tx) => {

        const pessoa = await tx.pessoa.findUnique({
            where: { id: idPessoa }
        });

        if (!pessoa) throw new Error("Hóspede não encontrado.");

        if (dados.dataNasc || dados.nome || dados.sexo){
            await tx.pessoa.update({
                where: { id: idPessoa },
                data: {
                    ...(dados.nome && { nome: dados.nome }),
                    ...(dados.dataNasc && { dataNasc: new Date(dados.dataNasc) }),
                    ...(dados.sexo && { sexo: dados.sexo }),
                }
            });
        }

        if (dados.telefone || dados.email) {
            const adultoExiste = await tx.adulto.findUnique({ where: { idPessoa } });
            
            if (!adultoExiste) {
                throw new Error("Apenas hóspedes adultos possuem dados de e-mail e telefone.");
            }

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

export const alterarHospedeTipo = async (idPessoa: number, email: string, telefone: string) => {
    return prisma.$transaction(async(tx) => {

        const crianca = await tx.crianca.findUnique({
            where: { idPessoa }
        });

        if (!crianca) throw new Error("Hóspede é maior de idade.");

        await tx.crianca.delete({
            where: { idPessoa }
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