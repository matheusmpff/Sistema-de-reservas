import { useState } from "react";
import { Splide, SplideSlide, type SplideProps } from "@trg69/react-splide";
import BarraProgresso from "../components/BarraProgresso";

// import css
import "@trg69/react-splide/css";
import "../styles/Quartos.scss";
import Footer from "../components/Footer";

import QuartoDuploImage from "../assets/quartos/QuartoCasal.jpeg";
import QuartoTriploImage from "../assets/quartos/QuartoTriplo.jpeg";
import QuartoQuadruploImage from "../assets/quartos/QuartoQuadruplo.jpeg";

function AbaContador(prop: {limit: number}) {
  let [count, setCount] = useState(0);

  const subtract = (c: number) => {
    if (c != 0) {
      setCount(c - 1);
    }
  };

  const add = (c: number) => {
    if (c < prop.limit) {
      setCount(c + 1);
    }
  };
  
  return (
      <div className="aba-contador">
        <p>Quantidade de reservas:</p>
        <div className="aba-mostrador">
          <button onClick={() => subtract(count)} >-</button>
          <p>{count}</p>
          <button onClick={() => add(count)} >+</button>
        </div>
      </div>
  );
}

type QuartoData = {
  type: string,
  title: string,
  imageSrc: string,
  imageLabel: string,
  items: string[],
  quantity: number;
};

function AbaQuarto(prop: {data: QuartoData}) {
  if (!Number.isInteger(prop.data.quantity)) {
    console.log("Aba with non-integer number");
    return null;
  }

  const itemList = prop.data.items.map((item, i) => {
    return (
      <li key={prop.data.type + i.toString()}>{item}</li>
    );
  });
  
  return (
    <div className="aba">
      <img src={prop.data.imageSrc} alt={prop.data.imageLabel} />
      <div className="aba-info">
        <h3>{prop.data.title}</h3>
        <ul className="list-outside list-disc leading-[1.2]">
          {itemList}
        </ul>
      </div>
      <div className="aba-numerador">
        <p>Quantidade disponível:</p>
        <div className="aba-mostrador">
          <p>{prop.data.quantity}</p>
        </div>
      </div>
      <AbaContador limit={prop.data.quantity}/>
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

  const quartosList: QuartoData[] = [
    {
      type: "quarto-duplo",
      title: "Quarto duplo",
      imageSrc: QuartoDuploImage,
      imageLabel: "Foto de um belo quarto com uma cama de casal",
      items: ["1 cama de casal", "1 banheiro", "Televisão", "Frigobar"],
      quantity: 3,
    },
    {
      type: "quarto-triplo",
      title: "Quarto triplo",
      imageSrc: QuartoTriploImage,
      imageLabel: "Foto de um belo quarto com uma cama de casal e uma cama de solteiro",
      items: ["1 cama de casal ou 2 de solteiro", "1 cama de solteiro", "1 banheiro", "Televisão", "Frigobar"],
      quantity: 3,
    },
    {
      type: "quarto-quadruplo",
      title: "Quarto quádruplo",
      imageSrc: QuartoQuadruploImage,
      imageLabel: "Foto de um quarto com uma cama de casal e duas de solteiro",
      items: ["1 cama de casal ou 2 de solteiro", "2 camas de solteiro", "1 banheiro", "Televisão", "Frigobar"],
      quantity: 3,
    },
  ];

  return (
    <>
      <BarraProgresso step={1}/>

      <h2>Escolha os quartos e a quantidade que serão reservados:</h2>

      <Splide {... splide_config}>
        {quartosList.map((quarto) => {
            return (
              <SplideSlide key={quarto.type}><AbaQuarto data={quarto} /></SplideSlide>
            );
          })
        }
      </Splide>

      <Footer />
    </>
  );
}
      // <footer className="wave" />
