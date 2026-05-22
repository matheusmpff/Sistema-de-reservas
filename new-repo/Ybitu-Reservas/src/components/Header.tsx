import { useState } from 'react'
import { Link } from 'react-router'
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png'
import seta from '../assets/seta_carrinho.svg'

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    //const [isLoggedIn, setIsLoggedIn] = useState(false)  Vamos usar na implementação do backend, mas por enquanto não tem funçãos

    const animatedLink = "relative hover:cursor-pointer after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-green-800 after:left-0 after:-bottom-1 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300"

    const cartButtonClasses = "hidden lg:flex flex-row items-center justify-between hover:cursor-pointer bg-green-800 text-white font-bold py-4 px-8 rounded-lg mr-8 relative overflow-hidden group transition-colors duration-300 hover:bg-green-700"
    const cartIconClasses = "bg-amber-300 w-[30%] aspect-square rounded-sm z-10 flex items-center justify-center"

    const links = [
        {to: "/", label: "Home"},
        { to: "/Pousada", label: "Pousada" },
        { to: "/Passeios", label: "Passeios" },
        { to: "/Contato", label: "Contato" }, 
        { to : "/Login", label: "Login"},
        { to: "/Cadastro", label: "Cadastro"}
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4 bg-[var(--cor-background)] shadow-sm">
            <div className="ml-8">
                <img src={logo} alt="Logo da Pousada Ybitu" />
            </div>
            
            <nav className="hidden lg:flex w-[80%] justify-center gap-16 text-md font-semibold">
                {links.map(({to, label}) => (
                    <Link key={to} to={to} className={animatedLink}>
                        {label}
                    </Link>
                ))}
            </nav>
            
            <button className={cartButtonClasses}>
                <div className="absolute inset-0 w-1/2 h-full bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-[200%] transition-transform duration-500 ease-out z-0"></div>
                <span className={cartIconClasses}>
                    <img src={seta} alt="Ícone do carrinho de compras" className="w-full h-6 z-0" />
                </span>
                <span className="relative z-10">VER CARRINHO</span>
            </button>

            {/* Botão hamburguer */}
            <button
                className="lg:hidden text-black z-50 relative"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* AnimatePresence envolve o menu condicional */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div 
                        // Animação do menu dropdown
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }} 
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute top-full left-0 w-full bg-black/90 flex flex-col items-start gap-5 px-6 py-6 lg:hidden z-50"
                    >
                        <button className="flex items-center justify-between w-full bg-green-800 text-white font-bold py-4 px-8 rounded-lg mb-4">
                            <span className="bg-amber-300 w-[15%] aspect-square rounded-sm flex items-center justify-center">
                                <img src={seta} alt="Ícone do carrinho de compras" className="w-full h-6" />
                            </span>
                            <span>VER CARRINHO</span>
                        </button>

                        {links.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className="text-white text-lg font-medium hover:text-gray-300 transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                {label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}