import "../styles/Cadastro.css";
import { useState } from "react";
import { validateSignup } from "../validation/validation";
import { IMaskInput } from "react-imask";

export default function Cadastro() {
    const [nomeInput, setNomeInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [senhaInput, setSenhaInput] = useState("");

    const [sexoInput, setSexoInput] = useState("");
    const [dataInput, setDataInput] = useState("");
    const [telInput, setTelInput] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        const checkFone = telInput.replaceAll(/[\- ()]/g, "");
        const resposta = validateSignup({
            nome: nomeInput,
            email: emailInput,
            senha: senhaInput,
            dataNasc: dataInput,
            checkFone,
            sexo: sexoInput
        })

        if (!resposta.success) {
            alert(resposta.error.issues[0].message);
            return;
        }

        const response = await fetch("http://localhost:3000/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nomeInput,
                email: emailInput,
                senha: senhaInput,
                sexo: sexoInput,
                dataNasc: dataInput,
                telefone: telInput
            })
        })
        const data = await response.json()
        // console.log(data);
        if (response.status == 201) {
            window.location.href = "/Login";

        }
        else {
            alert("Erro no cadastro. Tente novamente.")
        }
    }

    return (


        <div className="flex flex-col">
            <div className="main_container">
                <div className="esquerda">
                    <h2 className="text-white bg-[var(--cor-primaria)] px-2 py-0.5">CRIE A SUA CONTA</h2>
                    <p className=" mt-5 mb-3 text-white ">Registre-se agora para garantir:</p>
                    <ol className="list-decimal">
                        <li className="li_style">Acesso completo as possíveis reservas</li>
                        <li className="li_style mt-2">Escolha personalizada dos quartos</li>
                        <li className="li_style mt-2">Gerenciamento total das reservas</li>
                    </ol>
                </div>
                <div>
                    <div className="titulo ">
                        <div className="font-bold text-4xl">FAZER CADASTRO</div>
                        <p className="text-lg mt-4 max-w-100 md:max-w-120 lg:mt-8">Realize seu cadastro para tirar proveito de todos os benefícios de nosso sistema de reserva. </p>
                        <p className="text-lg mt-3 mb-9 max-w-100 md:max-w-120">Para isso basta indicar as informações no formulário abaixo:</p>
                    </div>
                    <div className="formulario">
                        <div><img src="src/assets/logo_branca.png" alt="" width="40" /></div>
                        <form className="form_grid" action="">

                            <div className="grid_element">
                                <label className="label_style" htmlFor="name">Nome:</label>
                                <input className="input_style" onChange={(e) => { setNomeInput(e.target.value) }} type="text" id="name" placeholder="Insira seu nome..." />
                            </div>
                            <div className="grid_element">
                                <label className="label_style" htmlFor="datanasc">Data de nascimento:</label>
                                <input className="input_style" onChange={(e) => { setDataInput(e.target.value) }} type="date" id="datanasc" placeholder="Insira sua data de nascimento..." />
                            </div>
                            <div className=" grid_element ">
                                <label className="label_style" htmlFor="Email">E-mail:</label>
                                <input className="input_style" onChange={(e) => { setEmailInput(e.target.value) }} type="email" id="Email" placeholder="Insira seu e-mail..." />
                            </div>

                            <div className=" grid_element ">
                                <label className="label_style" htmlFor="senha">Senha:</label>
                                <input className="input_style" onChange={(e) => { setSenhaInput(e.target.value) }} type="password" id="senha" placeholder="Insira sua senha..." />
                            </div>

                            <div className=" grid_element ">
                                <label className="label_style text-black" htmlFor="sexo">Masculino/Feminino:</label>
                                <select onChange={(e) => { setSexoInput(e.target.value) }} className="input_style">
                                    <option value="Escolha uma opção">Escolha uma opção...</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                </select>
                            </div>
                            <div className=" grid_element ">
                                <label className="label_style" htmlFor="tel">Telefone:</label>
                                <IMaskInput
                                    placeholder="Insira seu telefone"
                                    className="input_style"
                                    mask="+55 (00) 00000-0000"
                                    value={telInput}
                                    onAccept={(valor) => { setTelInput(valor) }}
                                />
                            </div>

                            <button onClick={handleSubmit} className="primary-button btn_style">FAZER CADASTRO</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>


    );
};
