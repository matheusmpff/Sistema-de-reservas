import "../styles/Contato.css";
export default function ContactForm() {    
    return (
        <>
            <form className="form_contato">
                <div className="lg:col-span-2 mb-4"><img src="src/assets/logo_branca.png" alt="" width="50" /></div>
                <div className="form_element_contato">
                    <label htmlFor="">Nome</label>
                    <input className="input_contato" type="text" placeholder="Insira o nome" />
                </div>
                <div className="form_element_contato" >
                    <label htmlFor="">Sobrenome</label>
                    <input className="input_contato" type="text" placeholder="Insira o sobrenome" />
                </div>
                <div className="form_element_contato">
                    <label htmlFor="">Telefone</label>
                    <input className="input_contato" type="text" placeholder="Insira seu telefone" />
                </div>
                <div className="form_element_contato">
                    <label htmlFor="">E-mail</label>
                    <input className="input_contato" type="text" placeholder="Insira seu e-mail" />
                </div>
                <div className="form_element_contato lg:col-span-2">
                    <label htmlFor="">Mensagem</label>
                    <textarea className=" textarea_contato" name="" id="" placeholder="Insira sua mensagem"></textarea>
                </div>
                <div className="form_element_contato">
                    <button className="mt-6 p-3  w-fit btn_primary">Enviar mensagem</button>
                </div>
            </form>
        </>
    );
};
