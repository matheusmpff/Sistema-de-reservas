// internal components
import BarraProgresso from "../components/BarraProgresso";
import { HospedeType, hTypeToString, type stateOp } from "../types.ts";

import { useState } from "react";
import { Trash } from "lucide-react";

// css
import "../styles/Hospedes.scss";


function HospInput(props: {title: string, iType: string, options?: string[]}) {
  let input_elem = <input type={props.iType} />;

  if(props.iType == "date") {
    // the max value for date is today
    input_elem = <input type={props.iType} max={new Date().toISOString().split("T")[0]} />
  }

  return(
    <div className="hospede-input">
      <p>{props.title}</p>
      {input_elem}
    </div>
  )
}

function HospInputSelect(props: {title: string, options: string[]}) {
  const ops = props.options.map((op) => <option value={op.toLocaleLowerCase()}>{op}</option>);

  return(
    <div className="hospede-input">
      <p>{props.title}</p>
      <select id={props.title.toLocaleLowerCase()}>{ops}</select>
    </div>
  )
}

function ResponsavelDados() {
  return(
    <main className="hospede-dados">
      <h2>Responsável</h2>
      <HospInput title={"Nome"} iType={"text"}/>
      <HospInput title={"Email"} iType={"email"}/>
      <div className="two-hosp-inputs">
        <HospInput title={"Data de nascimento"} iType={"date"}/>
        <HospInputSelect title={"Sexo"} options={["Masculino", "Feminino"]}/>
      </div>
      <HospInput title={"Telefone"} iType={"tel"}/>
    </main>
  );
}

function AdultoDados() {
  return(
    <main className="hospede-dados">
      <h2>Adulto</h2>
      <HospInput title={"Nome"} iType={"text"} />
      <HospInput title={"Email"} iType={"email"} />
      <div className="two-hosp-inputs">
        <HospInput title={"Data de nascimento"} iType={"date"} />
        <HospInputSelect title={"Sexo"} options={["Masculino", "Feminino"]} />
      </div>
      <HospInput title={"Telefone"} iType={"tel"} />
    </main>
  );
}

function CriancaDados() {
  return(
    <main className="hospede-dados">
      <h2>Criança</h2>
      <HospInput title={"Nome"} iType={"text"} />
      <div className="two-hosp-inputs">
        <HospInput title={"Data de nascimento"} iType={"date"} />
        <HospInputSelect title={"Sexo"} options={["Masculino", "Feminino"]} />
      </div>
      <HospInput title={"Nome do responsável"} iType={"text"} />
      <HospInput title={"Telefone do responsável"} iType={"tel"} />
    </main>
  );
}

function HospListItem(props: {hType: HospedeType, name: string, selected: boolean, click: stateOp<void>, delFn: stateOp<void>}) {
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
        <h3>{hTypeToString(props.hType)}</h3>
        <p>{props.name}</p>
        {props.hType != HospedeType.Responsavel && <Trash className="mouse-reaction" onClick={(e) => abc(e)} />}
      </div>
    </li>
  )
}

// return the type of hospede selected
function hospSelDisplay(selected: HospedeType) {
  if (selected == HospedeType.Responsavel) {
    return <ResponsavelDados />;
  }
  if (selected == HospedeType.Adulto) {
    return <AdultoDados />;
  }
  if (selected == HospedeType.Crianca) {
    return <CriancaDados />;
  }
}

export default function Hospedes() {
  const [hospList, setHospList] = useState([HospedeType.Responsavel] as HospedeType[]);
  const [hospSelected, setHospSelected] = useState(0);

  function removeHosp(index: number) {
    if (hospSelected == index) {
      setHospSelected(hospSelected - 1)
    }

    setHospList(hospList.filter((_, i) => i != index));
  }

  function hospListDisplay(list: HospedeType[]) {
    return list.map((hospede, i) =>
      <HospListItem key={i} hType={hospede} name="a" selected={i == hospSelected} click={() => setHospSelected(i)} delFn={() => removeHosp(i)} />)
  }

  const addChild = () => {
    setHospList(hospList.concat([HospedeType.Crianca]));
    setHospSelected(hospSelected + 1);
  }

  const addAdult = () => {
    setHospList(hospList.concat([HospedeType.Adulto]));
    setHospSelected(hospSelected + 1);
  }

  return (
    <>
      <BarraProgresso step={2} />

      <h1 className="mb-6">Preencha os dados dos hóspedes:</h1>
      <div id="hospede-div">
        <div id="hospede-main">
          {hospSelDisplay(hospList[hospSelected])}
          <div className="flex justify-evenly py-10">
            <button onClick={addAdult}>Adicionar adulto</button>
            <button onClick={addChild}>Adicionar criança</button>
          </div>
        </div>

        <div id="hospede-lista">
          {hospListDisplay(hospList)}
        </div>
      </div>
    </>
  )
}
