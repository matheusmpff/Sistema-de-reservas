import { Link } from "react-router";
export default function NotFound() {
    return (
        <div className="container mx-auto min-h-[80vh] flex flex-col items-center justify-center px-8">
            <div className="text-7xl md:text-9xl text-[var(--cor-primaria)]">
                ERRO  404
            </div>
            <div className="mt-10 text-2xl md:text-3xl">PÁGINA NÃO ENCONTRADA</div>
            
                <div className="text-sm p-3 mt-4 border-2 border-solid border-gray-900 rounded-3xl"> A página foi movida ou caminho inválido.<Link className="font-bold text-[var(--cor-primaria)]" to={"/"}>Clique aqui para retornar a página inicial.</Link> </div>
            
        </div>
    );
};
