import "../styles/Feedback.css";

export default function Feedback() {
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
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid_element">
                                <label htmlFor="">Nome:</label>
                                <input type="text" id="" className="input_text" placeholder="Insira seu nome" />
                            </div>

                            <div className="grid_element">
                                <label htmlFor="email">E-mail:</label>
                                <input type="email" id="email" className="input_text" placeholder="Insira seu e-mail" />
                            </div>

                            <div className="grid_element">
                                <label htmlFor="comentario">Comentário:</label>
                                <textarea className="area_style" name="" id="comentario" placeholder="Deixe aqui sua mensagem..."></textarea>
                            </div>
                            <div className="grid_element">
                                <label htmlFor="comentario">Adicione arquivos:</label>
                                <input className="image_button" type="file" accept="image/*" multiple />
                            </div>


                            <button className="btn_style">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>

        </>


    );
}