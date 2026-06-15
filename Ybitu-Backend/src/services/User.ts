import { prisma } from "../libs/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

type UserCreateInput = {
    nome: string
    email: string
    data: string | Date
    sexo: string
    telefone: string
    senha: string

}

export const createUser = async (props: UserCreateInput) => {
    const pessoa = await prisma.pessoa.findUnique({
        where: {
            email: props.email
        },
        include: {
            adulto: {
                include: {
                    user: true
                }
            }
        }
    });

    if (!pessoa) {
        const user = await prisma.pessoa.create({
            data: {
                nome: props.nome,
                data: props.data,
                email: props.email,
                sexo: props.sexo,
                adulto: {
                    create: {
                        telefone: props.telefone,
                        user: {
                            create: {
                                senha: props.senha
                            }
                        }
                    }
                }
            }
        })
        return true;
    }
    if (!pessoa.adulto) {
        await prisma.adulto.create({
            data: {
                telefone: props.telefone,
                user: {
                    create: {
                        senha: props.senha
                    }
                },

                pessoa: {
                    connect:{
                        id: pessoa.id
                    }
                }
            }
        })
        return true;
    }
    if(!pessoa.adulto.user){
        await prisma.user.create({
            data: {
                senha: props.senha,
                adulto: {
                    connect: {
                        id: pessoa.adulto.idPessoa
                    }
                }
            }
        })
        return true;
    }

    return false;
}

type LoginInput = {
    email: string,
    senha: string
}

export const loginUser = async (props: LoginInput) =>{
    const user = await prisma.pessoa.findUnique({
        where: {
            email: props.email
        },
        include: {
            adulto: {
                include: {
                    user: true
                }
            }
        }
    });

    if(!user || !user.adulto ||!user.adulto.user ){
        return false;
    }

    if(user.adulto.user.senha === props.senha){
        return true
    }
}

export const userData = async (email: string) =>{
    const user = await prisma.pessoa.findUnique({
        where: {
            email: email
        },
        include: {
            adulto: {
                include: {
                    user: true
                }
            }
        }
    })

    return user;
} 