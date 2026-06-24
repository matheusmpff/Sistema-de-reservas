"use client"

import { useState, useEffect } from "react"
import { api } from "../hooks/api"
import { alterarHospedeDados, promoverHospede } from "../services/admin"

const cores = ["#f472b6","#fb923c","#a78bfa","#34d399","#60a5fa","#facc15","#f87171","#818cf8","#f472b6","#34d399","#fb923c","#60a5fa"]

function iniciais(nome) {
    return nome?.split(" ").slice(0, 2).map(n => n[0]).join("") ?? "?"
}

const FORM_EDICAO_VAZIO  = { nome: "", email: "", telefone: "", sexo: "", dataNasc: "" }
const FORM_PROMOCAO_VAZIO = { email: "", telefone: "" }

export default function Hospedes() {
    const [hospedes,   setHospedes]   = useState([])
    const [loading,    setLoading]    = useState(true)
    const [busca,      setBusca]      = useState("")
    const [filtro,     setFiltro]     = useState("Todos")

    const [modalEdicao,   setModalEdicao]   = useState(null)
    const [modalPromocao, setModalPromocao] = useState(null)
    const [formEdicao,    setFormEdicao]    = useState(FORM_EDICAO_VAZIO)
    const [formPromocao,  setFormPromocao]  = useState(FORM_PROMOCAO_VAZIO)
    const [salvando,   setSalvando]   = useState(false)
    const [erroModal,  setErroModal]  = useState("")

    async function carregar() {
        setLoading(true)
        try { setHospedes(await api.get("/admin/hospedes")) }
        finally { setLoading(false) }
    }

    function abrirEdicao(p) {
        setErroModal("")
        setFormEdicao({
            nome:     p.nome            ?? "",
            email:    p.adulto?.email   ?? "",
            telefone: p.adulto?.telefone ?? "",
            sexo:     p.sexo            ?? "",
            dataNasc: p.dataNasc ? new Date(p.dataNasc).toISOString().slice(0, 10) : "",
        })
        setModalEdicao(p)
    }

    function abrirPromocao(p) {
        setErroModal("")
        setFormPromocao(FORM_PROMOCAO_VAZIO)
        setModalPromocao(p)
    }

    async function salvarEdicao() {
        setSalvando(true)
        setErroModal("")
        try {
            await alterarHospedeDados({
                idPessoa: modalEdicao.id,
                ...(formEdicao.nome     && { nome:     formEdicao.nome }),
                ...(formEdicao.email    && { email:    formEdicao.email }),
                ...(formEdicao.telefone && { telefone: formEdicao.telefone }),
                ...(formEdicao.sexo     && { sexo:     formEdicao.sexo }),
                ...(formEdicao.dataNasc && { dataNasc: formEdicao.dataNasc }),
            })
            setModalEdicao(null)
            carregar()
        } catch (e) {
            setErroModal(e.message)
        } finally {
            setSalvando(false)
        }
    }

    async function salvarPromocao() {
        setSalvando(true)
        setErroModal("")
        try {
            await promoverHospede({
                idPessoa: modalPromocao.id,
                email:    formPromocao.email,
                telefone: formPromocao.telefone,
            })
            setModalPromocao(null)
            carregar()
        } catch (e) {
            setErroModal(e.message)
        } finally {
            setSalvando(false)
        }
    }

    useEffect(() => { carregar() }, [])

    const total    = hospedes.length
    const adultos  = hospedes.filter(p => p.adulto).length
    const criancas = hospedes.filter(p => p.crianca).length

    const stats = [
        { label: "Total cadastrados", valor: String(total),    cor: "border-blue-500" },
        { label: "Adultos",           valor: String(adultos),  cor: "border-green-500" },
        { label: "Crianças",          valor: String(criancas), cor: "border-purple-500" },
    ]

    const filtrados = hospedes
        .filter(p => filtro === "Todos" || (filtro === "Adultos" ? p.adulto : p.crianca))
        .filter(p => !busca || p.nome?.toLowerCase().includes(busca.toLowerCase()))

    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-2xl font-bold">Hóspedes Cadastrados</p>
                    <p className="text-sm text-slate-400 mt-1">{total} hóspedes no total</p>
                </div>
                <div className="flex gap-3">
                    <input type="text" placeholder="🔍  Buscar hóspede..." value={busca}
                        onChange={e => setBusca(e.target.value)}
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none w-56 placeholder:text-slate-500" />
                    <select value={filtro} onChange={e => setFiltro(e.target.value)}
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option>Todos</option>
                        <option>Adultos</option>
                        <option>Crianças</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                {stats.map(s => (
                    <div key={s.label} className={`bg-cor-primaria-escura rounded-xl px-5 py-4 border-l-4 ${s.cor}`}>
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
                        <p className="text-2xl font-bold">{s.valor}</p>
                    </div>
                ))}
            </div>

            <div className="bg-cor-primaria-escura rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr] px-5 py-3 bg-black/20 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Hóspede</span><span>Contato</span><span>Tipo</span><span>Responsável</span><span>Ações</span>
                </div>

                {loading && <p className="px-5 py-6 text-slate-400 text-sm">Carregando...</p>}

                {!loading && filtrados.map((p, i) => {
                    const cor         = cores[i % cores.length]
                    const tipo        = p.adulto ? "Adulto" : "Criança"
                    const responsavel = p.crianca?.responsavel?.pessoa?.nome ?? "—"

                    return (
                        <div key={p.id}
                            className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr] px-5 py-3.5 items-center text-sm border-t border-white/5 hover:bg-white/[0.03] transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{ background: `${cor}22`, color: cor }}>
                                    {iniciais(p.nome)}
                                </div>
                                <div>
                                    <p className="font-medium">{p.nome}</p>
                                    {p.adulto?.email && <p className="text-xs text-slate-400">{p.adulto.email}</p>}
                                </div>
                            </div>

                            <span className="text-xs text-slate-400">{p.adulto?.telefone ?? "—"}</span>

                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md w-fit ${tipo === "Adulto" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"}`}>
                                {tipo}
                            </span>

                            <span className="text-xs text-slate-400">{responsavel}</span>

                            <div className="flex gap-2">
                                <button onClick={() => abrirEdicao(p)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                                    Editar
                                </button>
                                {tipo === "Criança" && (
                                    <button onClick={() => abrirPromocao(p)}
                                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
                                        Promover
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modal edição */}
            {modalEdicao && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-cor-primaria-escura rounded-2xl p-8 w-full max-w-md flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Editar Hóspede</h2>
                            <button onClick={() => setModalEdicao(null)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                        </div>

                        {[
                            { label: "Nome",      key: "nome",     type: "text" },
                            { label: "Email",     key: "email",    type: "email" },
                            { label: "Telefone",  key: "telefone", type: "text" },
                            { label: "Nascimento",key: "dataNasc", type: "date" },
                        ].map(({ label, key, type }) => (
                            <label key={key} className="flex flex-col gap-1 text-sm text-slate-300">
                                {label}
                                <input type={type} value={formEdicao[key]}
                                    onChange={e => setFormEdicao({ ...formEdicao, [key]: e.target.value })}
                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
                            </label>
                        ))}

                        <label className="flex flex-col gap-1 text-sm text-slate-300">
                            Sexo
                            <select value={formEdicao.sexo}
                                onChange={e => setFormEdicao({ ...formEdicao, sexo: e.target.value })}
                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none">
                                <option value="">Não informar</option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                                <option value="O">Outro</option>
                            </select>
                        </label>

                        {erroModal && <p className="text-red-400 text-sm">{erroModal}</p>}

                        <div className="flex gap-3 mt-2">
                            <button onClick={() => setModalEdicao(null)}
                                className="flex-1 py-2 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5">
                                Cancelar
                            </button>
                            <button onClick={salvarEdicao} disabled={salvando}
                                className="flex-1 py-2 rounded-lg bg-verde-destaque/90 text-white text-sm font-semibold hover:bg-verde-destaque disabled:opacity-60">
                                {salvando ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal promoção */}
            {modalPromocao && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-cor-primaria-escura rounded-2xl p-8 w-full max-w-md flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Promover para Adulto</h2>
                            <button onClick={() => setModalPromocao(null)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                        </div>

                        <p className="text-sm text-slate-400">
                            Informe os dados de contato de <strong className="text-white">{modalPromocao.nome}</strong>.
                        </p>

                        <label className="flex flex-col gap-1 text-sm text-slate-300">
                            Email
                            <input type="email" value={formPromocao.email}
                                onChange={e => setFormPromocao({ ...formPromocao, email: e.target.value })}
                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
                        </label>

                        <label className="flex flex-col gap-1 text-sm text-slate-300">
                            Telefone
                            <input type="text" value={formPromocao.telefone}
                                onChange={e => setFormPromocao({ ...formPromocao, telefone: e.target.value })}
                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
                        </label>

                        {erroModal && <p className="text-red-400 text-sm">{erroModal}</p>}

                        <div className="flex gap-3 mt-2">
                            <button onClick={() => setModalPromocao(null)}
                                className="flex-1 py-2 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5">
                                Cancelar
                            </button>
                            <button onClick={salvarPromocao} disabled={salvando || !formPromocao.email || !formPromocao.telefone}
                                className="flex-1 py-2 rounded-lg bg-verde-destaque/90 text-white text-sm font-semibold hover:bg-verde-destaque disabled:opacity-60">
                                {salvando ? "Salvando..." : "Promover"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}