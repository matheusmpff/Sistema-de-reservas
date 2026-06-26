import { useState, type MouseEvent } from "react";
import "../styles/Contato.css";

export default function ContactForm() {
    const [nome, setNome] = useState("")
    const [telefone, setTelefone] = useState("+")
    const [email, setEmail] = useState("")
    const [comentario, setComentario] = useState("")
    const [botao, setBotao] = useState(true)

    const handleContactSubmit = async (e) => {
        e.preventDefault();

        setBotao(false);
        const response = await fetch("http://localhost:3000/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: nome,
                userEmail: email,
                userPhone: telefone.replaceAll(/[\- ()]/g, ""),
                userMessage: comentario
            })
        })
        const data =  await response.json()
        console.log(data);

        if(response.ok){
            alert("Mensagem enviada com sucesso");
            window.location.reload();
        }
        else{
            alert("Erro nos dados de envio, tente novamente");
        }
        
        if(response.ok){
            alert("Mensagem enviada com sucesso");
            window.location.reload();
        }
        else{
            alert("Erro nos dados de envio, tente novamente");
        }
    }

    const handlePhone = async (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        e.preventDefault();
        let phone = e.target.value
        if (phone.length < 255 && phone.at(0) === "+") {
            setTelefone(e.target.value);
        }
    }

    const handleMessage = async (e: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => {
        e.preventDefault();
        if (e.target.value.length < 255) {
            setComentario(e.target.value);
        }
    }

    return (
        <>
            <form className="form_contato" onSubmit={handleContactSubmit}>
                <div className="lg:col-span-2 mb-4"><img src="src/assets/logo_branca.png" alt="" width="50" /></div>
                <div className="form_element_contato lg:col-span-2">
                    <label htmlFor="">Nome</label>
                    <input onChange={(e)=>{setNome(e.target.value)}} required className="input_contato" type="text" placeholder="Insira o nome" />
                </div>
                <div className="form_element_contato">
                    <label htmlFor="">Telefone</label>
                    <input onChange={handlePhone} value={telefone} required className="input_contato" type="text" placeholder="Insira seu telefone" />
                </div>
                <div className="form_element_contato">
                    <label htmlFor="">E-mail</label>
                    <input onChange={(e)=>setEmail(e.target.value)} required className="input_contato" type="text" placeholder="Insira seu e-mail" />
                </div>
                <div className="form_element_contato lg:col-span-2">
                    <label htmlFor="">Mensagem</label>
                    <textarea onChange={handleMessage} required value={comentario} className=" textarea_contato" name="" id="" placeholder="Insira sua mensagem"></textarea>
                </div>
                <div className="form_element_contato">
                    {botao&&<button type="submit" className="mt-6 p-3  w-fit btn_primary">Enviar mensagem</button>}
                </div>
            </form>
        </>
    );
};
