import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { findBooking, GuestType, toSex, type BookingContext, type UserServerData } from "../types.ts";

import BarraProgresso from "../components/BarraProgresso.tsx";
import { useAuth } from "../context/AuthContext.tsx";

// const bookingMock: BookingContext = {
//   currentID: crypto.randomUUID(),
//   bookings: [
//     {
//       id: crypto.randomUUID(),
//       date_in: new Date("2026-05-30"),
//       date_out: new Date("2026-06-04"),
//       user: {
//         id: crypto.randomUUID(),
//         guestType: GuestType.User,
//         name: "Joao",
//         birthDate: new Date("2006-04-30"),
//         sex: "Masculino",
//         email: "jotapcastelli@gmail.com",
//         phoneNumber: "+19999999999"
//       },
//       otherGuests: [
//         {
//           id: crypto.randomUUID(),
//           name: "Muzza",
//           parentName: "Joao",
//           birthDate: new Date("1990-12-23"),
//           phoneNumber: "+42997573819",
//           sex: "Feminino",
//           guestType: GuestType.Child,
//         }
//       ],
//       rooms: [],
//     }
//   ]
// }


export default function ReservaRoutePage() {
  const [reservas, setReservas] = useState({} as BookingContext);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
      const profileHandler = async () => {
        if (isLoggedIn == true) {
          const response = await fetch(`http://localhost:3000/user/data`, {credentials:"include"});
          const data: UserServerData = await response.json();
          setReservas({
            currentID: crypto.randomUUID(),
            bookings: [{
              id: crypto.randomUUID(),
              date_in: new Date(),
              date_out: new Date(),
              user: {
                id: crypto.randomUUID(),
                guestType: GuestType.User,
                name: data.pessoa.nome,
                phoneNumber: data.telefone,
                birthDate: data.pessoa.dataNasc,
                sex: toSex(data.pessoa.sexo),
                email: data.email,
              },
              otherGuests: [],
              rooms: [],
            }]
          })

        } else {
          window.location.href = ("/login");
        }
    };
    profileHandler();
  }, [])

  // get pathname of the step ("Data" | "Quartos" ...)
  let location = useLocation();
  let curStep = location.pathname.split("/").at(2);
  if (curStep == undefined) {
    console.log(curStep);
    curStep = "Data";
  }
  curStep = decodeURIComponent(curStep);

  // function to validate that user can proceed in booking
  const confirmStep = () => {
    switch(curStep){
      case "Data":
        break;
      case "Quartos":
        if (findBooking(reservas.currentID, reservas.bookings).rooms.length == 0) {
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
