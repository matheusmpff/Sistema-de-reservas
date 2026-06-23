"use client"

import { useState, useEffect, useMemo } from "react"
import { api, apiJson } from "../hooks/api"

const cores = ["#f472b6","#fb923c","#a78bfa","#34d399","#60a5fa","#facc15","#f87171","#818cf8","#f472b6","#34d399","#fb923c","#60a5fa"]

function iniciais(nome) {
    return nome?.split(" ").slice(0, 2).map(n => n[0]).join("") ?? "?"
}

function calcIdade(dataNasc) {
    if (!dataNasc) return "—"
    const nasc = new Date(dataNasc)
    const hoje = new Date()
    let idade = hoje.getFullYear() - nasc.getFullYear()
    if (hoje.getMonth() < nasc.getMonth() || (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())) idade--
    return idade
}

export default function Hospedes() {
    const [pessoas, setPessoas] = useState([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState("")
    const [busca, setBusca] = useState("")
    const [filtro, setFiltro] = useState("Todos")

    async function carregar() {
        setLoading(true); setErro("")
        try {
            const res = await api.get("/pessoas")
            setPessoas(await apiJson(res))
        } catch (e) { setErro(e.message) }
        finally { setLoading(false) }
    }

    useEffect(() => { carregar() }, [])

    async function deletar(id, nome) {
        if (!confirm(`Remover ${nome} do cadastro?`)) return
        try {
            await api.delete(`/pessoas/${id}`)
            carregar()
        } catch (e) { alert("Erro ao remover: " + e.message) }
    }

    const filtrados = useMemo(() => pessoas
        .filter(p => filtro === "Todos" || (filtro === "Adultos" ? !!p.adulto : !!p.crianca))
        .filter(p => busca === "" || p.nome.toLowerCase().includes(busca.toLowerCase()) ||
            p.adulto?.email?.toLowerCase().includes(busca.toLowerCase()))
    , [pessoas, filtro, busca])

    const stats = [
        { label: "Adultos cadastrados", valor: pessoas.filter(p => p.adulto).length,  cor: "border-green-500" },
        { label: "Crianças cadastradas", valor: pessoas.filter(p => p.crianca).length, cor: "border-blue-500" },
        { label: "Total cadastrados",   valor: pessoas.length,                          cor: "border-purple-500" },
        { label: "Média de idade",
          valor: pessoas.length ? Math.round(pessoas.reduce((a,p) => a + calcIdade(p.dataNasc), 0) / pessoas.length) : "—",
          cor: "border-amber-400" },
    ]

    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-2xl font-bold">Hóspedes Cadastrados</p>
                    <p className="text-sm text-slate-400 mt-1">{pessoas.length} hóspedes no total</p>
                </div>
                <div className="flex gap-3">
                    <input type="text" placeholder="🔍  Buscar hóspede..."
                        value={busca} onChange={e => setBusca(e.target.value)}
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none w-56 placeholder:text-slate-500" />
                    <select value={filtro} onChange={e => setFiltro(e.target.value)}
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option>Todos</option><option value="Adultos">Adultos</option><option value="Criancas">Crianças</option>
                    </select>
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

            {erro && <p className="text-red-400 mb-4">{erro} <button onClick={carregar} className="underline ml-2">Tentar novamente</button></p>}
            {loading && <p className="text-slate-400">Carregando...</p>}

            {!loading && !erro && (
                <div className="bg-cor-primaria-escura rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_0.8fr] px-5 py-3 bg-black/20 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span>Hóspede</span><span>Tipo</span><span>Idade</span><span>Contato / Responsável</span><span>Ação</span>
                    </div>
                    {filtrados.length === 0 && <p className="px-5 py-6 text-slate-400 text-sm">Nenhum hóspede encontrado.</p>}
                    {filtrados.map((p, i) => {
                        const cor = cores[i % cores.length]
                        return (
                            <div key={p.id} className="grid grid-cols-[2fr_1fr_1fr_1.5fr_0.8fr] px-5 py-3.5 items-center text-sm border-t border-white/5 hover:bg-white/[0.03] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                        style={{ background: `${cor}22`, color: cor }}>
                                        {iniciais(p.nome)}
                                    </div>
                                    <span className="font-medium">{p.nome}</span>
                                </div>
                                <span>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${p.adulto ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                                        {p.adulto ? "Adulto" : "Criança"}
                                    </span>
                                </span>
                                <span className="text-slate-400">{calcIdade(p.dataNasc)} anos</span>
                                <div className="text-xs text-slate-400">
                                    {p.adulto ? (
                                        <><div>{p.adulto.email}</div><div>{p.adulto.telefone}</div></>
                                    ) : (
                                        <span>Resp.: {p.crianca?.responsavel?.pessoa?.nome ?? "—"}</span>
                                    )}
                                </div>
                                <button onClick={() => deletar(p.id, p.nome)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors w-fit">
                                    Remover
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
