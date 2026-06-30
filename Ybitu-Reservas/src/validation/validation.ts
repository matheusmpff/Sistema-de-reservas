import { z } from "zod";

export const validateAdulto = (nome: string, email: string, dataNasc: string) => {
    const pattern = z.object({
        nome: z.string().min(2, { error: "O nome deve ter no mínimo 2 caracteres" }).regex(
            /^[A-Za-zÀ-ÖØ-öø-ÿ' ]+$/,
            { error: "O nome contém caracteres inválidos." }
        ).max(50, { error: "O nome pode ter no máximo 50 caracteres" }).trim(),
        email: z.email({ error: "É preciso inserir um e-mail válido" }),
        dataNasc: z.coerce.date().refine((nasc) => {
            const agora = new Date();

            if (agora.getFullYear() - nasc.getFullYear() < 18) {
                return false;
            }
            else {
                if (agora.getFullYear() - nasc.getFullYear() > 18) {
                    return true;
                }
            }
            if (agora.getMonth() < nasc.getMonth()) {
                return false;
            }
            if (agora.getMonth() == nasc.getMonth() && agora.getDate() < nasc.getDate()) {
                return false;
            }

            return true;
        }, { error: "Idade precisa ser maior de 18 anos" })
    })

    const resultado = pattern.safeParse({
        nome,
        email,
        dataNasc,
    })

    return resultado;
};

export const validatePhone = (phone: string) => {
    const pattern = z.e164({ error: "Telefone no formato inválido." });

    return pattern.safeParse(phone);
}

export const validateContactForm = (nome: string, email: string, checkPhone: string) => {
    const pattern = z.object({
        nome: z.string().min(2, { error: "O nome deve ter no mínimo 2 caracteres" }).regex(
            /^[A-Za-zÀ-ÖØ-öø-ÿ' ]+$/,
            { error: "O nome contém caracteres inválidos." }
        ).max(50, { error: "O nome pode ter no máximo 50 caracteres" }).trim(),
        email: z.email({ error: "É preciso inserir um e-mail válido" }),
        checkFone: z.e164({ error: "Telefone no formato inválido." })

    })

    return pattern.safeParse({
        nome,
        email,
        checkPhone
    })
}

const patternValidateSignup = z.object({
    nome: z.string().min(2, { error: "O nome deve ter no mínimo 2 caracteres" }).regex(
        /^[A-Za-zÀ-ÖØ-öø-ÿ' ]+$/,
        { error: "O nome contém caracteres inválidos." }
    ).max(50, { error: "O nome pode ter no máximo 50 caracteres" }).trim(),
    email: z.email({ error: "É preciso inserir um e-mail válido" }),
    checkFone: z.e164({ error: "Telefone no formato inválido." }),
    dataNasc: z.coerce.date().refine((nasc) => {
        const agora = new Date();

        if (agora.getFullYear() - nasc.getFullYear() < 18) {
            return false;
        }
        else {
            if (agora.getFullYear() - nasc.getFullYear() > 18) {
                return true;
            }
        }
        if (agora.getMonth() < nasc.getMonth()) {
            return false;
        }
        if (agora.getMonth() == nasc.getMonth() && agora.getDate() < nasc.getDate()) {
            return false;
        }

        return true;
    }, { error: "Idade precisa ser maior de 18 anos" }),
    sexo: z.union([z.literal("Masculino"), z.literal("Feminino")],{error:"Escolha uma das opções..."}),
    senha: z.string().min(8, { error: "A senha tem que ter pelo menos 8 caracteres" })
    .max(20,{error: "Pode ter no máximo 20 caracteres"})
})

export const validateSignup = (props:{nome:string,email:string,dataNasc:string,checkFone:string,sexo:string, senha:string}) => {
    return patternValidateSignup.safeParse(props);
}
