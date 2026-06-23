import { UserCircle2 } from "lucide-react";
import { useState } from "react";

type userProps = {
    email: string
    nome: string
    dataNasc: string
}
export default function Profile({ user }: { user: userProps }) {

    const [email, setEmail] = useState(user.email);
    const [nome, setNome] = useState(user.nome);
    const [dataNasc, setData] = useState(user.dataNasc);
    console.log(dataNasc)

    const alterDataHandler = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:3000/user/alterData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                nome,
                dataNasc

            }),
            credentials: "include"
        });
    }

    return (
        <>
            <div className="" >
                <div className="flex justify-between items-center lg:justify-center lg:gap-80 xl:gap-100">
                    <div className="flex items-center justify-center ">
                        <UserCircle2 size={60}></UserCircle2>
                        <div className="ml-3 ">
                            <div className="text-xl">{user.nome}</div>
                            <div className="text-[12px]">{user.email}</div>
                        </div>

                    </div>
                    <button className="cursor-pointer p-2 w-fit h-fit rounded bg-red-500 font-bold text-[var(--cor-background)] ">Apagar conta</button>
                </div>
            </div>
            <form id="profForm" onSubmit={alterDataHandler} className="mt-10 grid grid-cols-2 max-w-fit gap-10  mx-auto" action="">
                <div className="user_form_div">
                    <label htmlFor="nome">Nome:</label>
                    <input onChange={(e) => {
                        if (e.target.value === "") {
                            setNome(user.nome)
                        }else{
                            setNome(e.target.value)
                        }
                    }} required className="user_form_option" type="text" id="nome" placeholder={`${user.nome}`} />
                </div>
                <div className="user_form_div">
                    <label htmlFor="email">E-mail:</label>
                    <input onChange={
                        (e) => {
                            if (e.target.value === "") {
                                setEmail(user.email)
                            }
                            else{
                                setEmail(e.target.value)
                            }
                        }} required className="user_form_option" type="email" id="email" placeholder={`${user.email}`} />
                </div>
                <div className="user_form_div">
                    <label htmlFor="dataNasc">Data de Nascimento:</label>
                    <input onChange={(e) => { setData(e.target.value) }} required className="user_form_option" type="date" id="dataNasc" />
                </div>
            </form>

            <div className="mt-10 flex items-center justify-center">
                <button form="profForm" type="submit" className=" p-2 btn_primary">Alterar Dados</button>

            </div>
        </>
    );
};
