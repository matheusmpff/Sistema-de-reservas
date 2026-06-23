import { useState } from "react";
import { api } from "../hooks/api";
import CadastroImg from "../assets/cadastro.png";

export default function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [dataNasc, setDataNasc] = useState("");
    const [sexo, setSexo] = useState("Outro");
    const [telefone, setTelefone] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const handleCadastro = async (e) => {
        e.preventDefault();
        setErro("");
        setSucesso("");

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        try {
            // Endpoint: POST /user/
            // O backend (createUser em services/User.ts) espera:
            // { nome, email, dataNasc, sexo, telefone, senha }
            // dataNasc e sexo são obrigatórios — inclua os campos no form se precisar.
            // Aqui usamos defaults temporários para os campos opcionais do form atual.
            const res = await api.post("/user/", {
                nome,
                email,
                senha,
                dataNasc: dataNasc || "2000-01-01", // adicione o campo no form
                sexo: sexo || "Outro",               // adicione o campo no form
                telefone: telefone || "",            // adicione o campo no form
            });
            const data = await res.json();

            if (res.ok) {
                setSucesso("Cadastro realizado com sucesso! Redirecionando...");
                setTimeout(() => { window.location.href = "/"; }, 2000);
            } else {
                setErro(data.msg || data.erro || "Erro ao criar conta. Tente novamente.");
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
                    <h1 className="text-4xl md:text-6xl text-start mb-8 md:mb-16 font-sans text-white truncate">
                        ADMIN
                    </h1>

                    <h2 className="text-roxo text-3xl md:text-4xl text-start mb-6">Criar Conta</h2>

                    <form onSubmit={handleCadastro} className="flex flex-col gap-5">
                        {/* Campo Nome */}
                        <div>
                            <input
                                name="nome"
                                type="text"
                                placeholder="Nome Completo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                                className="w-full border-b border-gray-300 py-2 outline-none text-white placeholder-gray-400 bg-transparent focus:border-[#8b7df0] transition-colors"
                            />
                        </div>

                        {/* Campo E-mail */}
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

                        {/* Campo Senha */}
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

                        {/* Campo Confirmar Senha */}
                        <div>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirmar Senha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                required
                                className="w-full border-b border-gray-300 py-2 outline-none text-white placeholder-gray-400 bg-transparent focus:border-[#8b7df0] transition-colors"
                            />
                        </div>

                        {/* Campo Telefone */}
                        <div>
                            <input
                                name="telefone"
                                type="tel"
                                placeholder="Telefone"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                required
                                className="w-full border-b border-gray-300 py-2 outline-none text-white placeholder-gray-400 bg-transparent focus:border-[#8b7df0] transition-colors"
                            />
                        </div>

                        {/* Campo Data de Nascimento */}
                        <div>
                            <input
                                name="dataNasc"
                                type="date"
                                placeholder="Data de nascimento"
                                value={dataNasc}
                                onChange={(e) => setDataNasc(e.target.value)}
                                required
                                className="w-full border-b border-gray-300 py-2 outline-none text-white placeholder-gray-400 bg-transparent focus:border-[#8b7df0] transition-colors"
                            />
                        </div>

                        {/* Campo Sexo */}
                        <div>
                            <select
                                name="sexo"
                                value={sexo}
                                onChange={(e) => setSexo(e.target.value)}
                                className="w-full border-b border-gray-300 py-2 outline-none text-white bg-transparent focus:border-[#8b7df0] transition-colors"
                            >
                                <option value="F" className="text-black">Feminino</option>
                                <option value="M" className="text-black">Masculino</option>
                                <option value="Outro" className="text-black">Outro</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-linear-90 from-verde-destaque to-verde-destaque/30 hover:bg-cor-primaria-escura hover:border hover:border-roxo hover:text-roxo hover:cursor-pointer text-white px-1 py-3 rounded-lg mt-4 mx-auto w-full sm:w-3/5 transition-colors"
                        >
                            {loading ? "Cadastrando..." : "Cadastrar"}
                        </button>

                        {/* Feedback de Erro */}
                        {erro && (
                            <p className="text-center text-red-400 text-sm mt-2">
                                {erro}
                            </p>
                        )}

                        {/* Feedback de Sucesso */}
                        {sucesso && (
                            <p className="text-center text-green-400 text-sm mt-2">
                                {sucesso}
                            </p>
                        )}

                        {/* Link para retornar ao Login */}
                        <div className="text-center mt-4">
                            <a href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
                                Já tem uma conta? <span className="text-verde-destaque font-medium hover:underline">Faça Login</span>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}