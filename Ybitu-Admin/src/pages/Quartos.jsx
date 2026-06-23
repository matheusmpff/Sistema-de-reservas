"use client"

import { useState, useEffect, useMemo } from "react"
import { api, apiJson } from "../hooks/api"

// Enums do schema
const TIPO_LABEL = { DUPLO: "Duplo", TRIPLO: "Triplo", QUADRUPLO: "Quádruplo" }
const STATUS_LABEL = { DISPONIVEL: "Disponível", OCUPADO: "Ocupado", MANUTENCAO: "Manutenção" }

const statusStyle = {
    DISPONIVEL: "bg-green-500/10 text-green-400 border border-green-500/20",
    OCUPADO: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    MANUTENCAO: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
}
const tipoStyle = {
    DUPLO: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    TRIPLO: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    QUADRUPLO: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
}

export default function Quartos() {
    const [quartos, setQuartos] = useState([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState("")
    const [busca, setBusca] = useState("")
    const [filtroTipo, setFiltroTipo] = useState("Todos")
    const [filtroStatus, setFiltroStatus] = useState("Todos")

    // Modal de novo quarto
    const [modalAberto, setModalAberto] = useState(false)
    const [novoQuarto, setNovoQuarto] = useState({ numero: "", tipo: "DUPLO", capacidade: "", status: "DISPONIVEL" })
    const [salvando, setSalvando] = useState(false)

    async function carregarQuartos() {
        setLoading(true)
        setErro("")
        try {
            const res = await api.get("/quartos")
            setQuartos(await apiJson(res))
        } catch (e) {
            setErro(e.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { carregarQuartos() }, [])

    async function mudarStatus(numero, status) {
        try {
            const res = await api.patch(`/quartos/${numero}/status`, { status })
            await apiJson(res)
            carregarQuartos()
        } catch (e) {
            alert("Erro ao atualizar status: " + e.message)
        }
    }

    async function deletarQuarto(numero) {
        if (!confirm(`Excluir o quarto ${numero}?`)) return
        try {
            await api.delete(`/quartos/${numero}`)
            carregarQuartos()
        } catch (e) {
            alert("Erro ao excluir: " + e.message)
        }
    }

    async function criarQuarto(e) {
        e.preventDefault()
        setSalvando(true)
        try {
            const res = await api.post("/quartos", {
                numero: Number(novoQuarto.numero),
                tipo: novoQuarto.tipo,
                capacidade: Number(novoQuarto.capacidade),
                status: novoQuarto.status,
            })
            await apiJson(res)
            setModalAberto(false)
            setNovoQuarto({ numero: "", tipo: "DUPLO", capacidade: "", status: "DISPONIVEL" })
            carregarQuartos()
        } catch (e) {
            alert("Erro ao criar quarto: " + e.message)
        } finally {
            setSalvando(false)
        }
    }

    const filtrados = useMemo(() => quartos
        .filter(q => filtroTipo === "Todos" || q.tipo === filtroTipo)
        .filter(q => filtroStatus === "Todos" || q.status === filtroStatus)
        .filter(q => busca === "" || String(q.numero).includes(busca))
    , [quartos, filtroTipo, filtroStatus, busca])

    const stats = [
        { label: "Disponíveis",     valor: quartos.filter(q => q.status === "DISPONIVEL").length,  cor: "border-green-500" },
        { label: "Ocupados",        valor: quartos.filter(q => q.status === "OCUPADO").length,      cor: "border-blue-500" },
        { label: "Em manutenção",   valor: quartos.filter(q => q.status === "MANUTENCAO").length,   cor: "border-amber-400" },
        { label: "Taxa de ocupação",
          valor: quartos.length ? `${Math.round(quartos.filter(q=>q.status==="OCUPADO").length/quartos.length*100)}%` : "—",
          cor: "border-purple-500" },
    ]

    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-2xl font-bold">Quartos da Pousada</p>
                    <p className="text-sm text-slate-400 mt-1">{quartos.length} quartos cadastrados</p>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="🔍  Buscar número..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none w-40 placeholder:text-slate-500"
                    />
                    <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option value="Todos">Todos os tipos</option>
                        {Object.entries(TIPO_LABEL).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option value="Todos">Todos os status</option>
                        {Object.entries(STATUS_LABEL).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <button
                        onClick={() => setModalAberto(true)}
                        className="bg-verde-destaque/90 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-verde-destaque transition-colors">
                        + Novo quarto
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                {stats.map(s => (
                    <div key={s.label} className={`bg-cor-primaria-escura rounded-xl px-5 py-4 border-l-4 ${s.cor}`}>
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
                        <p className="text-2xl font-bold">{s.valor}</p>
                    </div>
                ))}
            </div>

            {erro && <p className="text-red-400 mb-4">{erro} <button onClick={carregarQuartos} className="underline ml-2">Tentar novamente</button></p>}
            {loading && <p className="text-slate-400">Carregando...</p>}

            {!loading && !erro && (
                <div className="bg-cor-primaria-escura rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] px-5 py-3 bg-black/20 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span>#</span><span>Tipo</span><span>Capacidade</span><span>Status</span><span>Mudar status</span><span>Ação</span>
                    </div>
                    {filtrados.length === 0 && (
                        <p className="px-5 py-6 text-slate-400 text-sm">Nenhum quarto encontrado.</p>
                    )}
                    {filtrados.map(q => (
                        <div key={q.numero}
                            className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] px-5 py-3.5 items-center text-sm border-t border-white/5 hover:bg-white/[0.03] transition-colors">
                            <span className="font-bold text-slate-400">{q.numero}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-block w-fit ${tipoStyle[q.tipo]}`}>
                                {TIPO_LABEL[q.tipo] ?? q.tipo}
                            </span>
                            <span>{q.capacidade} pessoa{q.capacidade > 1 ? "s" : ""}</span>
                            <span>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${statusStyle[q.status]}`}>
                                    {STATUS_LABEL[q.status] ?? q.status}
                                </span>
                            </span>
                            <select
                                defaultValue={q.status}
                                onChange={e => mudarStatus(q.numero, e.target.value)}
                                className="bg-cor-primaria-escura border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none w-fit">
                                {Object.entries(STATUS_LABEL).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                            <button
                                onClick={() => deletarQuarto(q.numero)}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors w-fit">
                                Excluir
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal novo quarto */}
            {modalAberto && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-cor-primaria-escura rounded-2xl p-8 w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-6">Novo Quarto</h2>
                        <form onSubmit={criarQuarto} className="flex flex-col gap-4">
                            <label className="flex flex-col gap-1 text-sm text-slate-300">
                                Número
                                <input type="number" required value={novoQuarto.numero}
                                    onChange={e => setNovoQuarto({...novoQuarto, numero: e.target.value})}
                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
                            </label>
                            <label className="flex flex-col gap-1 text-sm text-slate-300">
                                Tipo
                                <select value={novoQuarto.tipo}
                                    onChange={e => setNovoQuarto({...novoQuarto, tipo: e.target.value})}
                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none">
                                    {Object.entries(TIPO_LABEL).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                                </select>
                            </label>
                            <label className="flex flex-col gap-1 text-sm text-slate-300">
                                Capacidade
                                <input type="number" min={1} required value={novoQuarto.capacidade}
                                    onChange={e => setNovoQuarto({...novoQuarto, capacidade: e.target.value})}
                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
                            </label>
                            <label className="flex flex-col gap-1 text-sm text-slate-300">
                                Status inicial
                                <select value={novoQuarto.status}
                                    onChange={e => setNovoQuarto({...novoQuarto, status: e.target.value})}
                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none">
                                    {Object.entries(STATUS_LABEL).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                                </select>
                            </label>
                            <div className="flex gap-3 mt-2">
                                <button type="button" onClick={() => setModalAberto(false)}
                                    className="flex-1 py-2 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={salvando}
                                    className="flex-1 py-2 rounded-lg bg-verde-destaque/90 text-white text-sm font-semibold hover:bg-verde-destaque disabled:opacity-60">
                                    {salvando ? "Salvando..." : "Criar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
