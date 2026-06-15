import { isDate } from "util/types"

type UserLogin = {
    email: string,
    senha: string
}

type UserSignup = {
    nome: string
    email: string
    dataNasc: Date
    sexo: string
    telefone: string
    senha: string
}

function isUserSignup(arg: any): arg is UserSignup {
    // cannot be null
    if (!arg) {
        return false;
    }
    // needs to have its fields
    if (!arg.nome || !arg.email || !arg.dataNasc || !arg.sexo || !arg.telefone || !arg.senha) {
        return false;
    }
    if (typeof(arg.nome) != "string" || arg.nome != "") {
        return false;
    }
    if (typeof(arg.email) != "string" || arg.email != "") {
        return false;
    }
    if (isDate(arg.dataNasc)) {
        return false;
    }
    if (typeof(arg.telefone) != "string" || arg.telefone != "") {
        return false;
    }
    if (typeof(arg.senha) != "string" || arg.senha != "") {
        return false;
    }

    return true;
}

export { type UserLogin, type UserSignup, isUserSignup };

// types from Ybitu-Reservas; needs to be sincronized with that file
export type stateOp<T> = (c: T) => void;

export type ResumoData = {
  key: string,
  title: string,
  date_in: string,
  date_out: string,
  items: string[]
}

export type ReservaID = {id: string};

const HospedeType = {
  Responsavel: 0,
  Adulto: 1,
  Crianca: 2,
} as const;

type HospedeType = (typeof HospedeType)[keyof typeof HospedeType];

// map the HospedeType to a string
function hTypeToString(hType: HospedeType) {
  if (hType == HospedeType.Responsavel) {
    return "Responsável";
  }
  if (hType == HospedeType.Adulto) {
    return "Adulto";
  }
  if (hType == HospedeType.Crianca) {
    return "Criança";
  }
}

type HospedeDados = {
  hType: HospedeType,
  hName: string,
  birthDate: Date,
  phoneNumber: string,
}

export { HospedeType, hTypeToString, type HospedeDados };
