// project components
import PopUp, { type PopUpState } from "../components/PopUp.tsx";
import { type BookingData, type BookingID, type stateOp, type UseBookCont } from "../types.ts";
// external libraries
import { useState } from "react";
import { Pencil, Trash } from "lucide-react";

// imrt styles
import "../styles/Pagamento.scss";
import { useOutletContext } from "react-router";

type popFn = stateOp<PopUpState<BookingID>>;

// delFn (delete function) actually just opens the popup to confirm that this item will be deleted
function ReservaResumo(props: { data: BookingData, editFn: popFn, delFn: popFn }) {

  const reservaList = props.data.rooms.map(
    (item) => {
      return (
        <li key={item.roomNumber}>{item.roomNumber}</li>
      );
    }
  );

  const popSt = {isOpen: true, data: {id: props.data.id}};
  
  return (
    <div className="opcao-reserva">
      <div className="reserva-titulo">
        <h3>Reserva Nº{props.data.id}</h3>
        <div className="flex gap-1">
          <Pencil className="mouse-reaction" onClick={() => props.editFn(popSt)}/>
          <Trash className="mouse-reaction" onClick={() => props.delFn(popSt)} />
        </div>
      </div>

      <div className="flex flex-col items-left">
        <p className="reserva-data">Data: {props.data.date_in.toDateString()} &#x2192; {props.data.date_out.toDateString()}</p>
        <p>Items:</p>
        <ul className="reserva-quarto">
          {reservaList}
        </ul>
      </div>
    </div>
  )
}

// the data of the reservas. when implemented, we will take them from the other pages
// const resumoInitial: BookingContext[] = [
//   {
//     key: 0,
//     title: "Grupo 1",
//     date_in: "26/08/2026",
//     date_out: "29/08/2026",
//     items: ["1 quarto casal", "1 quarto quádruplo"]
//   },
//   {
//     key: 1,
//     title: "Grupo 2",
//     date_in: "26/09/2026",
//     date_out: "29/09/2026",
//     items: ["1 quarto triplo"]
//   }
// ];

export default function Pagamento() {
  // state for the list of reservas
  const [reservas, setReservas] = useOutletContext<UseBookCont>();

  // whether the popup for confirmation of deletion should be open
  // and what item called it
  const [popDelete, setPopDelete] = useState({ isOpen: false, data: {id: 0}} as PopUpState<BookingID>);
  const [popEdit, setPopEdit] = useState({ isOpen: false, data: {id: 0}} as PopUpState<BookingID>);

  // when the user clicks the trash button, remove the element from the list
  const deleteResumo = (isDel: boolean) => {
    if (isDel) {
      setReservas({
        bookings: reservas.bookings.filter((reserva) => reserva.id != popDelete.data.id),
        currentID: reservas.currentID,
      })
    }

    setPopDelete({isOpen: false, data: {id: 0}});
  };

  const editResumo = (isEdit: boolean) => {
    if (isEdit) {
      window.location.href = "quartos";
    }
    setPopEdit({isOpen: false, data: {id: 0}});
  }

  return (
  <>  
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

        <a href="Data" id="maisquartos" className="mouse-reaction">Adicionar mais quartos</a>
      </section>

      <aside>
        <div className="mt-6 lg:mt-8">
          <img className="w-[88px] lg:w-[96px]" src="src/assets/pagamento/carrinho.png" alt="Desenho de um carrinho de supermercado" />
        </div>
        <div>
          <h2>MEU CARRINHO</h2>
        </div>
        <div id="pagamento-lista">
          {reservas.bookings.map((reserva) =>
            <ReservaResumo key={reserva.id} data={reserva} editFn={setPopEdit} delFn={setPopDelete}/>)
          }
        </div>
        <a className="secondary-button mouse-reaction" href="/feedback">CONCLUIR RESERVA</a>
      </aside>

      <PopUp modalState={popDelete.isOpen}>
        <div className="pop-confirm">
          <h2>Você realmente deseja deletar esta reserva?</h2>
          <p className="mb-2">Essa ação não poderá ser desfeita.</p>
          <div className="flex justify-center gap-4">
            <button className="mouse-reaction" onClick={() => deleteResumo(true)}>Deletar</button>
            <button className="mouse-reaction" onClick={() => deleteResumo(false)}>Não deletar</button>
          </div>
        </div>
      </PopUp>
      <PopUp modalState={popEdit.isOpen}>
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
  )
};
