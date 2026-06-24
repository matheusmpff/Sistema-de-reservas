"use client"

import { useState, useEffect } from "react"
import { api } from "../hooks/api"

const statusStyles = {
    EM_ANALISE: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
    PAGO:       "bg-green-500/20 text-green-400 border border-green-500/40",
    IN:         "bg-blue-500/20 text-blue-400 border border-blue-500/40",
    OUT:        "bg-slate-500/20 text-slate-400 border border-slate-500/40",
    CANCELADO:  "bg-red-500/20 text-red-400 border border-red-500/40",
}

const statusLabel = {
    EM_ANALISE: "Em análise",
    PAGO:       "Pago",
    IN:         "Hospedado",
    OUT:        "Check-out",
    CANCELADO:  "Cancelado",
}

function hojeISO() {
    return new Date().toISOString().slice(0, 10)
}

function fmt(d) {
    return d ? new Date(d).toLocaleDateString("pt-BR") : "—"
}

const FORM_VAZIO = {
    idUser: "",
    numeroQuarto: "",
    checkIn: "",
    checkOut: "",
    numPessoas: 1,
    valor: "",
}

export default function Home() {
    const [reservas,     setReservas]     = useState([])
    const [hospedes,     setHospedes]     = useState([])
    const [quartos,      setQuartos]      = useState([])
    const [loading,      setLoading]      = useState(true)
    const [erro,         setErro]         = useState("")
    const [periodo,      setPeriodo]      = useState("hoje")
    const [modalAberto,  setModalAberto]  = useState(false)
    const [form,         setForm]         = useState(FORM_VAZIO)
    const [salvando,     setSalvando]     = useState(false)
    const [erroModal,    setErroModal]    = useState("")

    async function carregarReservas() {
        setLoading(true)
        setErro("")
        try {
            setReservas(await api.get("/admin/reservas"))
        } catch {
            setErro("Erro ao carregar reservas.")
        } finally {
            setLoading(false)
        }
    }

    async function abrirModal() {
        setErroModal("")
        setForm(FORM_VAZIO)
        try {
            const [h, q] = await Promise.all([
                api.get("/admin/hospedes"),
                api.get("/admin/quartos"),
            ])
            setHospedes(h.filter(p => p.adulto))
            setQuartos(q.filter(q => q.status === "DISPONIVEL"))
        } catch {
            setHospedes([])
            setQuartos([])
        }
        setModalAberto(true)
    }

    async function criarReserva(e) {
        e.preventDefault()
        setSalvando(true)
        setErroModal("")
        try {
            await api.post("/admin/reservas", {
                idUser:       Number(form.idUser),
                numeroQuarto: Number(form.numeroQuarto),
                checkIn:      form.checkIn,
                checkOut:     form.checkOut,
                numPessoas:   Number(form.numPessoas),
                valor:        Number(form.valor),
            })
            setModalAberto(false)
            carregarReservas()
        } catch (e) {
            setErroModal(e.message)
        } finally {
            setSalvando(false)
        }
    }

    useEffect(() => { carregarReservas() }, [])

    const hoje = hojeISO()

    const reservasFiltradas = reservas.filter(r => {
        const data = r.dataReserva?.slice(0, 10)
        if (periodo === "hoje") return data === hoje
        if (periodo === "semana") {
            const d   = new Date(data)
            const ini = new Date()
            ini.setDate(ini.getDate() - ini.getDay())
            ini.setHours(0, 0, 0, 0)
            const fim = new Date(ini)
            fim.setDate(ini.getDate() + 6)
            fim.setHours(23, 59, 59, 999)
            return d >= ini && d <= fim
        }
        return true
    })

    const campos = ["Nome", "Pessoas", "Pedido em", "Check-in", "Check-out", "Status"]

    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            <div className="w-full flex flex-row items-center justify-between mb-4">
                <p className="text-2xl font-semibold">Pedidos de Reserva</p>
                <div className="flex gap-3 items-center">
                    <select
                        value={periodo}
                        onChange={e => setPeriodo(e.target.value)}
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none"
                    >
                        <option value="hoje">Pedidos de hoje</option>
                        <option value="semana">Esta semana</option>
                        <option value="todos">Todos</option>
                    </select>
                    <button
                        onClick={abrirModal}
                        className="px-3 py-1.5 bg-verde-destaque/90 rounded-md flex items-center justify-center font-semibold text-sm hover:bg-verde-destaque transition-colors">
                        + Adicionar Reserva
                    </button>
                </div>
            </div>

            {erro    && <p className="text-red-400 mb-4">{erro}</p>}
            {loading && <p className="text-slate-400">Carregando...</p>}

            {!loading && (
                <div className="col-span-2 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[2fr_1fr_1.5fr_1.5fr_1.5fr_1.2fr] px-5 py-3 bg-cor-primaria-escura text-sm font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        {campos.map(c => <span key={c}>{c}</span>)}
                    </div>

                    {reservasFiltradas.length === 0 && (
                        <div className="px-5 py-6 text-slate-400 text-sm bg-cor-primaria-escura">
                            Nenhum pedido encontrado.
                        </div>
                    )}

                    {reservasFiltradas.map((r, i) => (
                        <div key={i}
                            className="grid grid-cols-[2fr_1fr_1.5fr_1.5fr_1.5fr_1.2fr] px-5 py-3 items-center text-sm border-t border-white/5 bg-cor-primaria-escura">
                            <span className="font-medium">{r.user?.adulto?.pessoa?.nome ?? "—"}</span>
                            <span>{r.numPessoas} pessoa{r.numPessoas > 1 ? "s" : ""}</span>
                            <span>{fmt(r.dataReserva)}</span>
                            <span>{fmt(r.checkIn)}</span>
                            <span>{fmt(r.checkOut)}</span>
                            <span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[r.status] ?? ""}`}>
                                    {statusLabel[r.status] ?? r.status}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            )}

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
                                    {hospedes.map(p => (
                                        <option key={p.id} value={p.id}>{p.nome}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="flex flex-col gap-1 text-sm text-slate-300">
                                Quarto disponível
                                <select required value={form.numeroQuarto}
                                    onChange={e => setForm({ ...form, numeroQuarto: e.target.value })}
                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none">
                                    <option value="">Selecione...</option>
                                    {quartos.map(q => (
                                        <option key={q.numero} value={q.numero}>
                                            Quarto {q.numero} — {q.tipo}
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
                                    <input type="number" min={0} required value={form.valor}
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