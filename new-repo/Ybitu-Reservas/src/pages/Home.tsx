import "../styles/Home.css";
import { Award } from "lucide-react";
import { Star } from "lucide-react";
import { Infinity } from "lucide-react";
import { ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <div className="container mx-auto h-screen">
            <div className="overflow-hidden flex flex-col lg:flex-row relative mt-12">
                <div className="xl:ml-20 2xl:ml-30 flex flex-col justify-center items-center p-6 md:p-12">
                    <div className="text-6xl text-center text-[var(--cor-terciaria)]">Pousada</div>
                    <div className="text-9xl text-center text-[var(--cor-primaria)]">YBITU</div>
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
                        <div className="bg-[url('src/assets/home/1.png')] grid_element img1_position"></div>
                        <div className="bg-[url('src/assets/home/2.png')] grid_element img2_position"></div>
                        <div className="bg-[url('src/assets/home/3.png')] grid_element img3_position"></div>
                        <div className="bg-[url('src/assets/home/4.png')] grid_element img4_position"></div>
                        <div className="bg-[url('src/assets/home/5.png')] grid_element img5_position"></div>
                    </div>
                    <button className="mt-10 lg:mt-0 font-semibold flex bg-[var(--cor-primaria)] py-5 rounded px-5 text-[var(--cor-background)]">
                        VENHA CONHECER MAIS
                        <ArrowRight className="ml-2"></ArrowRight>
                    </button>
                </div>

            </div>

            
        </div>
    );
};
