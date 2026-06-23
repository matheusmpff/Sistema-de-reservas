"use client"

const cores = ["#f472b6", "#fb923c", "#a78bfa", "#34d399", "#60a5fa", "#facc15", "#f87171", "#818cf8"]

const reservas = [
    { nome: "Ana Beatriz Silva", pessoas: 2, quarto: "101 — Standard", checkin: "15/06/2025", checkout: "22/06/2025", totalDias: 7, diasRestantes: 2, status: "Pendente"},
    { nome: "Carlos Eduardo Ramos", pessoas: 4, quarto: "205 — Luxo", checkin: "18/06/2025", checkout: "25/06/2025", totalDias: 7, diasRestantes: 5, status: "Pago"},
    { nome: "Fernanda Lima", pessoas: 1, quarto: "302 — Standard", checkin: "19/06/2025", checkout: "21/06/2025", totalDias: 2, diasRestantes: 1, status: "Pendente"},
    { nome: "João Pedro Costa", pessoas: 3, quarto: "410 — Suíte", checkin: "17/06/2025", checkout: "24/06/2025", totalDias: 7, diasRestantes: 4, status: "Pago"},
    { nome: "Mariana Oliveira", pessoas: 2, quarto: "108 — Standard", checkin: "20/06/2025", checkout: "26/06/2025", totalDias: 6, diasRestantes: 6, status: "Pago"},
    { nome: "Rafael Souza", pessoas: 5, quarto: "501 — Suíte", checkin: "14/06/2025", checkout: "21/06/2025", totalDias: 7, diasRestantes: 1, status: "Pendente"},
    { nome: "Lucia Ferreira", pessoas: 2, quarto: "203 — Luxo", checkin: "19/06/2025", checkout: "23/06/2025", totalDias: 4, diasRestantes: 3, status: "Pendente"},
    { nome: "Bruno Almeida", pessoas: 3, quarto: "309 — Luxo", checkin: "20/06/2025", checkout: "28/06/2025", totalDias: 8, diasRestantes: 8, status: "Pago"},
]

function iniciais(nome) {
    return nome.split(" ").slice(0, 2).map((n) => n[0]).join("")
}

function barColor(diasRestantes, totalDias) {
    const pct = diasRestantes / totalDias
    if (pct > 0.6) return "bg-green-500"
    if (pct > 0.3) return "bg-amber-400"
    return "bg-red-500"
}

const stats = [
    { label: "Reservas ativas", valor: "8", cor: "border-blue-500" },
    { label: "Quartos ocupados", valor: "8 / 12", cor: "border-green-500" },
    { label: "Receita em curso", valor: "R$ 14.280", cor: "border-amber-400" },
    { label: "Pendente a receber", valor: "R$ 3.120", cor: "border-purple-500" },
]

export default function Andamento() {
    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            {/* Cabeçalho */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-2xl font-bold">Reservas em Andamento</p>
                    <p className="text-sm text-slate-400 mt-1">8 hóspedes ativos agora</p>
                </div>
                <div className="flex gap-3 items-center">
                    <input
                        type="text"
                        placeholder="🔍  Buscar hóspede ou quarto..."
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none w-56 placeholder:text-slate-500"
                    />
                    <select className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option>Todos os quartos</option>
                        <option>Standard</option>
                        <option>Luxo</option>
                        <option>Suíte</option>
                    </select>
                    <select className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option>Ordenar: Check-out</option>
                        <option>Ordenar: Nome</option>
                        <option>Ordenar: Valor</option>
                    </select>
                </div>
            </div>

            {/* Cards de resumo */}
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
                {/* Header */}
                <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr_1.4fr_1fr] px-5 py-3 bg-black/20 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Hóspede</span>
                    <span>Quarto</span>
                    <span>Check-in</span>
                    <span>Check-out</span>
                    <span>Dias rest.</span>
                    <span>Pago / Pendente</span>
                    <span>Ação</span>
                </div>

                {/* Linhas */}
                {reservas.map((r, i) => {
                    const pct = Math.round((r.diasRestantes / r.totalDias) * 100)
                    const cor = cores[i]
                    return (
                        <div
                            key={i}
                            className="grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr_1.4fr_1fr] px-5 py-3.5 items-center text-sm border-t border-white/5 hover:bg-white/[0.03] transition-colors"
                        >
                            {/* Hóspede */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{ background: `${cor}22`, color: cor }}
                                >
                                    {iniciais(r.nome)}
                                </div>
                                <div>
                                    <p className="font-medium">{r.nome}</p>
                                    <p className="text-xs text-slate-400">{r.pessoas} pessoa{r.pessoas > 1 ? "s" : ""}</p>
                                </div>
                            </div>

                            {/* Quarto */}
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
                                {r.quarto}
                            </span>

                            <span>{r.checkin}</span>
                            <span>{r.checkout}</span>

                            {/* Barra de dias */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-slate-400">{r.diasRestantes} de {r.totalDias}</span>
                                <div className="w-[80%] bg-slate-700 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full ${barColor(r.diasRestantes, r.totalDias)}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>

                            {/* Valores */}
                            <div className="flex flex-col gap-0.5">
                                <span className={`font-semibold text-sm ${r.status === 'Pendente' ? "text-amber-200" : "text-green-400"}`}>
                                    {r.status}
                                </span>
                                
                            </div>

                            {/* Ação */}
                            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors w-fit">
                                Ver detalhes
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}