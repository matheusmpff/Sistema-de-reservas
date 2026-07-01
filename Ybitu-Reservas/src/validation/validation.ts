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

export const validateContactForm = (nome: string, email: string, checkFone: string) => {
    if (checkFone === "") {
        const pattern = z.object({
            nome: z.string().min(2, { error: "O nome deve ter no mínimo 2 caracteres" }).regex(
                /^[A-Za-zÀ-ÖØ-öø-ÿ' ]+$/,
                { error: "O nome contém caracteres inválidos." }
            ).max(50, { error: "O nome pode ter no máximo 50 caracteres" }).trim(),
            email: z.email({ error: "É preciso inserir um e-mail válido" })
        })

        return pattern.safeParse({
            nome,
            email
        })
    }
    const pattern = z.object({
        nome: z.string().min(2, { error: "O nome deve ter no mínimo 2 caracteres" }).regex(
            /^[A-Za-zÀ-ÖØ-öø-ÿ' ]+$/,
            { error: "O nome contém caracteres inválidos." }
        ).max(50, { error: "O nome pode ter no máximo 50 caracteres" }).trim(),
        email: z.email({ error: "É preciso inserir um e-mail válido" }),
        checkFone: z.e164({ error: "Telefone no formato inválido." }).min(14, { error: "Falta números para um telefone válido." })

    })

    return pattern.safeParse({
        nome,
        email,
        checkFone
    })
}

const patternValidateSignup = z.object({
    nome: z.string().min(2, { error: "O nome deve ter no mínimo 2 caracteres" }).regex(
        /^[A-Za-zÀ-ÖØ-öø-ÿ' ]+$/,
        { error: "O nome contém caracteres inválidos." }
    ).max(50, { error: "O nome pode ter no máximo 50 caracteres" }).trim(),
    email: z.email({ error: "É preciso inserir um e-mail válido" }),
    checkFone: z.e164({ error: "Telefone no formato inválido." }).min(14, { error: "Falta números para um telefone válido." }),
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
    sexo: z.union([z.literal("Masculino"), z.literal("Feminino")], { error: "Escolha uma das opções..." }),
    senha: z.string().min(8, { error: "A senha tem que ter pelo menos 8 caracteres" })
        .max(20, { error: "Pode ter no máximo 20 caracteres" })
})

export const validateSignup = (props: { nome: string, email: string, dataNasc: string, checkFone: string, sexo: string, senha: string }) => {
    return patternValidateSignup.safeParse(props);
}

export const validateFeedback = (props: { nome: string, email: string, checkIn: string, checkOut: string }) => {
    const pattern = z.object({
        nome: z.string().min(2, { error: "O nome deve ter no mínimo 2 caracteres" }).regex(
            /^[A-Za-zÀ-ÖØ-öø-ÿ' ]+$/,
            { error: "O nome contém caracteres inválidos." }
        ).max(50, { error: "O nome pode ter no máximo 50 caracteres" }).trim(),
        email: z.email({ error: "É preciso inserir um e-mail válido" }),
        checkIn: z.coerce.date().refine((checkIn) => {
            const checkOut = new Date(props.checkOut);

            if(checkOut.getTime() < checkIn.getTime()){
                return false;
            }
            return true;
        }, { error: "Check-in inconsistente com o Check-Out" })
        .refine((checkIn) => {
            const agora = new Date();

            if(agora.getTime() < checkIn.getTime()){
                return false;
            }
            return true;
        }, { error: "Ainda não houve o check-in dessa viagem" }),
        checkOut:  z.coerce.date()
        .refine((checkOut) => {
            const agora = new Date();

            if(agora.getTime() < checkOut.getTime()){
                return false;
            }
            return true;
        }, { error: "Check-out não realizado para essa reserva. Feedback pode ocorrer apenas quando finaliza-se a hospedagem" })
    })

    return pattern.safeParse(props);
}
