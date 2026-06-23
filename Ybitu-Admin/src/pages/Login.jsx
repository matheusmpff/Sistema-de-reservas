import { useState } from "react";
import { api } from "../hooks/api";
import CadastroImg from "../assets/cadastro.png";
import { Link } from "react-router";
import Cadastro from "./Cadastro.jsx";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    const handleLogin = async (e) => {
        // Impede o recarregamento da página
        e.preventDefault();
        setErro("");
        setLoading(true);

        try {
            const res = await api.post("/login", { userEmail: email, userSenha: senha });
            const data = await res.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                window.location.href = "/home";
            } else {
                setErro("Email ou Senha inválidos");
            }
        } catch (err) {
            setErro("Erro ao conectar com o servidor. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen md:h-screen w-full md:overflow-hidden">

            {/* Imagem (Some no celular, aparece no PC) */}
            <div className="hidden md:block md:h-full md:w-1/2 bg-black shrink-0 shadow-inner relative">
                <img
                    src={CadastroImg}
                    alt="foto da frente da pousada"
                    className="w-full h-full object-cover object-top block shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]"
                />
                <div className="absolute w-full inset-0 shadow-[0_20px_20px_rgba(0,0,0,0.5)] pointer-events-none"></div>
            </div>

            {/* Formulário */}
            <div className="w-full md:w-1/2 grow bg-cinza flex flex-col justify-center items-center p-8 py-12 md:py-8 overflow-x-hidden">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl md:text-6xl text-start mb-12 md:mb-24 font-sans text-white truncate">
                        ADMIN
                    </h1>

                    <h2 className="text-roxo text-3xl md:text-4xl text-start mb-1">Log In</h2>

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        <div>
                            <input
                                name="email"
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border-b border-gray-300 py-2 outline-none text-white placeholder-gray-400 bg-transparent focus:border-[#8b7df0] transition-colors"
                            />
                        </div>

                        <div>
                            <input
                                name="password"
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                className="w-full border-b border-gray-300 py-2 outline-none text-white placeholder-gray-400 bg-transparent focus:border-[#8b7df0] transition-colors"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs mt-1 gap-4 sm:gap-0">
                            <label className="flex items-center gap-2 text-white cursor-pointer">
                                <input type="checkbox" className="accent-verde-destaque" />
                                Relembrar usuário?
                            </label>
                            <Link to={"/cadastro"}>Cadastre-se</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-linear-90 from-verde-destaque to-verde-destaque/30 hover:bg-cor-primaria-escura hover:border hover:border-roxo hover:text-roxo hover:cursor-pointer text-white px-1 py-3 rounded-lg mt-4 mx-auto w-full sm:w-3/5 transition-colors"
                        >
                            {loading ? "Entrando..." : "Login"}
                        </button>

                        {erro && (
                            <p className="text-center text-red-400">
                                {erro}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}