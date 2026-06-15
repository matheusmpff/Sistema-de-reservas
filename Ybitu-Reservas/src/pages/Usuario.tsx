import "../styles/Usuario.css";
import { User } from "lucide-react";
import { BedDouble } from "lucide-react";

import { useState } from "react";
import Profile from "../components/Profile";
import MinhasReservas from "../components/MinhasReservas";

export default function Usuario() {
    const [mostrar, setMostrar] = useState(true)
    return (
        <div className="container mx-auto mt-20 flex flex-col md:flex-row min-h-[70vh]">
            <aside className=" min-w-fit flex flex-col items-center" >
                <div className="font-bold text-3xl mb-6">Conta do Usuário</div>
                <div className="flex md:flex-col">
                    <div onClick={() => setMostrar(true)} className={`user_nav_option ${mostrar ? "user_option_activate" : ""}`}>
                        <User size={24} />
                        <p>Usuário</p>
                    </div>
                    <div onClick={() => { setMostrar(false); }} className={`user_nav_option ${!mostrar ? "user_option_activate" : ""} ml-4 md:ml-0 md:mt-4`}>
                        <BedDouble size={24} />
                        <p>Reservas</p>
                    </div>
                </div>

            </aside>
            <div className="w-full px-4 pt-16 ">
                {mostrar && <Profile></Profile>}
                {(!mostrar) && <MinhasReservas />}
            </div>
        </div>

    );
};
