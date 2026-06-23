"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"
import { api, apiJson } from "../hooks/api"

const STATUS_LABEL = { EM_ANALISE: "Em análise", PAGO: "Pago", IN: "Hospedado", OUT: "Check-out", CANCELADO: "Cancelado" }
const statusStyles = {
    EM_ANALISE: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
    PAGO:       "bg-green-500/20 text-green-400 border border-green-500/40",
    IN:         "bg-blue-500/20 text-blue-400 border border-blue-500/40",
    OUT:        "bg-slate-500/20 text-slate-400 border border-slate-500/40",
    CANCELADO:  "bg-red-500/20 text-red-400 border border-red-500/40",
}

function fmt(d) { return d ? new Date(d).toLocaleDateString("pt-BR") : "—" }

function hojeISO() { return new Date().toISOString().slice(0, 10) }

export default function Home() {
    const [reservas, setReservas]   = useState([])
    const [quartos, setQuartos]     = useState([])
    const [loading, setLoading]     = useState(true)
    const [erro, setErro]           = useState("")

    useEffect(() => {
        // Carrega reservas e quartos em paralelo; se um falhar não bloqueia o outro
        Promise.allSettled([
            api.get("/reservas").then(apiJson),
            api.get("/quartos").then(apiJson),
        ]).then(([r, q]) => {
            setReservas(r.status === "fulfilled" ? r.value : [])
            setQuartos(q.status === "fulfilled" ? q.value : [])
            if (r.status === "rejected" && q.status === "rejected") {
                setErro("Não foi possível carregar os dados. Verifique se a API está rodando.")
            }
            setLoading(false)
        })
    }, [])

    const hoje = hojeISO()
    const reservasHoje  = reservas.filter(r => r.checkIn?.slice(0,10) === hoje)
    const hospedados    = reservas.filter(r => r.status === "IN")
    const ocupados      = quartos.filter(q => q.status === "OCUPADO").length
    const aguardando    = reservas.filter(r => r.status === "EM_ANALISE").length

    // Distribuição de reservas por status para o gráfico
    const reservasPorStatus = Object.entries(STATUS_LABEL).map(([k, label]) => ({
        status: label,
        qtd: reservas.filter(r => r.status === k).length,
    })).filter(s => s.qtd > 0)

    const campos = ["Hóspede", "Pessoas", "Check-in", "Check-out", "Status"]

    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            {erro && <p className="text-red-400 mb-4">{erro}</p>}

            {/* Cabeçalho */}
            <div className="w-full flex flex-row items-center justify-between mb-4">
                <p className="text-2xl font-semibold">
                    {loading ? "Carregando..." : `Reservas de Hoje — ${new Date().toLocaleDateString("pt-BR")}`}
                </p>
            </div>

            {/* Cards rápidos */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                    { label: "Hospedados agora",    valor: hospedados.length, cor: "border-blue-500" },
                    { label: "Quartos ocupados",     valor: `${ocupados}/${quartos.length}`, cor: "border-green-500" },
                    { label: "Aguardando confirmação", valor: aguardando,       cor: "border-amber-400" },
                    { label: "Check-ins hoje",       valor: reservasHoje.length, cor: "border-purple-500" },
                ].map(s => (
                    <div key={s.label} className={`bg-cor-primaria-escura rounded-xl px-5 py-4 border-l-4 ${s.cor}`}>
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
                        <p className="text-2xl font-bold">{s.valor}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">

                {/* Tabela de reservas de hoje */}
                <div className="col-span-2 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[2fr_1fr_1.5fr_1.5fr_1.2fr] px-5 py-3 bg-cor-primaria-escura text-sm font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        {campos.map(c => <span key={c}>{c}</span>)}
                    </div>

                    {!loading && reservasHoje.length === 0 && (
                        <div className="px-5 py-4 text-slate-400 text-sm bg-cor-primaria-escura">
                            Nenhuma reserva com check-in hoje.
                        </div>
                    )}

                    {reservasHoje.map((r, i) => {
                        const nome = r.user?.adulto?.pessoa?.nome ?? "Hóspede"
                        return (
                            <div key={`${r.idUser}-${r.dataReserva}`}
                                className="grid grid-cols-[2fr_1fr_1.5fr_1.5fr_1.2fr] px-5 py-3 items-center text-sm border-t border-white/5 bg-cor-primaria-escura">
                                <span className="font-medium">{nome}</span>
                                <span>{r.numPessoas} pessoa{r.numPessoas > 1 ? "s" : ""}</span>
                                <span>{fmt(r.checkIn)}</span>
                                <span>{fmt(r.checkOut)}</span>
                                <span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[r.status] ?? ""}`}>
                                        {STATUS_LABEL[r.status] ?? r.status}
                                    </span>
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* Gráfico — reservas por status */}
                <div className="col-span-2 bg-cor-primaria-escura rounded-2xl p-5">
                    <h2 className="font-semibold mb-4">Reservas por Status</h2>
                    {reservasPorStatus.length === 0 ? (
                        <p className="text-slate-400 text-sm">Nenhuma reserva cadastrada ainda.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={reservasPorStatus}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
                                <XAxis dataKey="status" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                                <Tooltip formatter={v => [v, "Reservas"]}
                                    contentStyle={{ background: "#162526", border: "none", borderRadius: 8 }} />
                                <Bar dataKey="qtd" fill="#4dba93" radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

            </div>
        </div>
    )
}
