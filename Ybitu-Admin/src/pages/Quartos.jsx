"use client"

import { useState, useEffect } from "react"
import { api } from "../hooks/api"
import { alterarStatusQuarto } from "../services/admin"

const statusStyle = {
    OCUPADO:    "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    DISPONIVEL: "bg-green-500/10 text-green-400 border border-green-500/20",
    MANUTENCAO: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
}
const statusLabel = { OCUPADO: "Ocupado", DISPONIVEL: "Disponível", MANUTENCAO: "Manutenção" }

const tipoStyle = {
    DUPLO: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    TRIPLO:     "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    QUADRUPLO:    "bg-amber-500/10 text-amber-400 border border-amber-500/20",
}

export default function Quartos() {
    const [quartos, setQuartos] = useState([])
    const [loading, setLoading] = useState(true)
    const [tipo, setTipo] = useState("Todos")
    const [status, setStatus] = useState("Todos")
    const [busca, setBusca] = useState("")

    async function carregar() {
        setLoading(true)
        try {
            const data = await api.get("/admin/quartos")
            setQuartos(data)
        } finally {
            setLoading(false)
        }
    }

    async function mudarStatus(numeroQuarto, novoStatus) {
        try {
            await alterarStatusQuarto({ numeroQuarto, novoStatus })
            carregar()
        } catch (e) {
            alert(e.message)
        }
    }

    useEffect(() => { carregar() }, [])

    const disponiveis = quartos.filter(q => q.status === "DISPONIVEL").length
    const ocupados    = quartos.filter(q => q.status === "OCUPADO").length
    const manutencao  = quartos.filter(q => q.status === "MANUTENCAO").length
    const taxa        = quartos.length ? Math.round((ocupados / quartos.length) * 100) : 0

    const stats = [
        { label: "Disponíveis",      valor: String(disponiveis), cor: "border-green-500" },
        { label: "Ocupados",         valor: String(ocupados),    cor: "border-blue-500" },
        { label: "Em manutenção",    valor: String(manutencao),  cor: "border-amber-400" },
        { label: "Taxa de ocupação", valor: `${taxa}%`,          cor: "border-purple-500" },
    ]

    const filtrados = quartos
        .filter(q => tipo   === "Todos" || q.tipo   === tipo)
        .filter(q => status === "Todos" || q.status === status)
        .filter(q => !busca || String(q.numero).includes(busca))

    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-2xl font-bold">Quartos da Pousada</p>
                    <p className="text-sm text-slate-400 mt-1">{quartos.length} quartos cadastrados</p>
                </div>
                <div className="flex gap-3">
                    <input type="text" placeholder="🔍  Buscar quarto..." value={busca}
                        onChange={e => setBusca(e.target.value)}
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none w-52 placeholder:text-slate-500" />
                    <select value={tipo} onChange={e => setTipo(e.target.value)}
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option value="Todos">Todos os tipos</option>
                        <option value="DUPLO">Duplo</option>
                        <option value="TRIPLO">Triplo</option>
                        <option value="QUADRUPLO">Quádruplo</option>
                    </select>
                    <select value={status} onChange={e => setStatus(e.target.value)}
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option value="Todos">Todos os status</option>
                        <option value="DISPONIVEL">Disponível</option>
                        <option value="OCUPADO">Ocupado</option>
                        <option value="MANUTENCAO">Manutenção</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
                {stats.map((s) => (
                    <div key={s.label} className={`bg-cor-primaria-escura rounded-xl px-5 py-4 border-l-4 ${s.cor}`}>
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
                        <p className="text-2xl font-bold">{s.valor}</p>
                    </div>
                ))}
            </div>

            <div className="bg-cor-primaria-escura rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[0.5fr_1.2fr_1fr_1fr_1fr_1fr] px-5 py-3 bg-black/20 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>#</span><span>Tipo</span><span>Capacidade</span>
                    <span>Diária</span><span>Status</span><span>Ação</span>
                </div>

                {loading && <p className="px-5 py-6 text-slate-400 text-sm">Carregando...</p>}

                {!loading && filtrados.map((q) => (
                    <div key={q.numero}
                        className="grid grid-cols-[0.5fr_1.2fr_1fr_1fr_1fr_1fr] px-5 py-3.5 items-center text-sm border-t border-white/5 hover:bg-white/[0.03] transition-colors">
                        <span className="font-bold text-slate-500">{q.numero}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md w-fit ${tipoStyle[q.tipo]}`}>{q.tipo}</span>
                        <span>{q.capacidade} pessoa{q.capacidade > 1 ? "s" : ""}</span>
                        <span className="font-semibold text-green-400">R$ {q.diaria}/noite</span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md w-fit ${statusStyle[q.status]}`}>
                            {statusLabel[q.status]}
                        </span>
                        <select
                            value={q.status}
                            onChange={e => mudarStatus(q.numero, e.target.value)}
                            className="bg-cor-primaria-escura border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none w-fit"
                        >
                            <option value="DISPONIVEL">Disponível</option>
                            <option value="OCUPADO">Ocupado</option>
                            <option value="MANUTENCAO">Manutenção</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    )
}