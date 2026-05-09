import { useState } from "react";
import { Splide, SplideSlide, type SplideProps } from "@trg69/react-splide";
// Import just what we need from bootstrap
import 'bootstrap/js/dist/button';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/tab';
// import "/js/shared.js";

// import css
import '../styles/Quartos.scss';
import "@trg69/react-splide/css";


// mandar para a etapa anterior ou a proxima
// let next_step = "./pagamento.html";
// let prev_step = "./calendario.html";
// const prev_button = document.querySelector("article#reserva-etapas #etapas-prev");
// const next_button = document.querySelector("article#reserva-etapas #etapas-next");

// if (next_button != null) {
//     next_button.addEventListener("click", (ev) => {
//       window.location.href = next_step;
//   })
// }

// prev_button.addEventListener("click", (ev) => {
//     window.location.href = prev_step;
// })

// const mini_progress_bar = document.querySelector("article#reserva-mini-etapas");
// mini_progress_bar.addEventListener("click", (ev) => {
//     window.location.href = next_step;
// })


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
    <>
      <div className="aba-contador">
        <p>Quantidade de reservas:</p>
        <div className="aba-mostrador">
          <button onClick={() => subtract(count)} >-</button>
          <p>{count}</p>
          <button onClick={() => add(count)} >+</button>
        </div>
      </div>
    </>
  )
}

export default function Quartos() {
  let splide_config: SplideProps = {
    options: {
      perPage: 2,
      perMove: 1,
      i18n: {
        prev: "Aba anterior",
        next: "Próxima aba",
      },
      breakpoints: {
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
        <header>
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">

              <a className="navbar-brand" href="https://pousadaybitu.com.br/">
                <img src="src/assets/logo.png" alt="Logo" height="90" width="104"/>
              </a>

              {/* Botão hamburguer para mobile */}
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="menu">
                <ul className="navbar-nav">
                  <li className="nav-item"><a className="nav-link" href="https://pousadaybitu.com.br/">HOME</a></li>
                  <li className="nav-item"><a className="nav-link" href="https://pousadaybitu.com.br/quem-somos/">POUSADA YBITU</a>
                  </li>
                  <li className="nav-item"><a className="nav-link" href="https://pousadaybitu.com.br/passeios-e-eventos/">PASSEIOS E
                      EVENTOS</a></li>
                  <li className="nav-item"><a className="nav-link" href="https://pousadaybitu.com.br/contato/">CONTATO</a></li>
                  <li id="btn-carrinho" className="nav-item">
                    <button className="nav-link">
                      <div className="square">
                        <i className="bi bi-arrow-up-right-square-fill"></i>
                      </div>
                      VER CARRINHO
                    </button>
                  </li>
                </ul>
              </div>

            </div>
          </nav>
        </header>

        <div className="barra-progresso">

          <h1>Reserva em andamento</h1>

          <article id="reserva-etapas" className="d-none d-lg-flex">
            <button id="etapas-prev"></button>

            <div id="etapa-data" className="etapa">
              <h2>Data</h2>
            </div>
            <div id="etapa-quarto" className="etapa">
              <h2>Quartos</h2>
            </div>
            <div id="etapa-hospedes" className="etapa">
              <h2>Hóspedes</h2>
            </div>
            <div id="etapa-pagamento" className="etapa">
              <h2>Pagamento</h2>
            </div>

            <button id="etapas-next"></button>
          </article>

          <article id="reserva-mini-etapas" className="d-lg-none">
            <h2>Quartos</h2>
          </article>
        </div>

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
        <footer className="wave">
        </footer>
  </>);
}
