import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { House, UsersRound, Clock, BedDouble, SquarePen, Settings, LogOut, KeyRound, Eye, EyeOff, X } from "lucide-react";
import { api, apiJson } from "../hooks/api";

export default function SideBar() {
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);
    const [modalSenha, setModalSenha] = useState(false);
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmSenha, setConfirmSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erroSenha, setErroSenha] = useState("");
    const [sucessoSenha, setSucessoSenha] = useState("");
    const [salvandoSenha, setSalvandoSenha] = useState(false);
    const menuRef = useRef(null);

    const links = [
        { to: "/home", label: "Home", icon: <House /> },
        { to: "/andamento", label: "Andamento", icon: <Clock /> },
        { to: "/quartos", label: "Quartos", icon: <BedDouble /> },
        { to: "/hospedes", label: "Hospedes", icon: <UsersRound /> },
        { to: "/feedback", label: "Feedback", icon: <SquarePen /> },
    ];

    const animatedLink = "hover:cursor-pointer relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full hover:text-gray-300 transition-colors";

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    async function handleAlterarSenha(e) {
        e.preventDefault();
        setErroSenha(""); setSucessoSenha("");
        if (novaSenha !== confirmSenha) { setErroSenha("As senhas nao coincidem."); return; }
        if (novaSenha.length < 6) { setErroSenha("A nova senha deve ter ao menos 6 caracteres."); return; }
        setSalvandoSenha(true);
        try {
            const res = await api.patch("/user/senha", { senhaAtual, novaSenha });
            await apiJson(res);
            setSucessoSenha("Senha alterada com sucesso!");
            setSenhaAtual(""); setNovaSenha(""); setConfirmSenha("");
            setTimeout(() => { setModalSenha(false); setSucessoSenha(""); }, 1800);
        } catch (e) {
            setErroSenha(e.message);
        } finally {
            setSalvandoSenha(false);
        }
    }

    function abrirModalSenha() {
        setMenuAberto(false);
        setErroSenha(""); setSucessoSenha("");
        setSenhaAtual(""); setNovaSenha(""); setConfirmSenha("");
        setModalSenha(true);
    }

    return (
        <>
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

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuAberto(v => !v)}
                        className={"hover:text-gray-300 hover:cursor-pointer transition-colors p-1 rounded-lg " + (menuAberto ? "text-gray-300 bg-white/10" : "")}
                        title="Configuracoes"
                    >
                        <Settings />
                    </button>

                    {menuAberto && (
                        <div className="absolute bottom-10 left-0 w-52 bg-cor-primaria-escura border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                            <div className="px-4 py-2.5 border-b border-white/10">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Conta</p>
                            </div>

                            <button
                                onClick={abrirModalSenha}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 transition-colors text-left"
                            >
                                <KeyRound size={15} className="text-slate-400" />
                                Alterar senha
                            </button>

                            <div className="border-t border-white/10 mt-1 mb-1" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                            >
                                <LogOut size={15} />
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {modalSenha && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-cor-primaria-escura rounded-2xl p-8 w-full max-w-sm relative">
                        <button
                            onClick={() => setModalSenha(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                        <h2 className="text-xl font-bold mb-6">Alterar Senha</h2>
                        <form onSubmit={handleAlterarSenha} className="flex flex-col gap-4">
                            <label className="flex flex-col gap-1 text-sm text-slate-300">
                                Senha atual
                                <div className="relative">
                                    <input
                                        type={mostrarSenha ? "text" : "password"}
                                        required
                                        value={senhaAtual}
                                        onChange={e => setSenhaAtual(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none pr-10"
                                    />
                                    <button type="button" onClick={() => setMostrarSenha(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                                        {mostrarSenha ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </label>
                            <label className="flex flex-col gap-1 text-sm text-slate-300">
                                Nova senha
                                <input type="password" required value={novaSenha}
                                    onChange={e => setNovaSenha(e.target.value)}
                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
                            </label>
                            <label className="flex flex-col gap-1 text-sm text-slate-300">
                                Confirmar nova senha
                                <input type="password" required value={confirmSenha}
                                    onChange={e => setConfirmSenha(e.target.value)}
                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
                            </label>

                            {erroSenha && <p className="text-red-400 text-sm">{erroSenha}</p>}
                            {sucessoSenha && <p className="text-green-400 text-sm">{sucessoSenha}</p>}

                            <div className="flex gap-3 mt-2">
                                <button type="button" onClick={() => setModalSenha(false)}
                                    className="flex-1 py-2 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={salvandoSenha}
                                    className="flex-1 py-2 rounded-lg bg-verde-destaque/90 text-white text-sm font-semibold hover:bg-verde-destaque disabled:opacity-60">
                                    {salvandoSenha ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}