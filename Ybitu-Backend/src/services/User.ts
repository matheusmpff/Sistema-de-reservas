import { prisma } from "../libs/prisma.js";
import type { LoginInput, SignupInput } from "../types.js";

export const createUser = async (props: SignupInput) => {
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
                                senha: props.senha
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
                senha: props.senha,
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

    if(adult?.user?.senha === props.senha){
        return true
    }

    return false;
}

export const userData = async (email: string) => {
    const user = await prisma.adulto.findUnique({
        where: {
            email: email
        },
        include: {
            pessoa: true,
            user: true
        }
    })

    return user;
} 
