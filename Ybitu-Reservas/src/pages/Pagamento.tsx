// project components
import BarraProgresso from "../components/BarraProgresso";
import PopUp, { type PopUpState } from "../components/PopUp.tsx";
import { type ResumoData, type stateOp, type ReservaID } from "../types.ts";
// external libraries
import { useState } from "react";
import { Pencil, Trash } from "lucide-react";

// imrt styles
import "../styles/Pagamento.scss";

type popFn = stateOp<PopUpState<ReservaID>>;

// delFn (delete function) actually just opens the popup to confirm that this item will be deleted
function ReservaResumo(props: { data: ResumoData, editFn: popFn, delFn: popFn }) {

  const reservaList = props.data.items.map(
    (item, i) => {
      const key = props.data.key + "-it" + i.toString();
      return (
        <li key={key}>{item}</li>
      );
    }
  );

  const popSt = {open: true, data: {id: props.data.key}};
  
  return (
    <div className="opcao-reserva">
      <div className="reserva-titulo">
        <h3>{props.data.title}</h3>
        <div className="flex gap-1">
          <Pencil className="mouse-reaction" onClick={() => props.editFn(popSt)}/>
          <Trash className="mouse-reaction" onClick={() => props.delFn(popSt)} />
        </div>
      </div>

      <div className="flex flex-col items-left">
        <p className="reserva-data">Data: {props.data.date_in} &#x2192; {props.data.date_out}</p>
        <p>Items:</p>
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
  // whether the popup for confirmation of deletion should be open
  // and what item called it
  const [popDelete, setPopDelete] = useState({ open: false, data: {id: ""}} as PopUpState<ReservaID>);
  const [popEdit, setPopEdit] = useState({ open: false, data: {id: ""}} as PopUpState<ReservaID>);

  // when the user clicks the trash button, remove the element from the list
  const deleteResumo = (isDel: boolean) => {
    if (isDel) {
      setResumoList(resumoList.filter((resumo) => resumo.key != popDelete.data.id));
    }
    setPopDelete({open: false, data: {id: ""}});
  };

  const editResumo = (isEdit: boolean) => {
    if (isEdit) {
      window.location.href = "quartos";
    }
    setPopEdit({open: false, data: {id: ""}});
  }

  return (
  <>  
    <BarraProgresso step={3} />

    <main id="pagamento-main">
      <section>
        <h2>Como concluir a reserva</h2>
        <p>
          Ao lado, é possível ver a quantidade e as opções de quarto adicionados ao carrinho. Foram realizadas
          2 reservas, totalizando 6 quartos.
        </p>
        <p>
          Caso deseje editar suas escolhas, clique no ícone do
          lápis para voltar à primeira etapa. Caso deseje excluir
          alguma reserva, clique no ícone de lixeira.
        </p>
        <p>
          Para concluir a sua reserva, clique no botão "Concluir
          reserva", que irá direcioná-lo para um de nossos
          atendentes no WhatsApp.
        </p>
        <p>Caso queira adicionar mais quartos clique no botão abaixo:</p>

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
            <ReservaResumo key={resumo.key} data={resumo} editFn={setPopEdit} delFn={setPopDelete}/>)
          }
        </div>
        <a className="secondary-button mouse-reaction" href="/feedback">CONCLUIR RESERVA</a>
      </aside>

      <PopUp modalState={popDelete.open}>
        <div className="pop-confirm">
          <h2>Você realmente deseja deletar esta reserva?</h2>
          <p className="mb-2">Essa ação não poderá ser desfeita.</p>
          <div className="flex justify-center gap-4">
            <button className="mouse-reaction" onClick={() => deleteResumo(true)}>Deletar</button>
            <button className="mouse-reaction" onClick={() => deleteResumo(false)}>Não deletar</button>
          </div>
        </div>
      </PopUp>
      <PopUp modalState={popEdit.open}>
        <div className="pop-confirm">
          <h2>Você deseja editar esta reserva?</h2>
          <p>O site voltará a página de data, com seus dados salvos</p>
          <div className="flex justify-center gap-4">
            <button className="mouse-reaction" onClick={() => editResumo(true)}>Editar</button>
            <button className="mouse-reaction" onClick={() => editResumo(false)}>Fechar</button>
          </div>
        </div>
      </PopUp>
    </main>
  </ >
  );
}
