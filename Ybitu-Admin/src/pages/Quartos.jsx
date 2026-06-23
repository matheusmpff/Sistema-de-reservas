"use client"

import { useState } from "react"

const quartos = [
    { num: "101", nome: "Quarto Vista Mar", tipo: "Duplo", cap: 2, diaria: 280, status: "ocupado", comods: "📺 🛁 ❄️", limpeza: "Hoje 08:00" },
    { num: "102", nome: "Quarto Jardim", tipo: "Duplo", cap: 2, diaria: 260, status: "disponível", comods: "📺 ❄️", limpeza: "Hoje 08:30" },
    { num: "103", nome: "Quarto Família", tipo: "Duplo", cap: 4, diaria: 380, status: "ocupado", comods: "📺 ❄️ 🛁", limpeza: "Hoje 09:00" },
    { num: "201", nome: "Suíte Luxo", tipo: "Triplo", cap: 2, diaria: 520, status: "ocupado", comods: "📺 🛁 ❄️ ☕", limpeza: "Hoje 07:45" },
    { num: "202", nome: "Suíte Casal", tipo: "Triplo", cap: 2, diaria: 490, status: "disponível", comods: "📺 🛁 ❄️ ☕", limpeza: "Hoje 08:15" },
    { num: "203", nome: "Suíte Premium", tipo: "Triplo", cap: 3, diaria: 560, status: "ocupado", comods: "📺 🛁 ❄️ ☕ 🍷", limpeza: "Hoje 08:00" },
    { num: "301", nome: "Master Suite", tipo: "Quádruplo", cap: 2, diaria: 850, status: "ocupado", comods: "📺 🛁 ❄️ ☕ 🍷", limpeza: "Hoje 07:30" },
    { num: "302", nome: "Suíte Vista Lago", tipo: "Quádruplo", cap: 2, diaria: 920, status: "disponível", comods: "📺 🛁 ❄️ ☕ 🍷", limpeza: "Hoje 07:00" },
    { num: "303", nome: "Suíte Presidencial", tipo: "Quádruplo", cap: 4, diaria: 1400, status: "disponível", comods: "📺 🛁 ❄️ ☕ 🍷 🎵", limpeza: "Hoje 06:45" },
    { num: "104", nome: "Quarto Simples", tipo: "Duplo", cap: 1, diaria: 190, status: "ocupado", comods: "📺 ❄️", limpeza: "Hoje 09:30" },
    { num: "204", nome: "Suíte Honeymoon", tipo: "Triplo", cap: 2, diaria: 680, status: "ocupado", comods: "📺 🛁 ❄️ ☕ 🍷", limpeza: "Hoje 08:00" },
    { num: "304", nome: "Suíte Executiva", tipo: "Quádruplo", cap: 2, diaria: 980, status: "ocupado", comods: "📺 🛁 ❄️ ☕ 💼", limpeza: "Hoje 07:15" },
]

const statusStyle = {
    ocupado: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    disponível: "bg-green-500/10 text-green-400 border border-green-500/20",
    manutenção: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
}
const tipoStyle = {
    Duplo: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    Triplo: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    Quádruplo: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
}

const stats = [
    { label: "Disponíveis", valor: "4", cor: "border-green-500" },
    { label: "Ocupados", valor: "8", cor: "border-blue-500" },
    { label: "Em manutenção", valor: "0", cor: "border-amber-400" },
    { label: "Taxa de ocupação", valor: "67%", cor: "border-purple-500" },
]

export default function Quartos() {
    const [tipo, setTipo] = useState("Todos")
    const [status, setStatus] = useState("Todos")

    const handleTipo = (e) => {
        setTipo(e.target.value);
    }

    const handleStatus = (e) => {
        setStatus(e.target.value);
    }

    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-2xl font-bold">Quartos da Pousada</p>
                    <p className="text-sm text-slate-400 mt-1">12 quartos cadastrados</p>
                </div>
                <div className="flex gap-3">
                    <input type="text" placeholder="🔍  Buscar quarto..."
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none w-52 placeholder:text-slate-500" />
                    <select value={tipo} onChange={handleTipo} className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option value="Todos"    > Todos os tipos   </option>
                        <option value="Duplo"    > Duplo            </option>
                        <option value="Triplo"   > Triplo           </option>
                        <option value="Quádruplo"> Quádruplo        </option>
                    </select>
                    <select value={status} onChange={handleStatus} className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option value="Todos"      >Todos os status  </option>
                        <option value="disponível" >Disponível       </option>
                        <option value="ocupado"    >Ocupado          </option>
                        <option value="manutenção" >Manutenção       </option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                {stats.map((s) => (
                    <div key={s.label} className={`bg-cor-primaria-escura rounded-xl px-5 py-4 border-l-4 ${s.cor}`}>
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
                        <p className="text-2xl font-bold">{s.valor}</p>
                    </div>
                ))}
            </div>

            {/* Tabela */}
            <div className="bg-cor-primaria-escura rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[0.5fr_1.2fr_1fr_1fr_1fr_1fr_1fr_0.8fr] px-5 py-3 bg-black/20 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>#</span><span>Nome / Tipo</span><span>Capacidade</span><span>Diária</span>
                    <span>Status</span><span>Comodidades</span><span>Última limpeza</span><span>Ação</span>
                </div>
                {quartos.filter((q) => (tipo === "Todos") ? q : q.tipo === tipo).filter((q) => (status === "Todos") ? q : q.status === status).map((q) => (
                    <div key={q.num}
                        className="grid grid-cols-[0.5fr_1.2fr_1fr_1fr_1fr_1fr_1fr_0.8fr] px-5 py-3.5 items-center text-sm border-t border-white/5 hover:bg-white/[0.03] transition-colors">
                        <span className="font-bold text-slate-500">{q.num}</span>
                        <div>
                            <p className="font-semibold">{q.nome}</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md mt-1 inline-block ${tipoStyle[q.tipo]}`}>{q.tipo}</span>
                        </div>
                        <span>{q.cap} pessoa{q.cap > 1 ? "s" : ""}</span>
                        <span className="font-semibold text-green-400">R$ {q.diaria}/noite</span>
                        <span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${statusStyle[q.status]}`}>
                                {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                            </span>
                        </span>
                        <span className="text-base tracking-widest">{q.comods}</span>
                        <span className="text-xs text-slate-400">{q.limpeza}</span>
                        <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors w-fit">
                            Detalhes
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}