import Splide from "@splidejs/splide";
import * as bootstrap from "bootstrap";
import "@splidejs/splide/css";

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
  },
  dragMinThreshold: {
    mouse: 20,
    touch: 20,
  },
} ).mount();
//  arrowPath: 'M11 20.3152L19.3152 12M11 20.3152H27.6304M11 20.3152L19.3152 27.4425',


// mandar para a etapa anterior ou a proxima
let next_step = "./pagamento.html";
let prev_step = "./calendario.html";
const prev_button = document.querySelector("article#reserva-etapas #etapas-prev");
const next_button = document.querySelector("article#reserva-etapas #etapas-next");

next_button.addEventListener("click", (ev) => {
    window.location.href = next_step;
})

prev_button.addEventListener("click", (ev) => {
    window.location.href = prev_step;
})

const mini_progress_bar = document.querySelector("article#reserva-mini-etapas");
mini_progress_bar.addEventListener("click", (ev) => {
    window.location.href = next_step;
})

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
