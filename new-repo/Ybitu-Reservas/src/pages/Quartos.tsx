import { useState } from "react";
import { Splide, SplideSlide, type SplideProps } from "@trg69/react-splide";
import BarraProgresso from "../components/BarraProgresso";

// import css
import "@trg69/react-splide/css";
import "../styles/Quartos.scss";
import Footer from "../components/Footer";


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
  )
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
        1200: {
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

  return (
    <>
      <BarraProgresso step={1}/>

      <h2>Escolha os quartos e a quantidade que serão reservados:</h2>

      <Splide {... splide_config} >
            <SplideSlide id="quarto-casal">
              <div id="quarto-casal-aba" className="aba">
                <img src="src/assets/quartos/QuartoCasal.jpeg" alt="Foto de um quarto com uma cama de casal"/>
                <div className="aba-info">
                  <h2>Quarto de casal</h2>
                  <ul>
                    <li>1 cama de casal</li>
                    <li>1 banheiro</li>
                    <li>Televisão</li>
                    <li>Frigobar</li>
                  </ul>
                </div>
                <div className="aba-numerador">
                  <p>Quantidade disponível:</p>
                  <div className="aba-mostrador">
                    <p>3</p>
                  </div>
                </div>
                <AbaContador limit={3}/>
              </div>
            </SplideSlide>
            <SplideSlide id="quarto-triplo">
              <div id="quarto-triplo-aba" className="aba">
                <img src="src/assets/quartos/QuartoTriplo.jpeg" alt="Foto de um quarto com uma cama de casal e uma de solteiro"/>
                <div className="aba-info">
                  <h2>Quarto triplo</h2>
                  <ul>
                    <li>1 cama de casal ou 2 de solteiro</li>
                    <li>1 cama de solteiro</li>
                    <li>1 banheiro</li>
                    <li>Televisão</li>
                    <li>Frigobar</li>
                  </ul>
                </div>
                <div className="aba-numerador">
                  <p>Quantidade disponível:</p>
                  <div className="aba-mostrador">
                    <p>3</p>
                  </div>
                </div>
                <AbaContador limit={3}/>
              </div>
            </SplideSlide>
            <SplideSlide id="quarto-quadruplo">
              <div id="quarto-quadruplo-aba" className="aba">
                <img src="src/assets/quartos/QuartoQuadruplo.jpeg"
                  alt="Foto de um quarto com uma cama de casal e duas de solteiro"/>
                <div className="aba-info">
                  <h2>Quarto quádruplo</h2>
                  <ul>
                    <li>1 cama de casal ou 2 de solteiro</li>
                    <li>2 cama de solteiro</li>
                    <li>1 banheiro</li>
                    <li>Televisão</li>
                    <li>Frigobar</li>
                  </ul>
                </div>
                <div className="aba-numerador">
                  <p>Quantidade disponível:</p>
                  <div className="aba-mostrador">
                    <p>3</p>
                  </div>
                </div>
                <AbaContador limit={3}/>
              </div>
            </SplideSlide>
      </Splide>

      <Footer />
    </>
  );
}
      // <footer className="wave" />
