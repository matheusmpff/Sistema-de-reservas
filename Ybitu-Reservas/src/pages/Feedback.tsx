import "../styles/Feedback.css";
import { useState } from "react";
export default function Feedback() {

    const [files, SetFile] = useState(null);
    const [nome, setNome] = useState(null);
    const [email, setEmail] = useState(null);
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [comentario, setComentario] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const inputs = new FormData();

        inputs.append("nome", nome);
        inputs.append("comentario", comentario);
        inputs.append("checkIn",checkIn);
        inputs.append("checkOut", checkOut);
        inputs.append("email",email);
        for (const photo of files) {
            inputs.append("photos", photo);
        }

        const response = await fetch("http://localhost:3000/user/feedback", {
            method: "POST",
            body: inputs
        })
        console.log(response)
    }

    return (

        <>

            <div className="container mx-auto">
                <div className="titulo">Feedback</div>
                <div className="mt-6 lg:mt-12 lg:flex">
                    <div className="p-8 lg:max-w-1/2">
                        <p className="xl:text-lg">Conte para nós como foi passar esse tempo conosco! Seu comentário é muito importante para que possamos
                            aprimorar ainda mais nossos serviços!
                        </p>
                        <p className="mt-4 xl:text-lg">Agradecemos pela confiança durante sua estadia, volte sempre!!</p>
                    </div>
                    <div className="grid_area">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multi" >
                            <div className="grid_element">
                                <label htmlFor="">Nome:</label>
                                <input type="text" id="" className="input_text" onChange={(e) => { setNome(e.target.value) }} placeholder="Insira seu nome" />
                            </div>


                            <div className="grid_element">
                                <label htmlFor="email">E-mail:</label>
                                <input type="email" id="email" onChange={(e)=>{setEmail(e.target.value)}} className="input_text" placeholder="Insira seu e-mail" />
                            </div>

                            <div className="grid_element">
                                <label htmlFor="">Check-in:</label>
                                <input onChange={(e) => { setCheckIn(e.target.value) }} type="date" id="checkIn" className="input_text" placeholder="Insira data que realizou check-in" />
                            </div>

                            <div className="grid_element">
                                <label htmlFor="">Check-out:</label>
                                <input type="date" id="checkOut" onChange={(e) => { setCheckOut(e.target.value) }} className="input_text" placeholder="Insira a data que realizou check-out" />
                            </div>

                            <div className="grid_element">
                                <label htmlFor="comentario">Comentário:</label>
                                <textarea className="area_style" name="" id="comentario" onChange={(e) => { setComentario(e.target.value) }} placeholder="Deixe aqui sua mensagem..."></textarea>
                            </div>
                            <div className="grid_element">
                                <label htmlFor="comentario">Adicione arquivos:</label>
                                <input className="image_button" type="file" onChange={(e) => { SetFile(e.target.files); }} accept="image/*" multiple />
                            </div>


                            <button onClick={handleSubmit} className="btn_primary btn_style">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>

        </>


    );
}
