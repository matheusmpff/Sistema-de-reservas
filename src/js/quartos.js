import Splide from "@splidejs/splide";

import "css/quartos.scss";
//import * as bootstrap from "bootstrap";
import "@splidejs/splide/css";

import QuartoCasalImg from "images/quartos/QuartoCasal.png";
import QuartoTriploImg from "images/quartos/QuartoTriplo.png";
import QuartoQuadruploImg from "images/quartos/QuartoQuadruplo.png";
import Logo from "images/logo.png";

new Splide( ".splide", {
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
  }
} ).mount();
//  arrowPath: 'M11 20.3152L19.3152 12M11 20.3152H27.6304M11 20.3152L19.3152 27.4425',

document.querySelector("#logo").src = Logo;
document.querySelector("#quarto-casal-aba img").src = QuartoCasalImg;
document.querySelector("#quarto-triplo-aba img").src = QuartoTriploImg;
document.querySelector("#quarto-quadruplo-aba img").src = QuartoQuadruploImg;
//document.querySelector('#QuartoCasal').src = QuartoCasalImg;

// inicializar os botoes dos contadores
const counters = document.getElementsByClassName("aba-contador");

for (const counter of counters) {
  const sum = counter.querySelector(".addition");
  const minus = counter.querySelector(".subtraction");
  const number_viewer = counter.querySelector(".aba-mostrador p");
  const max_number = Number(counter.parentElement.querySelector(".aba-numerador .aba-mostrador p").innerText);

  sum.addEventListener("click", (ev) => {
    let num = Number(number_viewer.innerText);
    if (num < max_number) {
      num = num + 1;
    }
    number_viewer.innerText = String(num);
  });
  
  minus.addEventListener("click", (ev) => {
    let num = Number(number_viewer.innerText);
    if (num > 0) {
      num = num - 1;
    }
    number_viewer.innerText = String(num);
  })
}
