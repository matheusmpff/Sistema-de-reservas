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
