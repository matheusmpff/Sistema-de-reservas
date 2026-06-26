import { isDate } from "util/types"

type LoginInput = {
    email: string,
    senha: string
}

type SignupInput = {
    nome: string
    email: string
    dataNasc: Date
    sexo: string
    telefone: string
    senha: string
}

function isSignupInput(arg: any): arg is SignupInput {
    // cannot be null
    if (!arg) {
        return false;
    }
    // needs to have its fields
    if (!arg.nome || !arg.email || !arg.dataNasc || !arg.sexo || !arg.telefone || !arg.senha) {
        return false;
    }
    if (typeof(arg.nome) !== "string" || arg.nome === "") {
        return false;
    }
    if (typeof(arg.email) !== "string" || arg.email === "") {
        return false;
    }
    if (isNaN(new Date(arg.dataNasc).getTime())) {
        return false;
    }
    if (typeof(arg.telefone) !== "string" || arg.telefone === "") {
        return false;
    }
    if (typeof(arg.senha) !== "string" || arg.senha === "") {
        return false;
    }

    return true;
}

export { type LoginInput, type SignupInput, isSignupInput };

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

export const GuestType = {
  User: 0,
  Adult: 1,
  Child: 2,
} as const;

export type GuestType = (typeof GuestType)[keyof typeof GuestType];

export type RoomType = {
  rType: "Duplo" | "Triplo" | "Quádruplo",
  items: string[],
  imagesSrc: string[],
  imagesLabel: string[],
  quantity: number,
}

export function rTypeTranslation(type: RoomType["rType"]) {
  if (type == "Duplo") {
    return "DUPLO";
  }
  if (type == "Triplo") {
    return "TRIPLO";
  }
  if (type == "Quádruplo") {
    return "QUADRUPLO";
  }
  console.log("Quarto estranho");
  return "DUPLO";
}

export type RoomData = {
  roomQuantity: number,
  roomType: RoomType["rType"],
}

export type GuestData = {
  id: string,
  guestType: GuestType,
  name: string,
  birthDate: Date,
  sex: "Masculino" | "Feminino",
  phoneNumber: string,
  email?: string,
  parentName?: string,
}

export type BookingData = {
  id: string,
  user: GuestData,
  otherGuests: GuestData[],
  date_in: Date,
  date_out: Date,
  rooms: RoomData[],
}

export { HospedeType, hTypeToString, type HospedeDados };
