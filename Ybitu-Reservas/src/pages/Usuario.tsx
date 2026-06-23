import "../styles/Usuario.css";
import { User } from "lucide-react";
import { BedDouble } from "lucide-react";

import { useEffect, useState } from "react";
import Profile from "../components/Profile";
import MinhasReservas from "../components/MinhasReservas";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";



export default function Usuario() {
    const [mostrar, setMostrar] = useState(true)
    const [user,setUser] = useState({
        email: "",
        senha: "",
        nome:""
    })
    const { isLoggedIn } = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        const profileHandler = async () => {
            if (isLoggedIn == true) {
                const response = await fetch(`http://localhost:3000/user/data`,{credentials:"include"});
                const data = await response.json()
                setUser({
                    email: data.email,
                    senha: data.user.senha,
                    nome: data.pessoa.nome
                })
                console.log(data)
            }
            else{
                navigate("/login");
            }

        }
        profileHandler();
    }, [])

    console.log(isLoggedIn);
    return (
        <div className="container mx-auto mt-20 flex flex-col md:flex-row min-h-[70vh]">
            <aside className=" min-w-fit flex flex-col items-center" >
                <div className="font-bold text-3xl mb-6">Conta do Usuário</div>
                <div className="flex md:flex-col">
                    <div onClick={() => setMostrar(true)} className={`user_nav_option ${mostrar ? "user_option_activate" : ""}`}>
                        <User size={24} />
                        <p>Usuário</p>
                    </div>
                    <div onClick={() => { setMostrar(false); }} className={`user_nav_option ${!mostrar ? "user_option_activate" : ""} ml-4 md:ml-0 md:mt-4`}>
                        <BedDouble size={24} />
                        <p>Reservas</p>
                    </div>
                </div>

            </aside>
            <div className="w-full px-4 pt-16 ">
                {mostrar && <Profile user={user}></Profile>}
                {(!mostrar) && <MinhasReservas />}
            </div>
        </div>

    );
};
