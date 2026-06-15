
type Reserva = {
    pessoas: number
    checkIn: number
    checkOut: number
    pagamento: boolean

}

type Props = {
    listaReserva: Reserva[]
}

export default function ActiveTable({listaReserva = [
    {
        pessoas: 8,
        checkIn: 12,
        checkOut: 21,
        pagamento: false

    },
    {
        pessoas: 14,
        checkIn: 45,
        checkOut: 81,
        pagamento: true

    }
]}: Props) {
    return(
        <table className="mx-auto">
            <thead className="border text-[var(--cor-background)] border-gray-600 rounded-md overflow-hidden">
                <tr className="text-center border-b border-gray-600 bg-[var(--cor-terciaria)]">
                    <th className="p-3 ">Pessoas</th>
                    <th className="p-3">Check-in</th>
                    <th className="p-3">Check-out</th>
                    <th className="p-3">Pagamento</th>
                </tr>
            </thead>
            <tbody className="text-center ">
                {listaReserva.map(reserva => {
                    return(
                        <tr className="bg-gray-400 border-b border-gray-600" >
                            <td className="p-2 ">{reserva.pessoas}</td>
                            <td>{reserva.checkIn}</td>
                            <td>{reserva.checkOut}</td>
                            <td > {reserva.pagamento ? <div className=" text-[var(--cor-background)] rounded flex items-center justify-center p-1 w-11/12 bg-[var(--cor-primaria)]">Confirmado</div>: <div className="text-[var(--cor-background)] rounded flex items-center justify-center p-1 w-11/12 bg-red-600">Pendente</div>}</td>
                        </tr>
                    );
                })}               
            </tbody>
        </table>
    );
};
