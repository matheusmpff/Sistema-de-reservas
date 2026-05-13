import type { JSX } from "react";

import "../styles/BarraProgresso.scss"

// if you change the number of steps, change etapa_position if statement
export default function BarraProgresso(prop: {step: 0 | 1 | 2 }) {
  type status = "done" | "on-going" | "not-yet"

  const steps_list: string[] = ["Data", "Quartos", "Pagamento"];
  const last_step = 2;
  
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
    <div className="reserva-header">
      <h1>Reserva em andamento</h1>
      <div id="progresso">
        {prop.step != 0 && <button id="etapas-prev" onClick={() => move_page("prev")} />}

        <article id="barra" className="d-none d-lg-flex">
          {steps_divs}
        </article>

        <article id="mini" className="d-lg-none">
          <h2>{steps_list[prop.step]}</h2>
        </article>

        {prop.step != last_step && <button id="etapas-next" onClick={() => move_page("next")} />}
      </div>
    </div>
  )
}

