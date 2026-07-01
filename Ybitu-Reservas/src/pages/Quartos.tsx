import QuartoDuploImage from "../assets/quartos/QuartoCasal.jpeg";
import QuartoTriploImage from "../assets/quartos/QuartoTriplo.jpeg";
import QuartoQuadruploImage from "../assets/quartos/QuartoQuadruplo.jpeg";
import { type UseBookCont, type RoomType, type stateOp, findBooking } from "../types.ts";

import * as zod from "zod";
import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import { Splide, SplideSlide, type SplideProps } from "@trg69/react-splide";
import { Minus, Plus } from "lucide-react";

// import css
import "@trg69/react-splide/css";
import "../styles/Quartos.scss";

type ContadorDados = {
  limit: number,
  count: number,
  loading: boolean,
}

function AbaContador(prop: {data: ContadorDados, sub: stateOp<void>, add: stateOp<number>}) {
  return (
      <>
        <h3>Quantidade de reservas:</h3>
        <div className="aba-mostrador">
          <Minus className="contador-click mouse-reaction" strokeWidth={1.4} onClick={() => prop.sub()} />
          <p>{prop.data.count}</p>
          <Plus className="contador-click mouse-reaction" strokeWidth={1.4} onClick={() => prop.add(prop.data.count)}/>
        </div>
      </>
  );
};

function AbaSelecao(prop: {data: ContadorDados, changeFn: stateOp<number>}) {

  const subtract = () => {
    prop.changeFn(-1);
  };
  const add = (c: number) => {
    if (c < prop.data.limit) {
      prop.changeFn(1);
    }
  };

  return (
    <div className="aba-contador aba-area">
      {prop.data.count == 0 && <div className="w-full h-full flex items-center justify-center">
         <button className="primary-button h-16 w-42 mouse-reaction" onClick={() => add(prop.data.count)}>Selecionar quarto</button>
      </div>}
      {prop.data.count != 0 && <AbaContador data={prop.data} sub={subtract} add={add} />}
    </div>
  );
};

function AbaQuarto(prop: {data: RoomType, countData: ContadorDados, changeFn: (arg0: RoomType["rType"], arg1: number) => void}) {
  if (!Number.isInteger(prop.data.quantity)) {
    console.log("Aba with non-integer number");
    return null;
  }

  const itemList = prop.data.items.map((item, i) => {
    return (
      <li key={prop.data.rType + i.toString()}>{item}</li>
    );
  });
  
  return (
    <div className="aba">
      <img src={prop.data.imagesSrc[0]} alt={prop.data.imagesLabel[0]} />
      <div className="aba-info aba-area">
        <h3>{"Quarto " + prop.data.rType}</h3>
        <ul className="list-outside list-disc leading-[1.2]">
          {itemList}
        </ul>
      </div>
      <div className="aba-numerador aba-area">
        <h3>Quantidade disponível:</h3>
        <div className="aba-mostrador">
          <p>{prop.countData.loading ? "Carregando" : prop.countData.limit}</p>
        </div>
      </div>
      <AbaSelecao data={prop.countData} changeFn={(ammount: number) => prop.changeFn(prop.data.rType, ammount)}/>
    </div>
  );
}

const quartosList: RoomType[] = [
  {
    rType: "Duplo",
    imagesSrc: [QuartoDuploImage],
    imagesLabel: ["Foto de um belo quarto com uma cama de casal"],
    items: ["1 cama de casal", "1 banheiro", "Televisão", "Frigobar"],
    quantity: 0,
  },
  {
    rType: "Triplo",
    imagesSrc: [QuartoTriploImage],
    imagesLabel: ["Foto de um belo quarto com uma cama de casal e uma cama de solteiro"],
    items: ["1 cama de casal ou 2 de solteiro", "1 cama de solteiro", "1 banheiro", "Televisão", "Frigobar"],
    quantity: 0,
  },
  {
    rType: "Quádruplo",
    imagesSrc: [QuartoQuadruploImage],
    imagesLabel: ["Foto de um quarto com uma cama de casal e duas de solteiro"],
    items: ["1 cama de casal ou 2 de solteiro", "2 camas de solteiro", "1 banheiro", "Televisão", "Frigobar"],
    quantity: 0,
  },
];

const availRoomsResponse = zod.object({
  Duplo: zod.int(),
  Triplo: zod.int(),
  Quádruplo: zod.int(),
});

export default function Quartos() {
  const [reservas, setReservas] = useOutletContext<UseBookCont>();

  // temporary state while fetching number of rooms
  const [loading, setLoading] = useState(true);

  const [roomQuantity, setRoomQuantity] = useState({
    Duplo: 0,
    Triplo: 0,
    Quádruplo: 0,
  });

  // load the quantity of rooms available for each type in the date range selected in the previous page
  useEffect(() => {
    const query_param = new URLSearchParams({
      date_in: findBooking(reservas).date_in.toISOString().split("T")[0],
      date_out: findBooking(reservas).date_out.toISOString().split("T")[0],
    }).toString();

    fetch("http://localhost:3000/user/availablerooms?" + query_param, {
      credentials: "include",
      cache: "no-store",
    })
    .then( async (res) => {
      if (res.status == 200) {
        let message = await res.json();
        let avail = availRoomsResponse.parse(message);

        // subtract rooms chosen in other booking in this session
        for (const book of reservas.bookings) {
          if (book.id != reservas.currentID && book.date_in.getTime() < findBooking(reservas).date_out.getTime() && book.date_out.getTime() > findBooking(reservas).date_in.getTime()) {
            for (const room of book.rooms) {
              avail[room.roomType] -= room.roomQuantity;
            }
          }
        }

        setRoomQuantity({
          Duplo: avail.Duplo,
          Triplo: avail.Triplo,
          Quádruplo: avail.Quádruplo,
        });
        setLoading(false);
      }
      else {
        let message: { msg?: string } = await res.json();
        if (message.msg) {
          window.alert(message.msg);
        }
      }
    }).catch((reason) => {
      window.alert(reason);
    })
  }, []);


  let splide_config: SplideProps = {
    options: {
      perPage: 3,
      perMove: 1,
      i18n: {
        prev: "Aba anterior",
        next: "Próxima aba",
      },
      breakpoints: {
        2150: {
          perPage: 2,
        },
        1280: {
          perPage: 1,
        },
      },
      dragMinThreshold: {
        mouse: 20,
        touch: 20,
      },
//    arrowPath: 'M11 20.3152L19.3152 12M11 20.3152H27.6304M11 20.3152L19.3152 27.4425',
    },
    tag: "section",    
    id: "quartos-carousel",
    "aria-label": "Lista dos quartos",
  };

  const changeRoomQuantity = (type: RoomType["rType"], ammount: number) => {
    let rooms = findBooking(reservas).rooms;
    let index = rooms.findIndex((room) => room.roomType == type);
    if (index == -1) {
      rooms.push({roomQuantity: 1, roomType: type});
    }
    else {
      rooms[index].roomQuantity += ammount;
    }

    rooms = rooms.filter((room) => room.roomQuantity > 0);

    setReservas({
      ...reservas,
      bookings: reservas.bookings.map((book) => {
        if (book.id != reservas.currentID) {
          return book;
        }

        return {...book, rooms: rooms};
      })
    });
  }

  return (
    <>
      <h2>Escolha os quartos e a quantidade que serão reservados:</h2>

      <Splide {... splide_config}>
        {quartosList.map((quarto) => {
            let count = findBooking(reservas).rooms.find((room) => room.roomType == quarto.rType)?.roomQuantity;
            let countData: ContadorDados = {
              limit: roomQuantity[quarto.rType],
              count: count === undefined ? 0 : count,
              loading,
            }
            return (
              <SplideSlide key={quarto.rType}><AbaQuarto data={quarto} countData={countData} changeFn={changeRoomQuantity}/></SplideSlide>
            );
          })
        }
      </Splide>
    </>
  );
}
