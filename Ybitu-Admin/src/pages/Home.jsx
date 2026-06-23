"use client"

import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    CartesianGrid, ResponsiveContainer
} from "recharts"

const reservas = [
    { nome: "Ana Beatriz Silva", pessoas: 2, checkin: "20/06/2025", checkout: "22/06/2025", status: "confirmado" },
    { nome: "Carlos Eduardo Ramos", pessoas: 4, checkin: "20/06/2025", checkout: "25/06/2025", status: "pendente" },
    { nome: "Fernanda Lima", pessoas: 1, checkin: "20/06/2025", checkout: "21/06/2025", status: "confirmado" },
    { nome: "João Pedro Costa", pessoas: 3, checkin: "20/06/2025", checkout: "23/06/2025", status: "cancelado" },
    { nome: "Mariana Oliveira", pessoas: 2, checkin: "20/06/2025", checkout: "24/06/2025", status: "pendente" },
    { nome: "Rafael Souza", pessoas: 5, checkin: "20/06/2025", checkout: "27/06/2025", status: "confirmado" },
]

const receitaMensal = [
    { mes: "Jul", valor: 18400 }, { mes: "Ago", valor: 22100 },
    { mes: "Set", valor: 19800 }, { mes: "Out", valor: 24500 },
    { mes: "Nov", valor: 21000 }, { mes: "Dez", valor: 28900 },
    { mes: "Jan", valor: 17500 }, { mes: "Fev", valor: 20300 },
    { mes: "Mar", valor: 23700 }, { mes: "Abr", valor: 26100 },
    { mes: "Mai", valor: 22800 }, { mes: "Jun", valor: 31200 },
]

const reservasPorDia = [
    { dia: "Seg", qtd: 12 }, { dia: "Ter", qtd: 18 },
    { dia: "Qua", qtd: 14 }, { dia: "Qui", qtd: 20 },
    { dia: "Sex", qtd: 28 }, { dia: "Sáb", qtd: 35 },
    { dia: "Dom", qtd: 22 },
]

const statusStyles = {
    confirmado: "bg-green-500/20 text-green-400 border border-green-500/40",
    pendente: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
    cancelado: "bg-red-500/20 text-red-400 border border-red-500/40",
}

const campos = ["Nome", "Pessoas", "Check-in", "Check-out", "Status"]

export default function Home() {
    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            {/* Cabeçalho */}
            <div className="w-full flex flex-row items-center justify-between mb-4">
                <p className="text-2xl font-semibold">Pedidos de Reserva de Hoje</p>
                <button className="px-3 py-1.5 bg-verde-destaque/90 rounded-md flex items-center justify-center font-semibold text-sm">
                    + Adicionar Reserva
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">

                {/* Tabela — ocupa as 2 colunas */}
                <div className="col-span-2 rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-[2fr_1fr_1.5fr_1.5fr_1.2fr] px-5 py-3 bg-cor-primaria-escura text-sm font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        {campos.map((c) => <span key={c}>{c}</span>)}
                    </div>

                    {/* Linhas */}
                    {reservas.map((r, i) => (
                        <div
                            key={i}
                            className={`grid grid-cols-[2fr_1fr_1.5fr_1.5fr_1.2fr] px-5 py-3 items-center text-sm border-t border-white/5 bg-cor-primaria-escura`}
                        >
                            <span className="font-medium">{r.nome}</span>
                            <span>{r.pessoas} pessoa{r.pessoas > 1 ? "s" : ""}</span>
                            <span>{r.checkin}</span>
                            <span>{r.checkout}</span>
                            <span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[r.status]}`}>
                                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>

                {/* Card — Receita últimos 12 meses */}
                <div className="bg-cor-primaria-escura rounded-2xl p-5">
                    <h2 className="font-semibold mb-4">Receita — Últimos 12 meses</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={receitaMensal}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
                            <XAxis dataKey="mes" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                            <YAxis
                                tick={{ fill: "#94a3b8", fontSize: 11 }}
                                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                            />
                            <Tooltip
                                formatter={(v) => [`R$ ${v.toLocaleString("pt-BR")}`, "Receita"]}
                                contentStyle={{ background: "#0f3460", border: "none", borderRadius: 8 }}
                            />
                            <Bar dataKey="valor" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Card — Reservas por dia da semana */}
                <div className="bg-cor-primaria-escura rounded-2xl p-5">
                    <h2 className="font-semibold mb-4">Reservas por Dia da Semana</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={reservasPorDia}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
                            <XAxis dataKey="dia" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                            <Tooltip
                                formatter={(v) => [v, "Reservas"]}
                                contentStyle={{ background: "#0f3460", border: "none", borderRadius: 8 }}
                            />
                            <Bar dataKey="qtd" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    )
}