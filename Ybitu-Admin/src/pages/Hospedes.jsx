"use client"

import { useState, useEffect } from "react"
import { api } from "../hooks/api"

const cores = ["#f472b6","#fb923c","#a78bfa","#34d399","#60a5fa","#facc15","#f87171","#818cf8","#f472b6","#34d399","#fb923c","#60a5fa"]

function iniciais(nome) {
    return nome?.split(" ").slice(0, 2).map(n => n[0]).join("") ?? "?"
}

export default function Hospedes() {
    const [hospedes, setHospedes] = useState([])
    const [loading, setLoading] = useState(true)
    const [busca, setBusca] = useState("")
    const [filtro, setFiltro] = useState("Todos")

    useEffect(() => {
        api.get("/admin/hospedes")
            .then(setHospedes)
            .finally(() => setLoading(false))
    }, [])

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
                <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr] px-5 py-3 bg-black/20 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Hóspede</span><span>Contato</span><span>Tipo</span><span>Responsável</span>
                </div>

                {loading && <p className="px-5 py-6 text-slate-400 text-sm">Carregando...</p>}

                {!loading && filtrados.map((p, i) => {
                    const cor  = cores[i % cores.length]
                    const tipo = p.adulto ? "Adulto" : "Criança"
                    const responsavel = p.crianca?.responsavel?.pessoa?.nome ?? "—"

                    return (
                        <div key={p.id}
                            className="grid grid-cols-[2fr_1.2fr_1fr_1fr] px-5 py-3.5 items-center text-sm border-t border-white/5 hover:bg-white/[0.03] transition-colors">
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
                        </div>
                    )
                })}
            </div>
        </div>
    )
}