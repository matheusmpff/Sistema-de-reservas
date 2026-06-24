import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { House, UsersRound, Clock, BedDouble, SquarePen, Settings, LogOut, X } from "lucide-react";
import { api } from "../hooks/api";

export default function SideBar() {
    const [menuAberto, setMenuAberto] = useState(false)
    const menuRef = useRef(null)
    const navigate = useNavigate()

    const links = [
        { to: "/home",      label: "Home",      icon: <House /> },
        { to: "/andamento", label: "Andamento", icon: <Clock /> },
        { to: "/quartos",   label: "Quartos",   icon: <BedDouble /> },
        { to: "/hospedes",  label: "Hóspedes",  icon: <UsersRound /> },
        { to: "/feedback",  label: "Feedback",  icon: <SquarePen /> },
    ]

    const animatedLink = "hover:cursor-pointer relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full hover:text-gray-300 transition-colors";

    // fecha o menu ao clicar fora
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAberto(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    async function handleLogout() {
        try {
            await api.post("/user/logout", {})
        } catch {}
        navigate("/")
    }

    return (
        <div className="w-[12%] h-screen flex flex-col justify-between bg-cor-primaria-clara text-offwhite text-xl font-semibold px-4 py-6 rounded-tr-2xl rounded-br-2xl">
            <img src="/logo_branca.png" alt="Logo" className="w-16" />

            <div className="flex flex-col gap-4 w-full">
                {links.map(({ to, label, icon }) => (
                    <div key={to} className="flex flex-row items-center gap-2">
                        {icon}
                        <Link to={to} className={animatedLink}>{label}</Link>
                    </div>
                ))}
            </div>

            {/* Botão de configurações + menu */}
            <div className="relative" ref={menuRef}>

                {menuAberto && (
                    <div className="absolute bottom-12 left-0 w-48 bg-cor-primaria-escura border border-white/10 rounded-xl overflow-hidden shadow-xl">
                        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                            <span className="text-sm text-slate-400">Configurações</span>
                            <button onClick={() => setMenuAberto(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X size={14} />
                            </button>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut size={16} />
                            Sair
                        </button>
                    </div>
                )}

                <button
                    onClick={() => setMenuAberto(v => !v)}
                    className="hover:text-gray-300 hover:cursor-pointer transition-colors"
                >
                    <Settings />
                </button>
            </div>
        </div>
    )
}