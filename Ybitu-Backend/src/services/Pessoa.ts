import { prisma } from "../libs/prisma.js";

// Inclui adulto (com email/telefone) ou criança (com responsável)
const include = {
    adulto: true,
    crianca: {
        include: {
            responsavel: { include: { pessoa: true } }
        }
    }
} as const;

export const listarPessoas = async () => {
    return prisma.pessoa.findMany({ include, orderBy: { nome: "asc" } });
};

export const buscarPessoa = async (id: number) => {
    return prisma.pessoa.findUnique({ where: { id }, include });
};

// Cria adulto (com email/telefone, pode criar conta de User)
export const criarAdulto = async (dados: {
    nome: string;
    dataNasc: Date;
    sexo: string;
    email: string;
    telefone: string;
}) => {
    return prisma.pessoa.create({
        data: {
            nome: dados.nome,
            dataNasc: new Date(dados.dataNasc),
            sexo: dados.sexo,
            adulto: {
                create: { email: dados.email, telefone: dados.telefone }
            }
        },
        include
    });
};

// Cria criança vinculada a um adulto responsável (idResp = idPessoa do adulto)
export const criarCrianca = async (dados: {
    nome: string;
    dataNasc: Date;
    sexo: string;
    idResp: number;
}) => {
    return prisma.pessoa.create({
        data: {
            nome: dados.nome,
            dataNasc: new Date(dados.dataNasc),
            sexo: dados.sexo,
            crianca: { create: { idResp: dados.idResp } }
        },
        include
    });
};

export const deletarPessoa = async (id: number) => {
    return prisma.pessoa.delete({ where: { id } });
};
