import React from "react";
import { Link } from "react-router";
import { House, UsersRound, Clock, BedDouble, SquarePen, Settings } from "lucide-react";

export default function SideBar() {

    const links = [
        { to: "/home", label: "Home", icon: <House /> },
        { to: "/andamento", label: "Andamento", icon: <Clock /> },
        { to: "/quartos", label: "Quartos", icon: <BedDouble /> },
        { to: "/hospedes", label: "Hóspedes", icon: <UsersRound /> },
        { to: "/feedback", label: "Feedback", icon: <SquarePen /> },
    ]

    const animatedLink = "hover:cursor-pointer relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full hover:text-gray-300 transition-colors";

    return (
        <div className="w-[12%] h-screen flex flex-col justify-between bg-cor-primaria-clara text-offwhite text-xl font-semibold px-4 py-6 rounded-tr-2xl rounded-br-2xl">
            <img src="sua-logo.png" alt="Logo" />

            <div className="flex flex-col gap-4 w-full">
                {links.map(({ to, label, icon }) => (
                    <div key={to} className="flex flex-row items-center gap-2">
                        {icon}
                        <Link to={to} className={animatedLink}>{label}</Link>
                    </div>
                ))}
            </div>

            {/* Renderizando o componente Settings corretamente */}
            <button className="hover:text-gray-300 hover:cursor-pointer transition-colors">
                <Settings />
            </button>
        </div>
    )
}