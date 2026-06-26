import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'


export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const { isLoggedIn, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate("/")
        setMenuOpen(false)
    }

    const animatedLink = "relative hover:cursor-pointer after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-green-800 after:left-0 after:-bottom-1 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300 whitespace-nowrap"

    const publicLinks = [
        { to: "/", label: "Home" },
        { to: "/Reserva/Data", label: "Reserva" },
        { to: "/Contato", label: "Contato" },
    ];

    const authLinks = isLoggedIn
        ? [{ to: "/Usuario", label: "Perfil" }]
        : [{ to: "/Login", label: "Login" }, { to: "/Cadastro", label: "Cadastro" }]

    const allLinks = [...publicLinks, ...authLinks]

    return (
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 lg:px-8 py-4 bg-[var(--cor-background)] shadow-sm">

            <div className="shrink-0">
                <img src={logo} alt="Logo da Pousada Ybitu" />
            </div>

            {/* Nav Desktop */}
            <nav className="hidden lg:flex flex-1 justify-center gap-8 xl:gap-12 text-sm xl:text-md font-semibold px-4">
                {allLinks.map(({ to, label }) => (
                    <Link key={to} to={to} className={animatedLink}>
                        {label}
                    </Link>
                ))}
                {isLoggedIn && (
                    <button onClick={handleLogout} className={animatedLink + " text-red-600 after:bg-red-600"}>
                        Sair
                    </button>
                )}
            </nav>

            {/* Botão Carrinho Desktop */}
           

            {/* Botão Hamburguer */}
            <button
                className="lg:hidden text-black z-50 relative p-1"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Menu Mobile */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute top-full left-0 w-full bg-black/90 flex flex-col items-start gap-5 px-6 py-6 lg:hidden z-50"
                    >
                        

                        {allLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className="text-white text-lg font-medium hover:text-gray-300 transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                {label}
                            </Link>
                        ))}
                        {isLoggedIn && (
                            <button
                                onClick={handleLogout}
                                className="text-red-400 text-lg font-medium hover:text-red-300 transition-colors"
                            >
                                Sair
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
