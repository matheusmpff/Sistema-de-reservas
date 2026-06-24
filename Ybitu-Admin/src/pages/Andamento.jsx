"use client"

import { useState, useEffect } from "react"
import { api } from "../hooks/api"
import { alterarStatusReserva } from "../services/admin"

const cores = ["#f472b6","#fb923c","#a78bfa","#34d399","#60a5fa","#facc15","#f87171","#818cf8"]

const STATUS_OPTIONS = ["EM_ANALISE","PAGO","IN","OUT","CANCELADO"]
const statusLabel    = { EM_ANALISE:"Em análise", CONFIRMADO:"Confirmado", PAGO:"Pago", IN:"Hospedado", OUT:"Check-out", CANCELADO:"Cancelado" }
const statusColor    = { EM_ANALISE:"text-yellow-400", CONFIRMADO:"text-blue-400", PAGO:"text-green-400", IN:"text-cyan-400", OUT:"text-slate-400", CANCELADO:"text-red-400" }

function iniciais(nome) {
    return nome?.split(" ").slice(0, 2).map(n => n[0]).join("") ?? "?"
}
function fmt(d) {
    return d ? new Date(d).toLocaleDateString("pt-BR") : "—"
}
function totalDias(checkIn, checkOut) {
    return Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
}
function diasRestantes(checkIn, checkOut) {
    const inicio = new Date() < new Date(checkIn) ? new Date(checkIn) : new Date()
    const diff = new Date(checkOut) - inicio
    return Math.max(0, Math.ceil(diff / 86400000))
}
function barColor(rest, total) {
    const pct = rest / total
    if (pct > 0.6) return "bg-green-500"
    if (pct > 0.3) return "bg-amber-400"
    return "bg-red-500"
}

export default function Andamento() {
    const [reservas, setReservas] = useState([])
    const [loading, setLoading]   = useState(true)
    const [busca, setBusca]       = useState("")

    async function carregar() {
        setLoading(true)
        try { setReservas(await api.get("/admin/reservas")) }
        finally { setLoading(false) }
    }

    async function mudarStatus(idUser, dataReserva, novoStatus) {
        try {
            await alterarStatusReserva({ idUser, dataReserva, novoStatus })
            carregar()
        } catch (e) { alert(e.message) }
    }

    useEffect(() => { carregar() }, [])

    const ativas = reservas.filter(r => !["CANCELADO","OUT"].includes(r.status))

    const receita  = ativas.reduce((acc, r) => acc + (r.valor ?? 0), 0)
    const pendente = ativas.filter(r => r.status === "EM_ANALISE").reduce((acc, r) => acc + (r.valor ?? 0), 0)
    const quartos  = new Set(ativas.flatMap(r => r.reservaQuartos?.Quartos?.map(q => q.numero) ?? [])).size

    const stats = [
        { label: "Reservas ativas",    valor: String(ativas.length),                        cor: "border-blue-500" },
        { label: "Quartos ocupados",   valor: String(quartos),                              cor: "border-green-500" },
        { label: "Receita em curso",   valor: `R$ ${receita.toLocaleString("pt-BR")}`,      cor: "border-amber-400" },
        { label: "Pendente a receber", valor: `R$ ${pendente.toLocaleString("pt-BR")}`,     cor: "border-purple-500" },
    ]

    const filtradas = ativas.filter(r => {
        if (!busca) return true
        const nome   = r.user?.adulto?.pessoa?.nome?.toLowerCase() ?? ""
        const quarto = String(r.reservaQuartos?.Quartos?.[0]?.numero ?? "")
        return nome.includes(busca.toLowerCase()) || quarto.includes(busca)
    })

    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-2xl font-bold">Reservas em Andamento</p>
                    <p className="text-sm text-slate-400 mt-1">{ativas.length} hóspedes ativos agora</p>
                </div>
                <input
                    type="text" placeholder="🔍  Buscar hóspede ou quarto..."
                    value={busca} onChange={e => setBusca(e.target.value)}
                    className="bg-cor-primaria-escura border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none w-64 placeholder:text-slate-500"
                />
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
                {stats.map(s => (
                    <div key={s.label} className={`bg-cor-primaria-escura rounded-xl px-5 py-4 border-l-4 ${s.cor}`}>
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
                        <p className="text-2xl font-bold">{s.valor}</p>
                    </div>
                ))}
            </div>

            <div className="bg-cor-primaria-escura rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr_1.4fr_1.2fr] px-5 py-3 bg-black/20 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Hóspede</span><span>Quarto</span><span>Check-in</span>
                    <span>Check-out</span><span>Dias rest.</span><span>Status</span><span>Alterar status</span>
                </div>

                {loading && <p className="px-5 py-6 text-slate-400 text-sm">Carregando...</p>}

                {!loading && filtradas.map((r, i) => {
                    const nome      = r.user?.adulto?.pessoa?.nome ?? "—"
                    const qtdPessoas = r.numPessoas ?? 1
                    const quarto    = r.reservaQuartos?.Quartos?.[0]?.numero ?? "—"
                    const tipo      = r.reservaQuartos?.Quartos?.[0]?.tipo ?? ""
                    const total     = totalDias(r.checkIn, r.checkOut)
                    const rest      = diasRestantes(r.checkIn, r.checkOut)
                    const pct       = Math.min(100, Math.round((rest / total) * 100))
                    const cor       = cores[i % cores.length]

                    return (
                        <div key={`${r.idUser}-${r.dataReserva}`}
                            className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr_1.4fr_1.2fr] px-5 py-3.5 items-center text-sm border-t border-white/5 hover:bg-white/3 transition-colors">

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                    style={{ background: `${cor}22`, color: cor }}>
                                    {iniciais(nome)}
                                </div>
                                <div>
                                    <p className="font-medium">{nome}</p>
                                    <p className="text-xs text-slate-400">{qtdPessoas} pessoa{qtdPessoas > 1 ? "s" : ""}</p>
                                </div>
                            </div>

                            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
                                {quarto}{tipo ? ` — ${tipo}` : ""}
                            </span>

                            <span>{fmt(r.checkIn)}</span>
                            <span>{fmt(r.checkOut)}</span>

                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-slate-400">{rest} de {total}</span>
                                <div className="w-[80%] bg-slate-700 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full ${barColor(rest, total)}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>

                            <span className={`font-semibold text-sm ${statusColor[r.status]}`}>
                                {statusLabel[r.status] ?? r.status}
                            </span>

                            <select
                                value={r.status}
                                onChange={e => mudarStatus(r.idUser, r.dataReserva, e.target.value)}
                                className="bg-cor-primaria-escura border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none w-fit"
                            >
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
                            </select>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}