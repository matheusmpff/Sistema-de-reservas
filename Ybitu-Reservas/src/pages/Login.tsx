import { useState } from "react"
import "../styles/style.scss"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"

export default function Login() {
    const checks = [
        "Gerencie suas reservas",
        "Altere datas ou opções de quartos",
        "Cancele a qualquer momento"
    ]

    return (
        <>
            <LoginForm checks={checks} />
        </>
    )
}

function LoginForm({ checks }: { checks: string[] }) {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [emailInput, setEmailInput] = useState("")
    const [senhaInput, setSenhaInput] = useState("")
    const [erro, setErro] = useState("")

    const handleLogin = async (e: React.MouseEvent) => {
        e.preventDefault()

        if (!emailInput || !senhaInput) {
            setErro("Preencha e-mail e senha.")
            return
        }

        const response = await fetch("http://localhost:3000/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                email: emailInput,
                senha: senhaInput
            })
        })

        const data = await response.json()
        console.log(data)
        console.log(data.nome)

        if (data.msg === "Login realizado com sucesso") {
            login(data.nome)
            navigate("/Usuario")
        } else {
            setErro("E-mail ou senha inválidos.")
        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--cor-background)] px-4 py-12">

            <div className="w-full max-w-md md:max-w-4xl flex flex-col gap-3 md:gap-0 md:flex-row-reverse md:rounded-2xl md:overflow-hidden md:shadow-xl">

                {/* LADO DO LOGIN */}
                <div className="w-full md:w-1/2 bg-[var(--cor-terciaria)] text-white p-8 lg:p-12 flex flex-col justify-between items-center gap-6 rounded-2xl md:rounded-none shadow-lg md:shadow-none min-h-[320px] md:min-h-[480px]">

                    <h1 className="text-3xl lg:text-6xl font-bold tracking-wide uppercase">LOGIN</h1>

                    <div className="w-full flex-1 flex flex-col justify-center max-w-xs gap-4">
                        <div className="flex flex-col w-full gap-1">
                            <span className="text-sm font-medium text-white/80 ml-1">E-mail</span>
                            <input
                                type="email"
                                placeholder="Insira seu email"
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="bg-white px-4 py-3 rounded-xl text-black outline-none focus:ring-2 focus:ring-[var(--cor-primaria)] transition-all"
                            />
                        </div>
                        <div className="flex flex-col w-full gap-1">
                            <span className="text-sm font-medium text-white/80 ml-1">Senha</span>
                            <input
                                type="password"
                                placeholder="Insira sua senha"
                                onChange={(e) => setSenhaInput(e.target.value)}
                                className="bg-white px-4 py-3 rounded-xl text-black outline-none focus:ring-2 focus:ring-[var(--cor-primaria)] transition-all"
                            />
                        </div>

                        {erro && (
                            <p className="text-red-300 text-sm text-center">{erro}</p>
                        )}

                        <button
                            onClick={handleLogin}
                            className="w-full py-3 rounded-xl bg-[var(--cor-primaria)] font-semibold hover:opacity-90 transition-opacity mt-2"
                        >
                            Fazer Login
                        </button>
                    </div>

                    <Link to="/Cadastro" className="text-center text-white/60 hover:text-white transition-colors text-sm">
                        Cadastre-se gratuitamente
                    </Link>
                </div>

                {/* LADO DAS RESERVAS */}
                <div className="w-full md:w-1/2 bg-[var(--cor-primaria)] text-white p-8 lg:p-12 flex flex-col justify-between items-center gap-6 rounded-2xl md:rounded-none shadow-lg md:shadow-none min-h-[260px] md:min-h-[480px]">

                    <h2 className="text-3xl lg:text-6xl font-bold tracking-wide uppercase">RESERVAS</h2>

                    <div className="w-full flex-1 flex flex-col justify-center max-w-xs gap-5">
                        {checks.map((check, index) => (
                            <div key={index} className="flex flex-row items-start gap-3">
                                <span className="text-[var(--cor-secundaria)] text-xl font-bold leading-none">✓</span>
                                <p className="text-base lg:text-lg font-medium leading-tight">{check}</p>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block h-[20px]" />
                </div>

            </div>
        </main>
    )
}