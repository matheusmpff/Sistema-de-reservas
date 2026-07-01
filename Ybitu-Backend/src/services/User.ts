import { prisma } from "../libs/prisma.js";
import { GuestType, rTypeTranslation, type BookingData, type GuestData, type LoginInput, type RoomType, type SignupInput } from "../types.js";
import { Prisma } from "../generated/prisma/client.js";
import bcrypt from "bcryptjs";
import { existsSync } from "node:fs";
import type { ReservaQuartosCreateManyReservaInput } from "../generated/prisma/models.js";

export const populateDB = async () => {
    if ((await prisma.quarto.findMany()).length == 0) {
        await prisma.quarto.createMany({
            data: [
                {
                    numero: 1,
                    status: "DISPONIVEL",
                    tipo: "DUPLO",
                    capacidade: 2,
                },
                {
                    numero: 2,
                    status: "DISPONIVEL",
                    tipo: "DUPLO",
                    capacidade: 2,
                },
                {
                    numero: 3,
                    status: "DISPONIVEL",
                    tipo: "DUPLO",
                    capacidade: 2,
                },
                {
                    numero: 4,
                    status: "DISPONIVEL",
                    tipo: "TRIPLO",
                    capacidade: 3,
                },
                {
                    numero: 5,
                    status: "DISPONIVEL",
                    tipo: "TRIPLO",
                    capacidade: 3,
                },
                {
                    numero: 6,
                    status: "DISPONIVEL",
                    tipo: "QUADRUPLO",
                    capacidade: 4,
                },
                {
                    numero: 7,
                    status: "DISPONIVEL",
                    tipo: "QUADRUPLO",
                    capacidade: 4,
                },
                {
                    numero: 8,
                    status: "DISPONIVEL",
                    tipo: "TRIPLO",
                    capacidade: 3,
                },
                {
                    numero: 9,
                    status: "DISPONIVEL",
                    tipo: "DUPLO",
                    capacidade: 2,
                },
            ]
        });
    }

    // create Admin user
    const user: SignupInput = {
        nome: "Muzza",
        dataNasc: new Date("2001-12-23"),
        senha: "adminadmin",
        sexo: "Feminino",
        email: "admin3@ybitu.com",
        telefone: "+55198587838"
    }
    await createUser(user);
    await prisma.user.updateMany({
        where: {
            adulto: {
                email: "admin3@ybitu.com",
            },
        },
        data: {
            admin: true,
        },
        limit: 1,
    });
}

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
        return [adult.idPessoa, adult.user.admin,adult.pessoa.nome]
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
            telefone:true,
            pessoa: {
                select:{
                    nome:true,
                    dataNasc: true,
                    sexo:true,

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

// return all rooms avalaible in a given date range
export const getAvailableRooms = async (date_in: Date, date_out: Date) => {
    const availableRooms = await prisma.quarto.findMany({
        select: {
            numero: true,
            tipo: true,
        },
        where: {
            ReservaQuartos: {
                none: {
                    reserva: {
                        checkIn: { lt: date_out },
                        checkOut: { gt: date_in },
                    }
                }
            }
        }
    });
    return availableRooms;
}

export const insertBooking = async (book: BookingData) => {
    const time = new Date();
    const numPessoas = 1 + book.otherGuests.length;

    if (book.user.email) {
        await prisma.adulto.findUnique({
            select: {
                idPessoa: true,
            },
            where: {
                email: book.user.email,
            }
        }).then((adult) => {
            if (adult) {
                book.user.id = adult.idPessoa.toString();
            }
            else {
                throw Error("Usuário cujo email não está cadastrado.");
            }
        })
    }
    for (let pessoa of book.otherGuests) {
        if (pessoa.guestType == GuestType.Adult && pessoa.email != undefined) {
            let id = await prisma.adulto.findUnique({
                select: {
                    idPessoa: true,
                },
                where: {
                    email: pessoa.email,
                }
            });
            // if he's not in the db, create him; else put in the id field
            if (!id) {
                const newAdult = await prisma.adulto.create({
                    data: {
                        email: pessoa.email,
                        telefone: pessoa.phoneNumber,
                        pessoa: {
                            create: {
                                nome: pessoa.name,
                                dataNasc: pessoa.birthDate,
                                sexo: pessoa.sex,
                            }
                        }
                    }
                })
                pessoa.id = newAdult.idPessoa.toString();
            }
            else {
                pessoa.id = id.idPessoa.toString();
            }
        }
        else if (pessoa.guestType == GuestType.Child && pessoa.parentName) {
            const id = await prisma.crianca.findFirst({
                select: {
                    idPessoa: true,
                },
                where: {
                    pessoa: {
                        nome: pessoa.name
                    },
                    responsavel: {
                        telefone: pessoa.phoneNumber
                    },
                }
            });
            if (!id) {
                const newChild = await prisma.crianca.create({
                    data: {
                        responsavel: {
                            connect: {
                                telefone: pessoa.phoneNumber
                            }
                        },
                        pessoa: {
                            create: {
                                nome: pessoa.name,
                                dataNasc: pessoa.birthDate,
                                sexo: pessoa.sex,
                            }
                        }
                    }
                })
                pessoa.id = newChild.idPessoa.toString();
            }
            else {
                pessoa.id = id.idPessoa.toString();
            }
        }
        else {
            throw Error("Acompanhante com tupla inválida no banco")
        }
    }

    const avail = await getAvailableRooms(book.date_in, book.date_out);
    let availableRooms = [] as ReservaQuartosCreateManyReservaInput[];
    for (const room of book.rooms) {
        let availType = avail.filter((r) => r.tipo == rTypeTranslation(room.roomType));
        if (availType.length < room.roomQuantity) {
            throw Error("Quantidade insuficiente de quartos disponiveis na data");
        }
        availableRooms = availableRooms.concat(availType.slice(0, room.roomQuantity).map((r) => {return {numeroQuarto: r.numero, custo_frigobar: 0, multa: 0}}))
    }


    await prisma.reserva.create({
        data: {
            dataReserva: time,
            checkIn: book.date_in,
            checkOut: book.date_out,
            numPessoas,
            status: "EM_ANALISE",
            valor: 0,
            acompanhante: {
                createMany: {
                    data: book.otherGuests.map((guest) => {
                        return {
                            idPessoa: Number(guest.id),
                        }
                    })
                }
            },
            idUser: Number(book.user.id),
            reservaQuartos: {
                createMany: {
                    data: availableRooms,
                }
            }
        }
    })
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
