import type { JSX } from "react";

import "../styles/BarraProgresso.scss"

const steps_list: string[] = ["Data", "Quartos", "Hóspedes", "Pagamento"];

export default function BarraProgresso(prop: {step: string , confirmStep: () => boolean }) {
  type status = "done" | "on-going" | "not-yet"

  let step_index = steps_list.findIndex((it) => it == prop.step);
  if (step_index == -1) {
      console.log(`Deu ruim no step = ${prop.step}  em BarraProgresso`)
    step_index = 0;
  }
  
  const steps_divs: JSX.Element[] = steps_list.map((step_name, i) => {
    let etapa_status: status = "done";
    if (i == step_index) {
      etapa_status = "on-going";
    }
    if (i > step_index) {
      etapa_status = "not-yet";
    }

    let etapa_position: "first" | "middle" |  "last" = "middle";
    if (i == 0) {
      etapa_position = "first";
    }
    if (i == steps_list.length - 1) {
      etapa_position = "last";
    }

    return (
      <div key={step_name} className={`etapa ${etapa_status} ${etapa_position}`} style={{zIndex: -i}}>
        <h2>{step_name}</h2>
      </div>)
  });

  const move_page = (to: "prev" | "next") => {
    if (to == "prev") {
      window.location.href = "/Reserva/" + steps_list[step_index - 1];
    }
    if (to == "next") {
      if (prop.confirmStep()) {
        window.location.href = "/Reserva/" + steps_list[step_index + 1];
      }
    }
    return;
  }

    
  return (
    <div className="reserva-header mt-18">
      <h1>Reserva em andamento</h1>
      <div id="progresso">
        {step_index != 0 && <button id="etapas-prev" className="mouse-reaction" onClick={() => move_page("prev")} />}

        <article id="barra" className="hidden xl:flex">
          {steps_divs}
        </article>

        <article id="mini" className="flex xl:hidden">
          <h2>{steps_list[step_index]}</h2>
        </article>

        {step_index != steps_list.length - 1 && <button id="etapas-next" className="mouse-reaction" onClick={() => move_page("next")} />}
      </div>
    </div>
  )
}

