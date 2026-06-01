import type { JSX } from "react";

import "../styles/BarraProgresso.scss"

// if you change the number of steps, change etapa_position if statement
export default function BarraProgresso(prop: {step: 0 | 1 | 2 | 3 }) {
  type status = "done" | "on-going" | "not-yet"

  const steps_list: string[] = ["Data", "Quartos", "Hóspedes", "Pagamento"];
  const last_step = steps_list.length - 1;
  
  const steps_divs: JSX.Element[] = steps_list.map((step_name, i) => {
    let etapa_status: status = "done";
    if (i == prop.step) {
      etapa_status = "on-going";
    }
    if (i > prop.step) {
      etapa_status = "not-yet";
    }

    let etapa_position: "first" | "middle" |  "last" = "middle";
    if (i == 0) {
      etapa_position = "first";
    }
    if (i == last_step) {
      etapa_position = "last";
    }

    return (
      <div key={step_name} className={`etapa ${etapa_status} ${etapa_position}`} style={{zIndex: -i}}>
        <h2>{step_name}</h2>
      </div>)
  });

  const move_page = (to: "prev" | "next") => {
    if (to == "prev") {
      window.location.href = steps_list[prop.step - 1];
    }
    if (to == "next") {
      window.location.href = steps_list[prop.step + 1];
    }
    return;
  }

    
  return (
    <div className="reserva-header mt-18">
      <h1>Reserva em andamento</h1>
      <div id="progresso">
        {prop.step != 0 && <button id="etapas-prev" className="mouse-reaction" onClick={() => move_page("prev")} />}

        <article id="barra" className="hidden lg:flex">
          {steps_divs}
        </article>

        <article id="mini" className="flex lg:hidden">
          <h2>{steps_list[prop.step]}</h2>
        </article>

        {prop.step != last_step && <button id="etapas-next" className="mouse-reaction" onClick={() => move_page("next")} />}
      </div>
    </div>
  )
}

