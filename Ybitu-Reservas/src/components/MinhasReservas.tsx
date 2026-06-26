import { useEffect, useState } from "react";
import ActiveTable from "./ActiveTable";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router";

export default function MinhasReservas() {
    const { isLoggedIn } = useAuth()
    const [booking, setBooking] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        const bookingHandler = async () => {
            if (isLoggedIn) {
                const response = await fetch(`http://localhost:3000/user/booking`, { credentials: "include" });
                const data = await response.json()
                setBooking(data.booking);
            }
            else {
                navigate("/login");
            }

        }
        bookingHandler();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center" >
            <div className="text-[var(--cor-primaria)] text-5xl font-bold mb-8">Reservas Ativas</div>
            {
                booking.length != 0 ? <ActiveTable listaReserva={booking} />
                    : <div>
                        <p>
                            Pelo visto não existem reservas ativas.
                           Caso desejar, <Link to="/Reserva/Data" className="text-[var(--cor-primaria)]"> venha agora reservar conosco!</Link>
                        </p>
                    </div>
            }
        </div>
    );
};
