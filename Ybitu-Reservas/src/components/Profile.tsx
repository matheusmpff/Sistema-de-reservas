import { UserCircle2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

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
        const pattern = z.object({
            nome: z.string().min(2, {error: "O nome deve ter no mínimo 2 caracteres"}).max(50,{error:"O nome pode ter no máximo 50 caracteres"}),
            email: z.email({error:"É preciso inserir um e-mail válido"}),
            dataNasc: z.coerce.date().refine((nasc)=>{
                const agora = new Date();

                if(agora.getFullYear() -nasc.getFullYear() < 18){
                    console.log("aqui1")
                    return false;
                }
                else{
                    if(agora.getFullYear() -nasc.getFullYear() > 18){
                        return true;
                    }
                }
                if(agora.getMonth()< nasc.getMonth() ){
                    console.log("aqui2")
                    return false;
                }
                if(agora.getMonth() == nasc.getMonth() && agora.getDate()<nasc.getDate()){
                    console.log("aqui3")
                    return false;
                }

                return true;
            },{error: "Idade precisa ser maior de 18 anos"})
        })

        const resultado = pattern.safeParse({
            nome,
            dataNasc,
        })

        if(!resultado.success){
            alert(resultado.error.issues[0].message);
            
        }
        else{
            alert("OK");
        }

        return;
        
        const confirmed = window.confirm("Tem certeza que deseja realizar essa ação?");

        if (!confirmed) {
            return;
        }

        const res = await fetch("http://localhost:3000/user/alterData", {
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

        if (res.ok) {
            alert("Dados alterados com sucesso!")
            setTimeout(() => {
                window.location.reload();
            }, 100);
        }
        else {
            alert("Email já esta sendo utilizado. Verifique os dados e tente novamente")
        }
    }

    const deleteAccountHandler = async () => {
        const confirmed = window.confirm("Tem certeza que deseja apagar sua conta? Após isso não haverá mais volta.")

        if (confirmed) {
            const res = await fetch("http://localhost:3000/user/delete", { credentials: "include" })
            if (res.ok) {
                alert("Dados alterados com sucesso!")
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
            else{
                alert("Erro ao deletar a conta. Tente novamente mais tarde.")
            }
        }
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
                    <button onClick={deleteAccountHandler} className="cursor-pointer p-2 w-fit h-fit rounded bg-red-500 font-bold text-[var(--cor-background)] ">Apagar conta</button>
                </div>
            </div>
            <form id="profForm" onSubmit={alterDataHandler} className="mt-10 grid grid-cols-2 max-w-fit gap-10  mx-auto" action="">
                <div className="user_form_div">
                    <label htmlFor="nome">Nome:</label>
                    <input onChange={(e) => {
                        if (e.target.value === "") {
                            setNome(user.nome)
                        } else {
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
                            else {
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
