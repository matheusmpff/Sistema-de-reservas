import { useState, type MouseEvent } from "react";
import "../styles/Contato.css";
import { z } from "zod";
import {IMaskInput} from "react-imask";

export default function ContactForm() {
    const [nome, setNome] = useState("")
    const [telefone, setTelefone] = useState("")
    const [email, setEmail] = useState("")
    const [comentario, setComentario] = useState("")
    const [botao, setBotao] = useState(true)

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        const checkFone = telefone.replaceAll(/[\- ()]/g, "");
        const pattern = z.object({
            nome: z.string().min(2, { error: "O nome deve ter no mínimo 2 caracteres" }).regex(
                /^[A-Za-zÀ-ÖØ-öø-ÿ' ]+$/,
                { error: "O nome contém caracteres inválidos." }
            ).max(50, { error: "O nome pode ter no máximo 50 caracteres" }).trim(),
            email: z.email({ error: "É preciso inserir um e-mail válido" }),
            checkFone: z.e164({error:"Telefone no formato inválido."})

        })

        const resultado = pattern.safeParse({
            nome,
            email,
            checkFone
        })

        if (!resultado.success) {
            alert(resultado.error.issues[0].message)
            return;
        }
        
        setBotao(false);
        const response = await fetch("http://localhost:3000/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: nome,
                userEmail: email,
                userPhone: checkFone,
                userMessage: comentario
            })
        })
        const data = await response.json()
        console.log(data);

        if (response.ok) {
            alert("Mensagem enviada com sucesso");
            window.location.reload();
        }
        else {
            alert("Erro nos dados de envio, tente novamente");
        }

        if (response.ok) {
            alert("Mensagem enviada com sucesso");
            window.location.reload();
        }
        else {
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
                    <input onChange={(e) => { setNome(e.target.value) }} required className="input_contato" type="text" placeholder="Insira o nome" />
                </div>
                <div className="form_element_contato">
                    <label htmlFor="">Telefone</label>
                    <IMaskInput
                        placeholder="Insira seu telefone (Opcional)"
                        className ="input_contato"
                        mask="+55 (00) 00000-0000"
                        value= {telefone}  
                        onAccept = {(valor)=>{setTelefone(valor)}}
                    />
                </div>
                <div className="form_element_contato">
                    <label htmlFor="">E-mail</label>
                    <input onChange={(e) => setEmail(e.target.value)} required className="input_contato" type="text" placeholder="Insira seu e-mail" />
                </div>
                <div className="form_element_contato lg:col-span-2">
                    <label htmlFor="">Mensagem</label>
                    <textarea onChange={handleMessage} required value={comentario} className=" textarea_contato" name="" id="" placeholder="Insira sua mensagem"></textarea>
                </div>
                <div className="form_element_contato">
                    {botao && <button type="submit" className="mt-6 p-3  w-fit primary-button">Enviar mensagem</button>}
                </div>
            </form>
        </>
    );
};
