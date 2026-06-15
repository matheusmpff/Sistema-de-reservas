import "../styles/Usuario.css";
import { User } from "lucide-react";
import { BedDouble } from "lucide-react";
import { UserCircle2 } from "lucide-react";


export default function Usuario() {
    return (
        <div className="container mx-auto mt-20 flex flex-col md:flex-row min-h-[70vh]">
            <aside className=" min-w-fit flex flex-col items-center" >
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
            <div className="w-full px-4 pt-16 ">
                <div className="" >
                    <div className="flex justify-between items-center lg:justify-center lg:gap-80 xl:gap-100">
                        <div className="flex items-center justify-center ">
                            <UserCircle2 size={60}></UserCircle2>
                            <div className="ml-3 ">
                                <div className="text-xl">Donatello da Silva</div>
                                <div className="text-[12px]">donatellodasilva@gmail.com</div>
                            </div>

                        </div>
                        <button className="p-2 w-fit h-fit rounded bg-red-500 text-[var(--cor-background)] ">Apagar conta</button>
                    </div>
                </div>
                <div className="mt-12">
                    <form className="grid grid-cols-2 max-w-fit gap-10  mx-auto" action="">
                        <div className="user_form_div">
                            <label htmlFor="nome">Nome:</label>
                            <input className="user_form_option" type="text" id="nome"  value={123456} />
                        </div>
                        <div className="user_form_div">
                            <label htmlFor="email">E-mail:</label>
                            <input className="user_form_option" type="email" id="email" value={123456} />
                        </div>
                        <div className="user_form_div">
                            <label htmlFor="senha">Senha:</label>
                            <input className="user_form_option" type="password" id="senha" value={123456} />
                        </div>
                    </form>

                    <div className="mt-10 flex items-center justify-center">
                        <button className=" p-2 btn_primary">Alterar Dados</button>
                        
                    </div>
                </div>
            </div>
        </div>

    );
};
