import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { GuestType, type BookingContext } from "../types.ts";

import BarraProgresso from "../components/BarraProgresso.tsx";

const bookingMock: BookingContext = {
  currentID: 0,
  bookings: [
    {
      id: 0,
      date_in: new Date("2026-05-30"),
      date_out: new Date("2026-06-04"),
      user: {
        id: crypto.randomUUID(),
        guestType: GuestType.User,
        name: "Joao",
        birthDate: new Date("2006-04-30"),
        sex: "Masculino",
        email: "jotapcastelli@gmail.com",
        phoneNumber: "+19999999999"
      },
      otherGuests: [
        {
          id: crypto.randomUUID(),
          name: "Muzza",
          parentName: "Joao",
          birthDate: new Date("1990-12-23"),
          phoneNumber: "+42997573819",
          sex: "Feminino",
          guestType: GuestType.Child,
        }
      ],
      rooms: [],
    }
  ]
}
export default function ReservaRoutePage() {
  let [reservas, setReservas] = useState(bookingMock);

  let location = useLocation();
  let curStep = location.pathname.split("/").at(2);
  if (curStep == undefined) {
    console.log(curStep);
    curStep = "Data";
  }
  curStep = decodeURIComponent(curStep);

  const confirmStep = () => {
    switch(curStep){
      case "Data":
        break;
      case "Quartos":
        if (reservas.bookings[reservas.currentID].rooms.length == 0) {
          window.alert("Pelo menos 1 quarto precisa ser reservado")
          return false;
        }
        break;
      case "Hóspedes":
        break;
      default:
        return false;
    }
    return true;
  }
  
  return(
    <>
      <BarraProgresso step={curStep} confirmStep={confirmStep} />
      <Outlet context={[reservas, setReservas]}/>
    </>
  );
};
