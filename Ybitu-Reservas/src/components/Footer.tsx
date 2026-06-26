import { Link } from "react-router";
export default function Footer() {
    return (
        <footer className="mt-12 border-y border-gray-700 bg-[#181715] text-white py-10 w-screen flex flex-col items-center justify-center">
            <div>
                <ul className="flex gap-4 text-gray-300">
                    <Link to="/Home"><li>Inicio</li></Link>
                    <Link to="/Pousada"><li>Pousada Ybitu</li></Link>
                    <Link to="/Reserva/Data"><li>Reservas</li></Link>
                     <Link to="/Contato"><li>Contato</li></Link>
                </ul>
            </div>
            <div className="flex gap-4 mt-3 mb-8" >
                <img src="src/assets/instaicon.png" alt="" width="20" />
                <img src="src/assets/faceicon.png" alt="" width="20" />
                <img src="src/assets/whatsicon.png" alt="" width="20" />
            </div>
            <p className="text-gray-300">© 2026 Ybitu Pousada. Todos os direitos reservados</p>
        </footer>
    );
};
