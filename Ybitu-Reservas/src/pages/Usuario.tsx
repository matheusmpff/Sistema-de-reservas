import "../styles/Usuario.css";
import { User } from "lucide-react";
import { BedDouble } from "lucide-react";
import ActiveTable from "../components/ActiveTable";


export default function Usuario() {
    return (
        <div className="container mx-auto mt-10 flex flex-col md:flex-row bg-amber-500">
            <aside className="self-center min-w-fit flex flex-col items-center" >
                <div className="font-bold text-3xl mb-6">Conta do Usuário</div>
                <div className="flex md:flex-col">
                    <div className="user_nav_option user_option_activate">
                        <User size={24} />
                        <p>Usuário</p>
                    </div>
                    <div className="user_nav_option ml-4 md:ml-0 md:mt-4">
                        <BedDouble size={24} />
                        <p>Reservas</p>
                    </div>
                </div>

            </aside>
            <div className=" bg-blue-500 w-full">
                <ActiveTable listaReserva={[]} ></ActiveTable>
            </div>
        </div>
    );
};
