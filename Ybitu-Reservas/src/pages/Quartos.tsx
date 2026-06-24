import QuartoDuploImage from "../assets/quartos/QuartoCasal.jpeg";
import QuartoTriploImage from "../assets/quartos/QuartoTriplo.jpeg";
import QuartoQuadruploImage from "../assets/quartos/QuartoQuadruplo.jpeg";
import { Splide, SplideSlide, type SplideProps } from "@trg69/react-splide";
import { Minus, Plus } from "lucide-react";

// import css
import "@trg69/react-splide/css";
import "../styles/Quartos.scss";

import { type RoomType, type stateOp } from "../types.ts";
import { useState } from "react";

function AbaContador(prop: {count: number, limit: number, sub: stateOp<number>, add: stateOp<number>}) {
  return (
      <>
        <h3>Quantidade de reservas:</h3>
        <div className="aba-mostrador">
          <Minus className="contador-click mouse-reaction" strokeWidth={1.4} onClick={() => prop.sub(prop.count)} />
          <p>{prop.count}</p>
            <Plus className="contador-click mouse-reaction" strokeWidth={1.4} onClick={() => prop.add(prop.count)}/>
        </div>
      </>
  );
};

function AbaSelecao(prop: {limit: number}) {
  let [count, setCount] = useState(0);

  const subtract = (c: number) => {
    setCount(c - 1);
  };
  const add = (c: number) => {
    if (c < prop.limit) {
      setCount(c + 1);
    }
  };

  const abrirContador = () => {
    setCount(1);
  };

  return (
    <div className="aba-contador aba-area">
      {count == 0 && <div className="w-full h-full flex items-center justify-center">
         <button className="aba-selecionar mouse-reaction" onClick={() => abrirContador()}>Selecionar quarto</button>
      </div>}
      {count != 0 && <AbaContador count={count} limit={prop.limit} sub={subtract} add={add} />}
    </div>
  );
};

function AbaQuarto(prop: {data: RoomType}) {
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
          <p>{prop.data.quantity}</p>
        </div>
      </div>
      <AbaSelecao limit={prop.data.quantity}/>
    </div>
  );
}


export default function Quartos() {
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

  const quartosList: RoomType[] = [
    {
      rType: "Duplo",
      imagesSrc: [QuartoDuploImage],
      imagesLabel: ["Foto de um belo quarto com uma cama de casal"],
      items: ["1 cama de casal", "1 banheiro", "Televisão", "Frigobar"],
      quantity: 3,
    },
    {
      rType: "Triplo",
      imagesSrc: [QuartoTriploImage],
      imagesLabel: ["Foto de um belo quarto com uma cama de casal e uma cama de solteiro"],
      items: ["1 cama de casal ou 2 de solteiro", "1 cama de solteiro", "1 banheiro", "Televisão", "Frigobar"],
      quantity: 3,
    },
    {
      rType: "Quádruplo",
      imagesSrc: [QuartoQuadruploImage],
      imagesLabel: ["Foto de um quarto com uma cama de casal e duas de solteiro"],
      items: ["1 cama de casal ou 2 de solteiro", "2 camas de solteiro", "1 banheiro", "Televisão", "Frigobar"],
      quantity: 3,
    },
  ];

  return (
    <>
      <h2>Escolha os quartos e a quantidade que serão reservados:</h2>

      <Splide {... splide_config}>
        {quartosList.map((quarto) => {
            return (
              <SplideSlide key={quarto.rType}><AbaQuarto data={quarto} /></SplideSlide>
            );
          })
        }
      </Splide>

      
    </>
  );
}
