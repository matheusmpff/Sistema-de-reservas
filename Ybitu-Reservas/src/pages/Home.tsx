import "../styles/Home.css";
import { Award } from "lucide-react";
import { Star } from "lucide-react";
import { Infinity } from "lucide-react";
import { ArrowRight } from "lucide-react";
import BotaoVerde from "../components/BotaoVerde";
import { Link } from "react-router";
import ContactForm from "../components/ContactForm";

export default function Home() {
    return (
        <div className="container mx-auto">
            <div className="overflow-hidden flex flex-col lg:flex-row relative mt-12">
                <div className="xl:ml-20 2xl:ml-30 flex flex-col justify-center items-center p-6 md:p-12">
                    <div className="text-6xl text-center text-(--cor-terciaria)">Pousada</div>
                    <div className="text-9xl text-center text-(--cor-primaria)">YBITU</div>
                    <p className="mt-12 text-md max-w-120">
                        Localizada em São Miguel do Gostoso, disponibilizamos uma equipe pronta para proporcionar os
                        melhores serviços para sua família
                    </p >
                    <p className="mt-6 text-md">Nossa meta principal é fornecer:</p>
                    <div className="mt-6 ">
                        <div className="topics" >
                            <Award className="icons"></Award>
                            <p className="icon_text">Melhor experiência</p>
                        </div>
                        <div className="topics" >
                            <Star className="icons"></Star>
                            <p className="icon_text">Atendimento de qualidade</p>
                        </div>
                        <div className="topics" >
                            <Infinity className="icons"></Infinity>
                            <p className="icon_text">Momentos inesquecíveis</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className=" grid_div">
                        <div className="bg-[url('src/assets/home/1.png')] grid_element_home img1_position"></div>
                        <div className="bg-[url('src/assets/home/2.png')] grid_element_home img2_position"></div>
                        <div className="bg-[url('src/assets/home/3.png')] grid_element_home img3_position"></div>
                        <div className="bg-[url('src/assets/home/4.png')] grid_element_home img4_position"></div>
                        <div className="bg-[url('src/assets/home/5.png')] grid_element_home img5_position"></div>
                    </div>
                    <Link to="/Pousada">
                        <div className="mt-10">
                            <BotaoVerde text="VENHA CONHECER MAIS"  icon={<ArrowRight className="ml-2"></ArrowRight>} ></BotaoVerde>
                        </div>
                    </Link>
                </div>

            </div>

            <div className="flex flex-col mt-20 mr-4 ml-4">
                <div className="title_section">Nossa Pousada</div>
                <div className="home_description">
                    <div className="bg-[url('src/assets/home/quartos.png')] home_description_img"></div>
                    <div className="mt-4">
                        <p className="text-2xl font-semibold">Quartos Disponiveis</p>
                        <p className="mt-4 max-w-145">
                            Temos variados tipos de quartos arrumados da melhor forma possível para atender suas necessidades.
                            Acesse agora a sessão de reservas para visualizar todas as opções disponíveis.
                        </p>
                        <div className="flex justify-end">
                            <Link to="/Reserva/Data">
                                <button className="btn_reserva">
                                    VERIFICAR RESERVAS
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className=" home_description mt-8">
                    <div className="bg-[url('src/assets/home/refeicao.png')] home_description_img"></div>
                    <div className="mt-4">
                        <p className="text-2xl font-semibold" >Café da Manhã Incluso</p>
                        <p className="mt-4 max-w-145">
                            Proporcionamos uma refeição robusta de café da manhã para nossos hóspedes, trazendo grande
                            variedade de opções. Conheça agora as opções de reservas disponíveis!
                        </p>
                        <div className="flex justify-end ">
                            <Link to="/Reserva/Data">
                                <button className="btn_reserva">
                                    VERIFICAR RESERVAS
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="home_description mt-8">
                    <div className="bg-[url('src/assets/home/vista.png')] home_description_img"></div>
                    <div className="mt-4">
                        <p className="text-2xl font-semibold">Excelente Localização</p>
                        <p className="mt-4 max-w-145">
                            A poucos metros da praia, a localização da pousada proporciona vistas incríveis, como também, conforto e comodidade
                            aos hóspedes.
                        </p>
                        <p className="mt-2 max-w-145">
                            A pousada Ybitu é a melhor escolha para quem quer aproveitar a praia e os benefícios
                            da pousada durante a estadia. Clique no botão abaixo para iniciar sua reserva!
                        </p>
                        <div className="flex justify-end">
                            <Link to="/Reserva/Data">
                                <button className="btn_reserva">
                                    VERIFICAR RESERVAS
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 mb-12">
                <div className="title_section mt-12">Contato</div>
                <div className="flex flex-col lg:flex-row justify-center items-center">
                    <div className="lg:mr-10">
                        <div className="text-3xl font-bold mb-10 ">Estamos a disposição para ajudar</div>
                        <p className="max-w-150">Se alguma duvida persistir, entre em contato conosco!Estamos disponíveis para te atender e sanar todas as suas perguntas!!</p>
                        <p className="mt-4 max-w-150"> Acesse nossa pagina de contatos para ficar por dentro de todas as opções de comunicação disponíveis.</p>
                        <Link to="/Contato">
                            <button className="btn_reserva mx-auto mb-12">
                               PÁGINA DE CONTATO
                            </button>
                        </Link>
                    </div>
                    <ContactForm></ContactForm> 

                </div>
            </div>

        </div>
    );
};
