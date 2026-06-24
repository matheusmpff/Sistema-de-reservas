"use client"

import { useState, useEffect } from "react"
import { api } from "../hooks/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const cores = ["#f472b6","#fb923c","#a78bfa","#34d399","#60a5fa","#facc15","#f87171"]

function iniciais(nome) {
    return nome?.split(" ").slice(0, 2).map(n => n[0]).join("") ?? "?"
}
function fmt(d) {
    return d ? new Date(d).toLocaleDateString("pt-BR") : "—"
}

export default function Feedbacks() {
    const [feedbacks, setFeedbacks] = useState([])
    const [loading, setLoading]     = useState(true)

    useEffect(() => {
        api.get("/admin/feedbacks")
            .then(setFeedbacks)
            .finally(() => setLoading(false))
    }, [])

    const total   = feedbacks.length
    const media   = total ? (feedbacks.reduce((a, f) => a + (f.nota ?? 0), 0) / total).toFixed(1) : "—"
    const recomendam = total ? Math.round((feedbacks.filter(f => (f.nota ?? 0) >= 4).length / total) * 100) : 0

    const distribuicao = [5,4,3,2,1].map(n => ({
        estrelas: `${n} ★`,
        qtd: feedbacks.filter(f => f.nota === n).length,
    }))

    const stats = [
        { label: "Nota média geral",      valor: `${media} ⭐`, cor: "border-amber-400" },
        { label: "Recomendam a pousada",  valor: `${recomendam}%`, cor: "border-green-500" },
        { label: "Total de avaliações",   valor: String(total),    cor: "border-blue-500" },
    ]

    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-2xl font-bold">Feedbacks dos Hóspedes</p>
                    <p className="text-sm text-slate-400 mt-1">{total} avaliações coletadas</p>
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

            <div className="grid grid-cols-[1fr_1.6fr] gap-4">

                <div className="bg-cor-primaria-escura rounded-2xl p-5">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Distribuição de notas</h3>
                    {loading
                        ? <p className="text-slate-400 text-sm">Carregando...</p>
                        : (
                            <ResponsiveContainer width="100%" height={160}>
                                <BarChart data={distribuicao} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" horizontal={false} />
                                    <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
                                    <YAxis type="category" dataKey="estrelas" tick={{ fill: "#fbbf24", fontSize: 12, fontWeight: 600 }} width={36} />
                                    <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }} />
                                    <Bar dataKey="qtd" fill="#fbbf24" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )
                    }
                </div>

                <div className="bg-cor-primaria-escura rounded-2xl p-5 overflow-y-auto max-h-130">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Comentários recentes</h3>
                    {loading && <p className="text-slate-400 text-sm">Carregando...</p>}
                    <div className="flex flex-col gap-3">
                        {feedbacks.map((f, i) => {
                            const cor  = cores[i % cores.length]
                            const nome = f.reserva?.user?.adulto?.pessoa?.nome ?? "Anônimo"
                            return (
                                <div key={f.id ?? i} className="bg-black/20 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                                style={{ background: `${cor}22`, color: cor }}>
                                                {iniciais(nome)}
                                            </div>
                                            <span className="font-semibold text-sm">{nome}</span>
                                            {f.nota != null && (
                                                <span className="text-amber-400 text-sm">
                                                    {"★".repeat(f.nota)}{"☆".repeat(5 - f.nota)}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-500">{fmt(f.createdAt ?? f.reserva?.dataReserva)}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">{f.comentario ?? f.texto ?? "—"}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}