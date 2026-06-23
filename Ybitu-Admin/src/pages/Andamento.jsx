"use client"

import { useState, useEffect, useMemo } from "react"
import { api, apiJson } from "../hooks/api"

const cores = ["#f472b6", "#fb923c", "#a78bfa", "#34d399", "#60a5fa", "#facc15", "#f87171", "#818cf8"]

const STATUS_LABEL = {
    EM_ANALISE: "Em análise",
    PAGO: "Pago",
    IN: "Hospedado",
    OUT: "Check-out feito",
    CANCELADO: "Cancelado",
}
const STATUS_STYLE = {
    EM_ANALISE: "bg-amber-500/20 text-amber-400 border border-amber-500/40",
    PAGO: "bg-green-500/20 text-green-400 border border-green-500/40",
    IN: "bg-blue-500/20 text-blue-400 border border-blue-500/40",
    OUT: "bg-slate-500/20 text-slate-400 border border-slate-500/40",
    CANCELADO: "bg-red-500/20 text-red-400 border border-red-500/40",
}

function iniciais(nome) { return nome?.split(" ").slice(0, 2).map(n => n[0]).join("") ?? "?" }
function fmt(d) { return d ? new Date(d).toLocaleDateString("pt-BR") : "—" }

function diasRestantes(checkout) {
    if (!checkout) return null
    return Math.ceil((new Date(checkout) - new Date()) / (1000 * 60 * 60 * 24))
}
function totalDias(checkin, checkout) {
    if (!checkin || !checkout) return null
    return Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24))
}
function barColor(restantes, total) {
    const pct = restantes / total
    if (pct > 0.6) return "bg-green-500"
    if (pct > 0.3) return "bg-amber-400"
    return "bg-red-500"
}

const FORM_VAZIO = { idUser: "", quartoNumeros: "", checkIn: "", checkOut: "", numPessoas: 1, valor: "" }

export default function Andamento() {
    const [reservas, setReservas] = useState([])
    const [pessoas, setPessoas] = useState([])
    const [quartos, setQuartos] = useState([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState("")
    const [busca, setBusca] = useState("")

    // Modal
    const [modalAberto, setModalAberto] = useState(false)
    const [form, setForm] = useState(FORM_VAZIO)
    const [salvando, setSalvando] = useState(false)
    const [erroModal, setErroModal] = useState("")

    async function carregar() {
        setLoading(true); setErro("")
        try {
            const res = await api.get("/reservas")
            setReservas(await apiJson(res))
        } catch (e) { setErro(e.message) }
        finally { setLoading(false) }
    }

    async function abrirModal() {
        // Carrega pessoas e quartos disponíveis para os selects do form
        setErroModal("")
        setForm(FORM_VAZIO)
        try {
            const [rp, rq] = await Promise.all([
                api.get("/pessoas").then(apiJson),
                api.get("/quartos").then(apiJson),
            ])
            setPessoas(rp.filter(p => p.adulto)) // só adultos podem ser titulares
            setQuartos(rq)
        } catch (e) {
            setPessoas([]); setQuartos([])
        }
        setModalAberto(true)
    }

    async function criarReserva(e) {
        e.preventDefault()
        setSalvando(true); setErroModal("")
        try {
            // idUser aqui é o id da Pessoa — mas a reserva precisa do id do User (conta de login)
            // O adulto selecionado tem adulto.idPessoa = pessoa.id
            // O backend espera o idUser = id do registro em User
            // Por isso buscamos a pessoa completa pra pegar o adulto.idUser se existir,
            // ou usamos o id da pessoa mesmo (quando o adulto também tem conta de usuário)
            const res = await api.post("/reservas", {
                idUser: Number(form.idUser),
                checkIn: form.checkIn,
                checkOut: form.checkOut,
                numPessoas: Number(form.numPessoas),
                status: "EM_ANALISE",
                valor: Number(form.valor),
                quartoNumeros: form.quartoNumeros
                    ? form.quartoNumeros.split(",").map(n => Number(n.trim())).filter(Boolean)
                    : [],
            })
            await apiJson(res)
            setModalAberto(false)
            carregar()
        } catch (e) {
            setErroModal(e.message)
        } finally {
            setSalvando(false)
        }
    }

    async function avancarStatus(r) {
        const proximo = { EM_ANALISE: "PAGO", PAGO: "IN", IN: "OUT" }[r.status]
        if (!proximo) return
        const data = encodeURIComponent(new Date(r.dataReserva).toISOString())
        try {
            const res = await api.patch(`/reservas/${r.idUser}/${data}`, { status: proximo })
            await apiJson(res)
            carregar()
        } catch (e) { alert("Erro: " + e.message) }
    }

    useEffect(() => { carregar() }, [])

    const filtradas = useMemo(() => reservas.filter(r => {
        if (!busca) return true
        const nome = r.user?.adulto?.pessoa?.nome?.toLowerCase() ?? ""
        const quarto = String(r.reservaQuartos?.Quartos?.[0]?.numero ?? "")
        return nome.includes(busca.toLowerCase()) || quarto.includes(busca)
    }), [reservas, busca])

    const stats = [
        { label: "Hospedados agora", valor: reservas.filter(r => r.status === "IN").length, cor: "border-blue-500" },
        { label: "Quartos ocupados", valor: reservas.filter(r => r.status === "IN").length, cor: "border-green-500" },
        { label: "Total de reservas", valor: reservas.length, cor: "border-amber-400" },
        { label: "Aguardando", valor: reservas.filter(r => r.status === "EM_ANALISE").length, cor: "border-purple-500" },
    ]

    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-2xl font-bold">Reservas em Andamento</p>
                    <p className="text-sm text-slate-400 mt-1">{reservas.filter(r => r.status === "IN").length} hóspedes ativos agora</p>
                </div>
                <div className="flex gap-3 items-center">
                    <input type="text" placeholder="🔍  Buscar hóspede ou quarto..."
                        value={busca} onChange={e => setBusca(e.target.value)}
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none w-56 placeholder:text-slate-500" />
                    <button onClick={abrirModal}
                        className="bg-verde-destaque/90 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-verde-destaque transition-colors whitespace-nowrap">
                        + Nova reserva
                    </button>
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
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.4fr_1fr] px-5 py-3 bg-black/20 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span>Hóspede</span><span>Quarto</span><span>Check-in</span><span>Check-out</span>
                        <span>Dias rest.</span><span>Status</span><span>Ação</span>
                    </div>

                    {filtradas.length === 0 && (
                        <p className="px-5 py-6 text-slate-400 text-sm">Nenhuma reserva encontrada.</p>
                    )}

                    {filtradas.map((r, i) => {
                        const nome = r.user?.adulto?.pessoa?.nome ?? "Hóspede"
                        const quartoN = r.reservaQuartos?.Quartos?.[0]?.numero ?? "—"
                        const total = totalDias(r.checkIn, r.checkOut)
                        const restantes = diasRestantes(r.checkOut)
                        const pct = total && restantes != null ? Math.max(0, Math.round(restantes / total * 100)) : 0
                        const cor = cores[i % cores.length]
                        const proximo = { EM_ANALISE: "Confirmar pagamento", PAGO: "Fazer check-in", IN: "Fazer check-out" }[r.status]

                        return (
                            <div key={`${r.idUser}-${r.dataReserva}`}
                                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.4fr_1fr] px-5 py-3.5 items-center text-sm border-t border-white/5 hover:bg-white/[0.03] transition-colors">

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                        style={{ background: `${cor}22`, color: cor }}>
                                        {iniciais(nome)}
                                    </div>
                                    <div>
                                        <p className="font-medium">{nome}</p>
                                        <p className="text-xs text-slate-400">{r.numPessoas} pessoa{r.numPessoas > 1 ? "s" : ""}</p>
                                    </div>
                                </div>

                                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
                                    {quartoN}
                                </span>

                                <span>{fmt(r.checkIn)}</span>
                                <span>{fmt(r.checkOut)}</span>

                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-slate-400">{restantes != null ? `${Math.max(0, restantes)} de ${total}` : "—"}</span>
                                    {total && (
                                        <div className="w-[80%] bg-slate-700 rounded-full h-1.5">
                                            <div className={`h-1.5 rounded-full ${barColor(restantes, total)}`} style={{ width: `${pct}%` }} />
                                        </div>
                                    )}
                                </div>

                                <span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[r.status] ?? ""}`}>
                                        {STATUS_LABEL[r.status] ?? r.status}
                                    </span>
                                </span>

                                <button onClick={() => avancarStatus(r)} disabled={!proximo}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors w-fit disabled:opacity-40 disabled:cursor-not-allowed">
                                    {proximo ?? "Encerrada"}
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Modal nova reserva */}
            {modalAberto && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-cor-primaria-escura rounded-2xl p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-6">Nova Reserva</h2>
                        <form onSubmit={criarReserva} className="flex flex-col gap-4">

                            <label className="flex flex-col gap-1 text-sm text-slate-300">
                                Hóspede titular
                                <select required value={form.idUser}
                                    onChange={e => setForm({ ...form, idUser: e.target.value })}
                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none">
                                    <option value="">Selecione...</option>
                                    {pessoas.map(p => (
                                        <option key={p.id} value={p.id}>{p.nome}</option>
                                    ))}
                                </select>
                                <span className="text-xs text-slate-500">O id enviado para a API é o id da Pessoa selecionada.</span>
                            </label>

                            <label className="flex flex-col gap-1 text-sm text-slate-300">
                                Quarto(s)
                                <select value={form.quartoNumeros}
                                    onChange={e => setForm({ ...form, quartoNumeros: e.target.value })}
                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none">
                                    <option value="">Sem quarto por enquanto</option>
                                    {quartos.map(q => (
                                        <option key={q.numero} value={String(q.numero)}>
                                            Quarto {q.numero} — {q.tipo} ({q.status})
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex flex-col gap-1 text-sm text-slate-300">
                                    Check-in
                                    <input type="date" required value={form.checkIn}
                                        onChange={e => setForm({ ...form, checkIn: e.target.value })}
                                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
                                </label>
                                <label className="flex flex-col gap-1 text-sm text-slate-300">
                                    Check-out
                                    <input type="date" required value={form.checkOut}
                                        onChange={e => setForm({ ...form, checkOut: e.target.value })}
                                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
                                </label>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex flex-col gap-1 text-sm text-slate-300">
                                    Nº de pessoas
                                    <input type="number" min={1} required value={form.numPessoas}
                                        onChange={e => setForm({ ...form, numPessoas: e.target.value })}
                                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
                                </label>
                                <label className="flex flex-col gap-1 text-sm text-slate-300">
                                    Valor total (R$)
                                    <input type="number" min={0} step="0.01" required value={form.valor}
                                        onChange={e => setForm({ ...form, valor: e.target.value })}
                                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none" />
                                </label>
                            </div>

                            {erroModal && <p className="text-red-400 text-sm">{erroModal}</p>}

                            <div className="flex gap-3 mt-2">
                                <button type="button" onClick={() => setModalAberto(false)}
                                    className="flex-1 py-2 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={salvando}
                                    className="flex-1 py-2 rounded-lg bg-verde-destaque/90 text-white text-sm font-semibold hover:bg-verde-destaque disabled:opacity-60">
                                    {salvando ? "Salvando..." : "Criar reserva"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
