import ActiveTable from "./ActiveTable";

export default function MinhasReservas() {
    return (
        <div className="flex flex-col items-center justify-center" >
            <div className="text-[var(--cor-primaria)] text-5xl font-bold mb-8">Reservas Ativas</div>
            <ActiveTable listaReserva={[{
                pessoas: 8,
                checkIn: "20-06-2026",
                checkOut: "28-06-2026",
                pagamento: true
            },
            {
                pessoas: 4,
                checkIn: "13-07-2026",
                checkOut: "20-07-2026",
                pagamento: false
            }
            ]} />
        </div>
    );
};
