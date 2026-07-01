// internal components
import { GuestType, hTypeToString, type UseBookCont, type GuestData, type stateOp, toSex, findBooking } from "../types.ts";

import { useState } from "react";
import { Trash } from "lucide-react";

// css
import "../styles/Hospedes.scss";
import { useOutletContext } from "react-router";


function HospInput(props: {title: string, iType: string, field: string | undefined, changeFn: stateOp<string>}) {
  if (props.field == undefined) {
    console.log("erro em HospInput em Hospedes")
    return (<></>);
  }

  let input_elem = <input type={props.iType} value={props.field.toString()} onChange={(e) => props.changeFn(e.target.value)}></input>;

  if(props.iType == "date") {
    // the max value for date is today
    input_elem = (
      <input type={props.iType} max={new Date().toISOString().split("T")[0]} value={props.field.toString()} onChange={(e) => props.changeFn(e.target.value)} />);
  }

  return(
    <div className="hospede-input">
      <p>{props.title}</p>
      {input_elem}
    </div>
  )
}

function HospInputSelect(props: {title: string, options: string[], field: string, changeFn: stateOp<string>}) {
  const ops = props.options.map((op) => <option value={op}>{op}</option>);

  return(
    <div className="hospede-input">
      <label htmlFor={props.title.toLocaleLowerCase()}>{props.title}</label>
      <select id={props.title.toLocaleLowerCase()} value={props.field} onChange={(e) => props.changeFn(e.target.value)}>{ops}</select>
    </div>
  )
}

function handlePhoneNumber(value: string, changeFn: stateOp<GuestData>, data: GuestData) {
  if (value.length < 20 && /^\+(\d*|\d+\(\d*\)?|\d+\(\d+\)\d*\-?\d*)$/g.test(value)) {
    changeFn({ ...data, phoneNumber: value });
    console.log("a");
  }
  return;
}

function ResponsavelDados(props: { data: GuestData, changeFn: stateOp<GuestData> }) {
  return(
    <main className="hospede-dados">
      <h2>Responsável</h2>
      <HospInput title={"Nome"} iType={"text"} field={props.data.name} changeFn={(v) => v}/>
      <HospInput title={"Email"} iType={"email"} field={props.data.email} changeFn={(v) => v}/>
      <div className="two-hosp-inputs">
        <HospInput title={"Data de nascimento"} iType={"date"} field={props.data.birthDate.toISOString().split("T")[0]} changeFn={(v) => v}/>
        <HospInputSelect title={"Sexo"} options={["Masculino", "Feminino"]} field={props.data.sex} changeFn={(v) =>  v}/>
      </div>
      <HospInput title={"Telefone"} iType={"tel"} field={props.data.phoneNumber} changeFn={(v) => v}/>
    </main>
  );
}

function AdultoDados(props: {data: GuestData, changeFn: stateOp<GuestData> }) {
  return(
    <main className="hospede-dados">
      <h2>Adulto</h2>
      <HospInput title={"Nome"} iType={"text"} field={props.data.name} changeFn={(v) => props.changeFn({...props.data, name: v})}/>
      <HospInput title={"Email"} iType={"email"} field={props.data.email} changeFn={(v) => props.changeFn({...props.data, email: v})}/>
      <div className="two-hosp-inputs">
        <HospInput title={"Data de nascimento"} iType={"date"} field={props.data.birthDate.toISOString().split("T")[0]} changeFn={(v) => props.changeFn({...props.data, birthDate: new Date(v)})}/>
        <HospInputSelect title={"Sexo"} options={["Masculino", "Feminino"]} field={props.data.sex} changeFn={(v) => props.changeFn({...props.data, sex: toSex(v)})}/>
      </div>
      <HospInput title={"Telefone"} iType={"tel"} field={props.data.phoneNumber} changeFn={(v) => handlePhoneNumber(v, props.changeFn, props.data)}/>
    </main>
  );
}

function CriancaDados(props: {data: GuestData, changeFn: stateOp<GuestData> }) {
  return(
    <main className="hospede-dados">
      <h2>Criança</h2>
      <HospInput title={"Nome"} iType={"text"} field={props.data.name} changeFn={(v) => props.changeFn({...props.data, name: v})}/>
      <div className="two-hosp-inputs">
        <HospInput title={"Data de nascimento"} iType={"date"} field={props.data.birthDate.toISOString().split("T")[0]} changeFn={(v) => props.changeFn({...props.data, birthDate: new Date(v)})}/>
        <HospInputSelect title={"Sexo"} options={["Masculino", "Feminino"]}  field={props.data.sex} changeFn={(v) => props.changeFn({...props.data, sex: toSex(v)})}/>
      </div>
      <HospInput title={"Nome do responsável"} iType={"text"} field={props.data.parentName} changeFn={(v) => props.changeFn({...props.data, parentName: v})}/>
      <HospInput title={"Telefone do responsável"} iType={"tel"} field={props.data.phoneNumber} changeFn={(v) => props.changeFn({...props.data, phoneNumber: v})}/>
    </main>
  );
}

function HospListItem(props: {hType: GuestType, name: string, selected: boolean, click: stateOp<void>, delFn: stateOp<void>}) {
  let sel = "";
  if (props.selected) {
    sel = " border-4 border-(--cor-primaria)"
  }

  const abc = (e: React.MouseEvent) => {
    props.delFn();
    e.stopPropagation()
  }

  return(
    <li>
      <div onClick={() => props.click()} className={"hosp-list-item" + sel}>
        <div>
          <p className="text-lg font-bold">{hTypeToString(props.hType)}</p>
          <p className="text-base">{props.name}</p>
        </div>
        {props.hType != GuestType.User && <Trash className="mouse-reaction" size={35} onClick={(e) => abc(e)} />}
      </div>
    </li>
  )
}

// return the type of hospede selected
function hospSelDisplay(selected: GuestData, changeFn: stateOp<GuestData>) {
  if (selected.guestType == GuestType.User) {
    return <ResponsavelDados data={selected} changeFn={changeFn}/>;
  }else if (selected.guestType == GuestType.Adult) {
    return <AdultoDados data={selected} changeFn={changeFn} />;
  }else  if (selected.guestType == GuestType.Child) {
    return <CriancaDados data={selected} changeFn={changeFn} />;
  }
}


export default function Hospedes() {
  const [reservas, setReservas] = useOutletContext<UseBookCont>();
  const [hospSelected, setHospSelected] = useState(findBooking(reservas).user.id);

  const hospList = [findBooking(reservas).user].concat(findBooking(reservas).otherGuests);

  function removeHosp(id: string) {
    if (hospSelected == id) {
      setHospSelected(hospList[0].id);
    }

    setReservas({
      currentID: reservas.currentID,
      bookings: reservas.bookings.map((reserva) => {
        if (reserva.id != reservas.currentID) {
          return reserva;
        }

        return {
          ...reserva,
          otherGuests: reserva.otherGuests.filter((guest) => guest.id != id)
        }
      }),
    })
  }

  function hospListDisplay(list: GuestData[]) {
    return list.map((hospede) =>
      <HospListItem key={hospede.id} hType={hospede.guestType} name={hospede.name}
        selected={hospede.id == hospSelected} click={() => setHospSelected(hospede.id)} delFn={() => removeHosp(hospede.id)} />)
  }

  const addChild = () => {
    let id = crypto.randomUUID();
    setReservas({
      currentID: reservas.currentID,
      bookings: reservas.bookings.map((reserva) => {
        if (reserva.id != reservas.currentID) {
          return reserva;
        }

        return {
          ...reserva,
          otherGuests: reserva.otherGuests.concat([{
            id,
            guestType: GuestType.Child,
            name: "",
            sex: "Masculino",
            birthDate: new Date(),
            parentName: "",
            phoneNumber: "+",
          }]),
        }
      }),
    });

    setHospSelected(id);
  }

  const addAdult = () => {
    let id = crypto.randomUUID();
    setReservas({
      currentID: reservas.currentID,
      bookings: reservas.bookings.map((reserva) => {
        if (reserva.id != reservas.currentID) {
          return reserva;
        }

        return {
          ...reserva,
          otherGuests: reserva.otherGuests.concat([{
            id,
            guestType: GuestType.Adult,
            name: "",
            sex: "Masculino",
            birthDate: new Date(),
            email: "",
            phoneNumber: "+",
          }]),
        }
      }),
    });

    setHospSelected(id);
  }

  const changeGuestFn = (data: GuestData) => {
    setReservas({
      currentID: reservas.currentID,
      bookings: reservas.bookings.map((reserva) => {
        if (reserva.id != reservas.currentID) {
          return reserva;
        }

        if (reserva.user.id == data.id) {
          return {...reserva, user: data };
        }

        return {
          ...reserva,
          otherGuests: reserva.otherGuests.map((guest) => {
            if (guest.id == data.id) {
              return data;
            }
            return guest;
          })
        }
      }),
    });
  };

  function findHosp(id: string) {
    let hosp = hospList.find((guest) => guest.id == id);
    if (hosp == undefined) {
      console.log("eita, nao achou em findHosp em Hospedes")
      return hospList[0];
    }
    return hosp;
  }

  return (
    <>
      <h1 className="mb-6">Preencha os dados dos hóspedes:</h1>
      <div id="hospede-div">
        <div id="hospede-main">
          {hospSelDisplay(findHosp(hospSelected), changeGuestFn)}
          <div className="flex justify-evenly py-10 lg:py-6">
              <button className="primary-button h-16 w-40" onClick={addAdult}>Adicionar adulto</button>
            <button className="primary-button h-16 w-40" onClick={addChild}>Adicionar criança</button>
          </div>
        </div>

        <div id="hospede-lista">
          {hospListDisplay(hospList)}
        </div>
      </div>
    </>
  )
}
