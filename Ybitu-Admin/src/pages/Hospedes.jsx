"use client"

const cores = ["#f472b6", "#fb923c", "#a78bfa", "#34d399", "#60a5fa", "#facc15", "#f87171", "#818cf8", "#f472b6", "#34d399", "#fb923c", "#60a5fa"]

const hospedes = [
    { nome: "Ana Beatriz Silva", doc: "CPF 123.456.789-00", tel: "(16) 99123-4567", estadias: 3, ultima: "20/06/2025", status: "ativo", tipo: "VIP" },
    { nome: "Carlos Eduardo Ramos", doc: "CPF 234.567.890-11", tel: "(11) 98234-5678", estadias: 1, ultima: "18/06/2025", status: "ativo", tipo: "Regular" },
    { nome: "Fernanda Lima", doc: "CPF 345.678.901-22", tel: "(21) 97345-6789", estadias: 5, ultima: "19/06/2025", status: "ativo", tipo: "VIP" },
    { nome: "João Pedro Costa", doc: "RG  9.876.543-SP", tel: "(11) 96456-7890", estadias: 2, ultima: "17/06/2025", status: "ativo", tipo: "Regular" },
    { nome: "Mariana Oliveira", doc: "CPF 456.789.012-33", tel: "(16) 95567-8901", estadias: 4, ultima: "20/06/2025", status: "ativo", tipo: "VIP" },
    { nome: "Rafael Souza", doc: "CPF 567.890.123-44", tel: "(31) 94678-9012", estadias: 1, ultima: "14/06/2025", status: "ativo", tipo: "Regular" },
    { nome: "Lucia Ferreira", doc: "CPF 678.901.234-55", tel: "(41) 93789-0123", estadias: 6, ultima: "19/06/2025", status: "ativo", tipo: "VIP" },
    { nome: "Bruno Almeida", doc: "CPF 789.012.345-66", tel: "(51) 92890-1234", estadias: 1, ultima: "20/06/2025", status: "ativo", tipo: "Regular" },
    { nome: "Camila Torres", doc: "CPF 890.123.456-77", tel: "(71) 91901-2345", estadias: 3, ultima: "10/06/2025", status: "histórico", "tipo": "Regular" },
    { nome: "Diego Martins", doc: "CPF 901.234.567-88", tel: "(85) 90012-3456", estadias: 2, ultima: "05/06/2025", status: "histórico", "tipo": "Regular" },
    { nome: "Elisa Cunha", doc: "CPF 012.345.678-99", tel: "(62) 99111-2233", estadias: 8, ultima: "01/06/2025", status: "histórico", "tipo": "VIP" },
    { nome: "Fábio Nascimento", doc: "RG  1.234.567-MG", tel: "(31) 98222-3344", estadias: 1, ultima: "28/05/2025", status: "histórico", "tipo": "Regular" },
]

const stats = [
    { label: "Hóspedes ativos", valor: "8", cor: "border-green-500" },
    { label: "Total cadastrados", valor: "24", cor: "border-blue-500" },
    { label: "Retornantes", valor: "7", cor: "border-purple-500" },
    { label: "Média de estadias", valor: "2,3", cor: "border-amber-400" },
]

function iniciais(nome) {
    return nome.split(" ").slice(0, 2).map((n) => n[0]).join("")
}

export default function Hospedes() {
    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-2xl font-bold">Hóspedes Cadastrados</p>
                    <p className="text-sm text-slate-400 mt-1">24 hóspedes no total</p>
                </div>
                <div className="flex gap-3">
                    <input type="text" placeholder="🔍  Buscar hóspede..."
                        className="bg-cor-primaria-escura border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 outline-none w-56 placeholder:text-slate-500" />
                    <select className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option>Todos</option><option>Ativos</option><option>Histórico</option><option>VIP</option>
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
                <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr_0.8fr] px-5 py-3 bg-black/20 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Hóspede</span><span>Documento</span><span>Telefone</span>
                    <span>Estadias</span><span>Última visita</span><span>Status</span><span>Tipo</span>
                </div>
                {hospedes.map((h, i) => {
                    const cor = cores[i % cores.length]
                    return (
                        <div key={i}
                            className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr_0.8fr] px-5 py-3.5 items-center text-sm border-t border-white/5 hover:bg-white/[0.03] transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{ background: `${cor}22`, color: cor }}>
                                    {iniciais(h.nome)}
                                </div>
                                <span className="font-medium">{h.nome}</span>
                            </div>
                            <span className="text-xs text-slate-400">{h.doc}</span>
                            <span className="text-xs">{h.tel}</span>
                            <span className="font-semibold">{h.estadias}x</span>
                            <span className="text-xs text-slate-400">{h.ultima}</span>
                            <span>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${h.status === "ativo" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}>
                                    {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                                </span>
                            </span>
                            <span>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${h.tipo === "VIP" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                                    {h.tipo}
                                </span>
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}