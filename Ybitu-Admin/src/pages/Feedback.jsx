"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts"

const cores = ["#f472b6", "#fb923c", "#a78bfa", "#34d399", "#60a5fa", "#facc15", "#f87171"]

const distribuicao = [
    { estrelas: "5 ★", qtd: 23 },
    { estrelas: "4 ★", qtd: 6 },
    { estrelas: "3 ★", qtd: 2 },
    { estrelas: "2 ★", qtd: 1 },
    { estrelas: "1 ★", qtd: 0 },
]

const categorias = [
    { cat: "Limpeza", nota: 9.5 },
    { cat: "Atendimento", nota: 9.8 },
    { cat: "Localização", nota: 9.0 },
    { cat: "Custo-benefício", nota: 8.5 },
    { cat: "Conforto", nota: 9.2 },
]

const comentarios = [
    { nome: "Ana Beatriz S.", nota: 5, data: "20/06/2025", texto: "Lugar incrível! O atendimento foi impecável e o quarto estava super limpo. Com certeza voltaremos." },
    { nome: "Fernanda Lima", nota: 5, data: "19/06/2025", texto: "A suíte com vista para o jardim é um sonho. Café da manhã delicioso e equipe muito atenciosa." },
    { nome: "Mariana Oliveira", nota: 4, data: "20/06/2025", texto: "Ótima experiência no geral. Wi-Fi poderia ser um pouco mais rápido, mas tudo mais foi perfeito." },
    { nome: "Lucia Ferreira", nota: 5, data: "19/06/2025", texto: "Minha 6ª vez hospedada aqui e cada vez melhor. A pousada tem um charme único que não encontro em outro lugar." },
    { nome: "João Pedro C.", nota: 4, data: "17/06/2025", texto: "Adorei a localização e o silêncio do lugar. Pequena demora no check-in mas foi logo resolvida." },
    { nome: "Elisa Cunha", nota: 5, data: "01/06/2025", texto: "Simplesmente perfeito. Os detalhes fazem toda a diferença — desde o travesseiro até o aroma do quarto." },
    { nome: "Camila Torres", nota: 3, data: "10/06/2025", texto: "Estrutura bonita, mas a manutenção do ar-condicionado deixou a desejar no segundo dia." },
]

function iniciais(nome) {
    return nome.split(" ").slice(0, 2).map((n) => n[0]).join("")
}

const stats = [
    { label: "Nota média geral", valor: "4,7 ⭐", cor: "border-amber-400" },
    { label: "Recomendam a pousada", valor: "94%", cor: "border-green-500" },
    { label: "Total de avaliações", valor: "32", cor: "border-blue-500" },
]

export default function Feedbacks() {
    return (
        <div className="flex-1 w-full mt-10 bg-cor-primaria-clara p-10 rounded-2xl">

            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-2xl font-bold">Feedbacks dos Hóspedes</p>
                    <p className="text-sm text-slate-400 mt-1">32 avaliações coletadas</p>
                </div>
                <div className="flex gap-3">
                    <select className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option>Todos os períodos</option><option>Último mês</option><option>Últimos 3 meses</option>
                    </select>
                    <select className="bg-cor-primaria-escura border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option>Todas as notas</option><option>⭐⭐⭐⭐⭐ 5 estrelas</option><option>⭐⭐⭐⭐ 4 estrelas</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {stats.map((s) => (
                    <div key={s.label} className={`bg-cor-primaria-escura rounded-xl px-5 py-4 border-l-4 ${s.cor}`}>
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
                        <p className="text-2xl font-bold">{s.valor}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-[1fr_1.6fr] gap-4">

                {/* Gráficos */}
                <div className="flex flex-col gap-4">

                    {/* Distribuição de notas */}
                    <div className="bg-cor-primaria-escura rounded-2xl p-5">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Distribuição de notas</h3>
                        <ResponsiveContainer width="100%" height={160}>
                            <BarChart data={distribuicao} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" horizontal={false} />
                                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
                                <YAxis type="category" dataKey="estrelas" tick={{ fill: "#fbbf24", fontSize: 12, fontWeight: 600 }} width={36} />
                                <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8 }} />
                                <Bar dataKey="qtd" fill="#fbbf24" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Por categoria */}
                    <div className="bg-cor-primaria-escura rounded-2xl p-5">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Por categoria</h3>
                        <div className="flex flex-col gap-3">
                            {categorias.map((c, i) => (
                                <div key={c.cat} className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400 w-28 flex-shrink-0">{c.cat}</span>
                                    <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                                        <div className="h-1.5 rounded-full" style={{ width: `${c.nota * 10}%`, background: cores[i] }} />
                                    </div>
                                    <span className="text-xs font-bold w-8 text-right" style={{ color: cores[i] }}>{c.nota}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Comentários */}
                <div className="bg-cor-primaria-escura rounded-2xl p-5 overflow-y-auto max-h-[520px]">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Comentários recentes</h3>
                    <div className="flex flex-col gap-3">
                        {comentarios.map((c, i) => {
                            const cor = cores[i % cores.length]
                            return (
                                <div key={i} className="bg-black/20 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                                style={{ background: `${cor}22`, color: cor }}>
                                                {iniciais(c.nome)}
                                            </div>
                                            <span className="font-semibold text-sm">{c.nome}</span>
                                            <span className="text-amber-400 text-sm">{"★".repeat(c.nota)}{"☆".repeat(5 - c.nota)}</span>
                                        </div>
                                        <span className="text-xs text-slate-500">{c.data}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">{c.texto}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}