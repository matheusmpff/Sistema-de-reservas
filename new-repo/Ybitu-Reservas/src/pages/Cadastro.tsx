import "../styles/Cadastro.css";
import Footer from "../components/Footer.tsx"

export default function Cadastro() {
    return (

        <div className="flex flex-col min-h-screen justify-between">
            <div className="main_container">
                <div className="esquerda">
                    <h2 className="text-white bg-[#1F6F50] px-2 py-0.5">CRIE A SUA CONTA</h2>
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
                        <p className=" mt-4 max-w-100 md:max-w-120 lg:mt-8">Realize seu cadastro para tirar proveito de todos os benefícios de nosso sistema de reserva. </p>
                        <p className=" mt-3 mb-9 max-w-100 md:max-w-120">Para isso basta indicar as informações no formulário abaixo:</p>
                    </div>
                    <div className="formulario">
                        <div><img src="src/assets/logo_branca.png" alt="" width="40" /></div>
                        <form className="form_grid" action="">

                            <div className="grid_element">
                                <label className="label_style" htmlFor="name">Nome:</label>
                                <input className="input_style" type="text" id="name" placeholder="Insira seu nome..." />
                            </div>
                            <div className="grid_element">
                                <label className="label_style" htmlFor="surname">Sobrenome</label>
                                <input className="input_style" type="text" id="surname" placeholder="Insira seu sobrenome..." />
                            </div>
                            <div className=" grid_element md:col-span-2">
                                <label className="label_style" htmlFor="Email">E-mail:</label>
                                <input className="input_style" type="email" id="Email" placeholder="Insira seu e-mail" />
                            </div>
                            <div className=" grid_element md:col-span-2">
                                <label className="label_style" htmlFor="senha">Senha:</label>
                                <input className="input_style" type="password" id="senha" placeholder="Insira sua senha" />
                            </div>

                            <button className="btn_style">FAZER CADASTRO</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>


    );
};
