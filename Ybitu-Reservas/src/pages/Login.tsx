import "../styles/style.scss"
import { Link } from "react-router"

export default function Login() {

    const checks = [
        "Gerencie suas reservas",
        "Altere datas ou opções de quartos",
        "Cancele a qualquer momento"
    ]

    return (
        <>
            <LoginForm checks = {checks}/>
        </>
    )
}

function LoginForm ({checks}: {checks: string[]}) {
    return (
        <main className="h-[80vh] flex flex-col items-center justify-center bg-[var(--cor-background)] p-4 md:py-32 ">
            
            {/* Container Principal */}
            <div className="w-full max-w-md md:max-w-4xl flex flex-col gap-4 md:gap-0 md:flex-row-reverse rounded-2xl overflow-hidden shadow-lg md:h-full bg-[var(--cor-background)]">
                
                {/* LADO DO LOGIN (Card da Esquerda no Desktop devido ao flex-row-reverse) */}
                <div className="w-full h-6/12 md:h-full md:w-1/2 bg-[var(--cor-terciaria)] text-white p-8 lg:p-12 flex flex-col justify-between items-center gap-8 md:rounded-none rounded-b-2xl">
                    
                    {/* Título - Mantém o topo alinhado */}
                    <h1 className="text-3xl lg:text-6xl font-bold tracking-wide uppercase">LOGIN</h1>
                    
                    {/* Formulário/Conteúdo Central */}
                    <div className="w-full flex-1 flex flex-col justify-center max-w-xs gap-4">
                        <div className="flex flex-col w-full gap-1">
                            <span className="text-sm font-medium text-white/80 ml-1">E-mail</span>
                            <input 
                                type="email" 
                                placeholder="Insira seu email" 
                                className="bg-white px-4 py-3 rounded-xl text-black outline-none focus:ring-2 focus:ring-[var(--cor-primaria)] transition-all"
                            />
                        </div>
                        <button className="w-full py-3 rounded-xl bg-[var(--cor-primaria)] font-semibold hover:opacity-90 transition-opacity mt-4">
                            Fazer Login
                        </button>
                    </div>

                    {/* Link do Rodapé */}
                    <Link to="/Cadastro" className="text-center text-white/60 hover:text-white transition-colors text-sm">
                        Cadastre-se gratuitamente
                    </Link>
                </div>

                {/* LADO DAS RESERVAS */}
                <div className="w-full h-6/12 md:h-full md:w-1/2 bg-[var(--cor-primaria)] text-white p-8 lg:p-12 flex flex-col justify-between items-center gap-8 md:rounded-none rounded-t-2xl">
                    
                    {/* Título - Alinhado perfeitamente com o do Login */}
                    <h2 className="text-3xl lg:text-6xl font-bold tracking-wide uppercase">RESERVAS</h2>
                    
                    {/* Checklist Centralizado Verticalmente */}
                    <div className="w-full flex-1 flex flex-col justify-center max-w-xs gap-5">
                        {checks.map((check, index) => (
                            <div key={index} className="flex flex-row items-start gap-3">
                                <span className="text-[var(--cor-secundaria)] text-xl font-bold leading-none">✓</span>
                                <p className="text-base lg:text-lg font-medium leading-tight">{check}</p>
                            </div>
                        ))}
                    </div>

                    {/* Espaçador invisível no desktop para espelhar o Link de cadastro e manter o alinhamento perfeito do meio */}
                    <div className="hidden md:block h-[20px]"></div>
                </div>

            </div>
        </main>
    )
}
