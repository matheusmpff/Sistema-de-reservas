import { UserCircle2 } from "lucide-react";

type userProps = {
    email: string
    senha: string
    nome: string
}
export default function Profile({user}: {user: userProps}) {

    const alterDataHandler = async () =>{
        await fetch("http://localhost:3000/user/alterData",{method:"POST",credentials:"include"});   
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
                    <button  className="cursor-pointer p-2 w-fit h-fit rounded bg-red-500 font-bold text-[var(--cor-background)] ">Apagar conta</button>
                </div>
            </div>
            <form className="mt-10 grid grid-cols-2 max-w-fit gap-10  mx-auto" action="">
                <div className="user_form_div">
                    <label htmlFor="nome">Nome:</label>
                    <input className="user_form_option" type="text" id="nome" value={user.nome} />
                </div>
                <div className="user_form_div">
                    <label htmlFor="email">E-mail:</label>
                    <input className="user_form_option" type="email" id="email" value={user.email} />
                </div>
                <div className="user_form_div">
                    <label htmlFor="senha">Senha:</label>
                    <input className="user_form_option" type="password" id="senha" value={user.senha} />
                </div>
            </form>

            <div className="mt-10 flex items-center justify-center">
                <button onClick={alterDataHandler} className=" p-2 btn_primary">Alterar Dados</button>

            </div>
        </>
    );
};
