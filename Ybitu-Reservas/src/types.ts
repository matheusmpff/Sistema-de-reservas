export type stateOp<T> = (c: T) => void;

type BookingContext = {
  currentID: string,
  bookings: BookingData[],
}

type UseBookCont = [BookingContext, stateOp<BookingContext>];

type BookingData = {
  id: string,
  user: GuestData,
  otherGuests: GuestData[],
  date_in: Date,
  date_out: Date,
  rooms: RoomData[],
}

type BookingID = { id: string };

export function findBooking(id: string, list: BookingData[]): BookingData {
  let element = list.find((book) => book.id == id);
  if (element == undefined) {
    throw Error("Procurando reserva com ID inexistente");
  }
  return element;
}

type GuestData = {
  id: string, // not the same as the DB id
  guestType: GuestType,
  name: string,
  birthDate: Date,
  sex: "Masculino" | "Feminino",
  phoneNumber: string, // can be the parent's phone
  email?: string,
  parentName?: string,
}

function toSex(value: string): "Masculino" | "Feminino" {
  let v = value.toLocaleUpperCase();
  if (v == "M" || v == "MASCULINO") {
    return "Masculino";
  }
  if (v == "F" || v == "FEMININO") {
    return "Feminino";
  }
  console.log("Erro em toSex: " + value);
  return "Feminino";
}

const GuestType = {
  User: 0,
  Adult: 1,
  Child: 2,
} as const;

type GuestType = (typeof GuestType)[keyof typeof GuestType];

type RoomData = {
  roomQuantity: number,
  roomType: RoomType["rType"],
}

type RoomType = {
  rType: "Duplo" | "Triplo" | "Quádruplo",
  items: string[],
  imagesSrc: string[],
  imagesLabel: string[],
  quantity: number,
}

// map the GuestType to a string
function hTypeToString(hType: GuestType) {
  if (hType == GuestType.User) {
    return "Responsável";
  }
  if (hType == GuestType.Adult) {
    return "Adulto";
  }
  if (hType == GuestType.Child) {
    return "Criança";
  }
}

export { type BookingContext, type UseBookCont, type BookingData, type BookingID, GuestType,
  hTypeToString, type GuestData, type RoomData,type RoomType, toSex };

// ===============================================================
// types from Ybitu-Backend; needs to be sincronized with it
// ===============================================================

type UserServerData = {
  email: string,
  telefone: string,
  pessoa: {
    nome: string,
    dataNasc: Date,
    sexo: string,
  }
}

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

export { type UserServerData, type UserLogin, type UserSignup };
