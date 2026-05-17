import BarraProgresso from "../components/BarraProgresso";

import "../styles/Pagamento.scss";

import { type ResumoData, type stateOp } from "../types.ts";
import { useState } from "react";

function ReservaResumo(prop: { data: ResumoData, delFn: stateOp<string> }) {

  const reservaList = prop.data.items.map(
    (item, i) => {
      const key = prop.data.key + "-it" + i.toString();
      return (
        <li key={key}>{item}</li>
      );
    }
  );
   
  return (
    <div className="opcao-reserva">
      <div className="reserva-titulo">
        <h3>{prop.data.title}</h3>
        <div className="flex gap-1">
          <i className="bi bi-pencil-fill mouse-reaction"></i>
          <i className="bi bi-trash-fill mouse-reaction" onClick={() => prop.delFn(prop.data.key)}></i>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <p className="reserva-data">{prop.data.date_in} &#x2192; {prop.data.date_out}</p>
        <ul className="reserva-quarto">
          {reservaList}
        </ul>
      </div>
    </div>
  )
}

// the data of the reservas. when implemented, we will take them from the other pages
const resumoInitial: ResumoData[] = [
  {
    key: "aaaa-id1",
    title: "Grupo 1",
    date_in: "26/08/2026",
    date_out: "29/08/2026",
    items: ["1 quarto casal", "1 quarto quádruplo"]
  },
  {
    key: "resumo-id2",
    title: "Grupo 2",
    date_in: "26/09/2026",
    date_out: "29/09/2026",
    items: ["1 quarto triplo"]
  }
];

export default function Pagamento() {
  // state for the list of reservas
  const [resumoList, setResumoList] = useState(resumoInitial);

  // when the user clicks the trash button, remove the element from the list
  const deleteResumo = (id: string) => {
    setResumoList(resumoList.filter((resumo) => resumo.key != id));
  };


  return (
  <>  
    <BarraProgresso step={2} />

    <main>
      <section>
        <h2>Como concluir a reserva</h2>
        <p>
          Ao lado, é possível ver a quantidade e as opções de quarto adicionados ao carrinho.Foram realizadas
          2 reservas, totalizando 6 quartos.
        </p>
        <p>
          Caso deseje editar suas escolhas, clique no ícone do
          lápis para voltar à primeira etapa. Caso deseje excluir
          alguma reserve, clique no ícone da lixeira.
        </p>
        <p>
          Para concluir a sua reserva, clique no botão "Concluir
          reserva", que irá direcioná-lo para um de nossos
          atendentes no WhatsApp.
        </p>
        <p>Caso queira adicionar mais quartos clique no botão abaixo</p>

        <a href="Quartos" id="maisquartos" className="mouse-reaction">Adicionar mais quartos</a>
      </section>

      <aside>
        <div className="mt-6 lg:mt-8">
          <img className="w-[88px] lg:w-[96px]" src="src/assets/pagamento/carrinho.png" alt="Desenho de um carrinho de supermercado" />
        </div>
        <div>
          <h2>MEU CARRINHO</h2>
        </div>
        <div id="pagamento-lista">
          {resumoList.map((resumo) =>
            <ReservaResumo key={resumo.key} data={resumo} delFn={deleteResumo}/>)
          }
        </div>
        <a id="reserva-botao" className="mouse-reaction" href="/feedback">CONCLUIR RESERVA</a>
      </aside>
    </main>


    
  </ >
  );
}
    // <footer className="wave"/>
