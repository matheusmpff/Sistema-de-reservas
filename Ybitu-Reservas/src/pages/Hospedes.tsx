// internal components
import { useState } from "react";
import BarraProgresso from "../components/BarraProgresso";

// css
import "../styles/Hospedes.scss";

enum HospedeType {
  Responsavel,
  Adulto,
  Crianca,
}

function HospInput(props: {title: string, iType: string, options?: string[]}) {
  let input_elem = <input type={props.iType}/>;

  if(props.iType == "date") {
    input_elem = <input type={props.iType} max={new Date().toISOString().split("T")[0]} />
  }

  if (props.iType == "select" && props.options != null) {
    const ops = props.options.map((op) => <option value={op.toLocaleLowerCase()}>{op}</option>);
    input_elem = <select id={props.title.toLocaleLowerCase()}>{ops}</select>;
  }

  return(
    <div className="hospede-input">
      <p>{props.title}</p>
      {input_elem}
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
        <HospInput title={"Sexo"} iType={"select"} options={["Masculino", "Feminino"]}/>
      </div>
      <HospInput title={"Telefone"} iType={"tel"}/>
    </main>
  );
}

function AdultoDados() {
  return(
    <main className="hospede-dados">
      <h2>Adulto</h2>
      <HospInput title={"Nome"} iType={"text"}/>
      <HospInput title={"Email"} iType={"email"}/>
      <div className="two-hosp-inputs">
        <HospInput title={"Data de nascimento"} iType={"date"}/>
        <HospInput title={"Sexo"} iType={"select"} options={["Masculino", "Feminino"]}/>
      </div>
      <HospInput title={"Telefone"} iType={"tel"}/>
    </main>
  );
}

function CriancaDados() {
  return(
    <main className="hospede-dados">
      <h2>Criança</h2>
      <HospInput title={"Nome"} iType={"text"}/>
      <div className="two-hosp-inputs">
        <HospInput title={"Data de nascimento"} iType={"date"}/>
        <HospInput title={"Sexo"} iType={"select"} options={["Masculino", "Feminino"]}/>
      </div>
      <HospInput title={"Nome do responsável"} iType={"text"}/>
      <HospInput title={"Telefone do responsável"} iType={"tel"}/>
    </main>
  );
}

export default function Hospedes() {
  const [hospList, setHospList] = useState([HospedeType.Responsavel]);
  const [hospSelected, setHospSelected] = useState(0);

  const hospComp = () => {
    if (hospList[hospSelected] == HospedeType.Responsavel) {
      return <ResponsavelDados />;
    }
    if (hospList[hospSelected] == HospedeType.Adulto) {
      return <AdultoDados />;
    }
    if (hospList[hospSelected] == HospedeType.Crianca) {
      return <CriancaDados />;
    }
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
          {hospComp()}
          <div className="hosp-dados-botao">
            <button onClick={addAdult}>Adicionar adulto</button>
            <button onClick={addChild}>Adicionar criança</button>
          </div>
        </div>

        <div id="hospede-lista">
          {hospList}
        </div>
      </div>
    </>
  )
}
