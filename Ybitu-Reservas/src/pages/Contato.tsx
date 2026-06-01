
import "../styles/Contato.css";
import { MapPin } from "lucide-react";
import { MailOpen } from "lucide-react";
import ContactForm from "../components/ContactForm";

export default function Contato() {
    return (
        <div className="container mx-auto mt-10">
            <div className="main_img adjust_items">
                <p className="text-sm">HOME - CONTATO</p>
                <div className="font-semibold text-2xl md:text-3xl lg:text-5xl">ENTRE EM CONTATO</div>
            </div>

            <div className="mt-20 grid mx-auto grid-cols-1 grid-rows-3 gap-6  min:w-8/10 lg:grid-cols-3 lg:grid-rows-1 2xl:w-9/11">
                
                <div className="grid_element_contato">
                    <MapPin className="text-[var(--cor-background)]"></MapPin>
                    <div className="font-bold text-lg mt-4" >Endereço</div>
                    <p className="mt-1 text-[var(--cor-background)]">Av. dos Arrecifes, São Miguel do Gostoso - RN, 59585-000</p>
                </div>
                <div className="grid_element_contato">
                    <img src="src/assets/whatsicon.png" alt="" width="24" />
                    <div className="font-bold text-lg mt-4">Whatsapp</div>
                    <p className="mt-1 text-[var(--cor-background)]">(81) 99850-9213</p>
                </div>
                <div className="grid_element_contato">
                    <MailOpen className="text-[var(--cor-background)]"></MailOpen>
                    <div className="font-bold text-lg mt-4">Nosso E-mail</div>
                    <p className="mt-1 text-[var(--cor-background)]">pousadaybitu@gmail.com</p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-12 mt-20  lg:flex-row min:w-8/10 2xl:w-9/11 mx-auto">
                <ContactForm></ContactForm>
                <iframe className="rounded md:w-150 md:h-112.5" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.889238753968!2d-35.640369899999996!3d-5.1215455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7b40db3d528c1af%3A0x816761b11b5ac5ff!2sPousada%20Ybitu%20RN!5e0!3m2!1spt-BR!2sbr!4v1779457982913!5m2!1spt-BR!2sbr" width="400" height="275"  loading="lazy"></iframe>
            </div>
        </div>
    );
};
