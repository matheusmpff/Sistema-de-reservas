"use client"
import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { api, apiJson } from "../hooks/api"

const cores = ["#f472b6","#fb923c","#a78bfa","#34d399","#60a5fa","#facc15","#f87171"]

function iniciais(nome) { return nome?.split(" ").slice(0,2).map(n=>n[0]).join("") ?? "?" }
function fmt(d) { return d ? new Date(d).toLocaleDateString("pt-BR") : "—" }

export default function Feedbacks() {
    const [feedbacks, setFeedbacks] = useState([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState("")

    async function carregar() {
        setLoading(true); setErro("")
        try {
            const res = await api.get("/feedbacks")
            setFeedbacks(await apiJson(res))
        } catch(e) { setErro(e.message) }
        finally { setLoading(false) }
    }

    useEffect(() => { carregar() }, [])

    async function deletar(fb) {
        if (!confirm("Remover este feedback?")) return
        const data = encodeURIComponent(new Date(fb.reservaData).toISOString())
        try {
            await api.delete(`/feedbacks/${fb.reservaUser}/${data}`)
            carregar()
        } catch(e) { alert("Erro: " + e.message) }
    }

    // Métricas calculadas em tempo real
    const media = feedbacks.length
        ? (feedbacks.reduce((a,f) => a+f.nota, 0) / feedbacks.length).toFixed(1)
        : "—"

    const distribuicao = [5,4,3,2,1].map(n => ({
        estrelas: `${n} ★`,
        qtd: feedbacks.filter(f => f.nota === n).length
    }))

    const stats = [
        { label: "Nota média geral",       valor: `${media} ⭐`,     cor: "border-amber-400" },
        { label: "Total de avaliações",    valor: feedbacks.length,  cor: "border-blue-500" },
        { label: "Notas 5 estrelas",       valor: feedbacks.filter(f=>f.nota===5).length, cor: "border-green-500" },
    ]

    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-2xl font-bold">Feedbacks dos Hóspedes</p>
                    <p className="text-sm text-slate-400 mt-1">{feedbacks.length} avaliações coletadas</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {stats.map(s => (
                    <div key={s.label} className={`bg-cor-primaria-escura rounded-xl px-5 py-4 border-l-4 ${s.cor}`}>
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
                        <p className="text-2xl font-bold">{s.valor}</p>
                    </div>
                ))}
            </div>

            {erro && <p className="text-red-400 mb-4">{erro} <button onClick={carregar} className="underline ml-2">Tentar novamente</button></p>}
            {loading && <p className="text-slate-400">Carregando...</p>}

            {!loading && !erro && (
                <div className="grid grid-cols-[1fr_1.6fr] gap-4">

                    {/* Gráfico de distribuição */}
                    <div className="bg-cor-primaria-escura rounded-2xl p-5">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Distribuição de notas</h3>
                        {feedbacks.length === 0 ? (
                            <p className="text-slate-500 text-sm">Nenhum feedback ainda.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={distribuicao} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" horizontal={false} />
                                    <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} />
                                    <YAxis type="category" dataKey="estrelas" tick={{ fill: "#fbbf24", fontSize: 12, fontWeight: 600 }} width={36} />
                                    <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }} />
                                    <Bar dataKey="qtd" fill="#fbbf24" radius={[0,4,4,0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Lista de comentários reais */}
                    <div className="bg-cor-primaria-escura rounded-2xl p-5 overflow-y-auto max-h-[520px]">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Comentários recentes</h3>

                        {feedbacks.length === 0 && (
                            <p className="text-slate-500 text-sm">Nenhum comentário ainda.</p>
                        )}

                        <div className="flex flex-col gap-3">
                            {feedbacks.map((f, i) => {
                                const nome = f.reserva?.user?.adulto?.pessoa?.nome ?? "Hóspede"
                                const cor = cores[i % cores.length]
                                return (
                                    <div key={`${f.reservaUser}-${f.reservaData}`} className="bg-black/20 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                                    style={{ background: `${cor}22`, color: cor }}>
                                                    {iniciais(nome)}
                                                </div>
                                                <span className="font-semibold text-sm">{nome}</span>
                                                <span className="text-amber-400 text-sm">
                                                    {"★".repeat(f.nota)}{"☆".repeat(5 - f.nota)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-500">{fmt(f.createdAt)}</span>
                                                <button onClick={() => deletar(f)}
                                                    className="text-xs text-red-400 hover:text-red-300">✕</button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">{f.comentario}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
