import { prisma } from "../libs/prisma.js";
import type { LoginInput, SignupInput } from "../types.js";
import { Prisma } from "../generated/prisma/client.js";
import bcrypt from "bcryptjs";

export const createUser = async (props: SignupInput) => {

    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(props.senha, salt)

    const adult = await prisma.adulto.findUnique({
        where: {
            email: props.email
        },
        include: {
            user: true,
            pessoa: true
        }
    });

    if (!adult) {
        const user = await prisma.pessoa.create({
            data: {
                nome: props.nome,
                dataNasc: new Date(props.dataNasc),
                sexo: props.sexo,
                adulto: {
                    create: {
                        email: props.email,
                        telefone: props.telefone,
                        user: {
                            create: {
                                senha: hash
                            }
                        }
                    }
                }
            }
        });
        if (!user) {
            console.log("Erro ao criar tupla Pessoa.");
            return false;
        }
        return true;
    }

    if (!adult.user) {
        await prisma.user.create({
            data: {
                senha: hash,
                idAdulto: adult.idPessoa,
            },
        })
        return true;
    }

    return false;
}

export const loginUser = async (props: LoginInput) => {
    const adult = await prisma.adulto.findUnique({
        where: {
            email: props.email
        },
        include: {
            pessoa: true,
            user: true,
        }
    });

    if (!adult?.user?.senha) {
        return null;
    }

    if (bcrypt.compareSync(props.senha, adult?.user?.senha)) {
        return [adult.idPessoa, adult.user.admin]
    }

    return null;
}

export const userData = async (email: string) => {
    const user = await prisma.adulto.findUnique({
        where: {
            email: email
        },
        select: {
            email: true,
            pessoa: {
                select:{
                    nome:true,
                    dataNasc: true
                }
            },
        }
    })

    return user;
}

export const userBooking = async (email: string) => {
    //Procura por um adulto que tenha o email indicado
    const adulto = await prisma.adulto.findUnique({
        where: {
            email
        },
        include: {
            user: true,
            pessoa: true
        }
    })
    if (!adulto || !adulto.user || !adulto.pessoa) {
        return [];
    }
    // Procura reservas  com base se o checkin é maior que a data atual
    const reservas = await prisma.reserva.findMany({
        where: {
            idUser: adulto?.idPessoa,
            checkIn: {
                gte: new Date()
            }
        },
        select: {
            checkIn: true,
            checkOut: true,
            numPessoas: true,
            status: true
        }
    })
    return reservas;
}

type dataType = {
    email: string
    nome: string
    dataNasc: string
}

export const alterData = async (id:number,newData:dataType)=>{

    const adulto = await prisma.adulto.findUnique({
        where: {
            email: newData.email,
        },
        select:{
            idPessoa:true,
        }
    })

    if(adulto != null && adulto.idPessoa != id){
        return false;
    }

    await prisma.pessoa.update({
        where:{
            id
        },
        data:{
            nome: newData.nome,
            dataNasc: new Date(newData.dataNasc),
            adulto:{ 
                update:{
                    email: newData.email
                }
            }
        }
    })

    return true;
}

export const deleteAccount = async (id:number)=>{
    try{
        const result = await prisma.pessoa.delete({
            where:{
                id,
            }
        })
        console.log("Deu certo a operação")
        return true
    }
    catch(err){
        console.log(err)
        return false;
    }

}

export const feedback = async (email: string, comentario: string, fotos: string[], checkIn: Date, checkOut: Date, nota: number) => {
    // Procura por um adulto com o email
    const adulto = await prisma.adulto.findUnique({
        where: {
            email
        },
        include: {
            pessoa: true,
            user: true
        }
    })

    if (!adulto) {
        return false;
    }

    if (adulto.user) {// logica se o adulto foi o usuário que fez a reserva
        const reservas = await prisma.reserva.findMany({
            where: {
                idUser: adulto.user.idAdulto,
                checkIn,
                checkOut
            },
            include: {
                feedbackUser: true
            }
        })
        if (reservas.length != 0) {
            for (let reserva of reservas) {
                // Se ja tem feedback retorna
                if (reserva.feedbackUser) {
                    return false;
                }
                //Cria o feedback do usuário
                let feedback: Prisma.FeedbackUserCreateInput = {
                    comentario,
                    fotos,
                    reserva: {
                        connect: {
                            idUser_dataReserva: {
                                idUser: reserva.idUser,
                                dataReserva: reserva.dataReserva
                            }
                        }
                    },
                    nota,
                }
                await prisma.feedbackUser.create({ data: feedback })
            }
            return true;
        }

    }
    // Caso ele não seja usuário verificar se é acompanhante
    const acompanhantes = await prisma.acompanhante.findMany({
        where: {
            pessoa: adulto.pessoa
        },
        include: {
            reserva: true,
            feedback: true
        }
    })
    // Se não for acompanhante retorna
    if (acompanhantes.length == 0) {
        return false;
    }

    let flag = 0;
    for (const acompanhante of acompanhantes) {
        if (acompanhante.reserva.checkIn.getTime() === checkIn.getTime() && acompanhante.reserva.checkOut.getTime() === checkOut.getTime()) {
            flag = 1;
            if (acompanhante.feedback) {
                return false;
            }
            // Cria feedback do acompanhante
            let feedback: Prisma.FeedbackAcompanhanteCreateInput = {
                comentario,
                fotos,
                acompanhante: {
                    connect: {
                        reservaUser_reservaData_idPessoa: {
                            reservaUser: acompanhante.reservaUser,
                            reservaData: acompanhante.reservaData,
                            idPessoa: acompanhante.idPessoa
                        }
                    },
                },
                nota,
            }
            await prisma.feedbackAcompanhante.create({ data: feedback })
        }
    }

    // Se não encontrou reserva que foi acompanhante
    if (flag == 0) {
        return false;
    }
    return true;

}
