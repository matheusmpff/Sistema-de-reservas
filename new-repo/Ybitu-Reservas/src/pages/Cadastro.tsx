import "../styles/Cadastro.css";
import Footer from "../components/Footer.tsx"

export default function Cadastro() {
    return (

        <div className="flex flex-col min-h-screen justify-between">
            <div className="container mx-auto flex flex-col justify-center items-center bg-[#F5F0E6] lg:flex-row lg:justify-between lg:gap-12 xl:gap-0">
                <div className="md:text-xl mt-6 pt-72 flex flex-col items-center  bg-[url('src/assets/cadastro/pousadas.png')] min-w-100 min-h-140 bg-cover bg-center rounded md:min-h-160 md:min-w-120 ">
                    <h2 className="text-white bg-[#1F6F50] px-2 py-0.5">CRIE A SUA CONTA</h2>
                    <p className=" mt-4 text-white ">Registre-se agora para garantir:</p>
                    <ol className="list-decimal">
                        <li className="px-1 py-0.5 text-white bg-[#1F6F50]">Acesso completo as possíveis reservas</li>
                        <li className=" px-1 py-0.5 mt-2 text-white bg-[#1F6F50]">Escolha personalizada dos quartos</li>
                        <li className="px-1 py-0.5 mt-2 text-white bg-[#1F6F50]">Gerenciamento total das reservas</li>
                    </ol>
                </div>
                <div>
                    <div className="mt-8 flex items-center justify-center flex-col ">
                        <h1>FAZER CADASTRO</h1>
                        <p className="max-w-100 md:max-w-120"> Realize seu cadastro para tirar proveito de todos os benefícios de nosso sistema de reserva. </p>
                        <p className="max-w-100 md:max-w-120">Para isso basta indicar um e-mail Google para cadastro rápido e pratico em nosso sistema</p>
                    </div>
                    <div className="bg-[#272623] rounded py-6 px-8 min-w-100">
                        <div><img src="src/assets/logo_branca.png" alt="" width="40" /></div>
                        <form className="grid grid-cols-1 gap-2 mt-4 md:grid-cols-2" action="">

                            <div className="flex flex-col gap-y-2">
                                <label className="text-[#F5F0E6] text-sm font-bold" htmlFor="name">Nome:</label>
                                <input className="bg-[#F5F0E6] rounded py-2 px-2" type="text" id="name" placeholder="Insira seu nome..." />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <label className="text-[#F5F0E6] text-sm font-bold" htmlFor="surname">Sobrenome</label>
                                <input className="bg-[#F5F0E6] rounded py-2 px-2" type="text" id="surname" placeholder="Insira seu sobrenome..." />
                            </div>
                            <div className=" flex flex-col gap-y-2 md:col-span-2">
                                <label className="text-[#F5F0E6] text-sm font-bold" htmlFor="Email">E-mail:</label>
                                <input className="bg-[#F5F0E6] rounded py-2 px-2" type="email" id="Email" placeholder="Insira seu e-mail" />
                            </div>
                            <div className=" flex flex-col gap-y-2 md:col-span-2">
                                <label className="text-[#F5F0E6] text-sm font-bold" htmlFor="senha">Senha:</label>
                                <input className="bg-[#F5F0E6] rounded py-2 px-2" type="password" id="senha" placeholder="Insira sua senha" />
                            </div>

                            <button className="mt-4 bg-[#1F6F50] rounded text-white p-2 min-w-80 md:col-span-2">FAZER CADASTRO</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>


    );
};
