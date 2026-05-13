import logo from '../assets/logo.png'
import seta from '../assets/seta_carrinho.svg'

export default function Header() {

    const animatedLink = "relative hover:cursor-pointer after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-green-800 after:left-0 after:-bottom-1 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300"

    // Classes para o efeito de brilho de lado no botão
    const cartButtonClasses = "flex flex-row items-center justify-between hover:cursor-pointer bg-green-800 text-white font-bold py-4 px-8 rounded-lg mr-8 relative overflow-hidden group transition-colors duration-300 hover:bg-green-700"
    const cartIconClasses = "bg-amber-300 w-[30%] aspect-square rounded-sm z-10 flex items-center justify-center"

    return (
        <header className="flex items-center justify-between p-4 mt-4">
            <div className="ml-8">
                <img src={logo} alt="Logo da Pousada Ybitu" />
            </div>
            <nav className="w-[80%]">
                <ul className="w-full flex justify-center gap-16 text-md font-semibold">
                    <a className={animatedLink}>HOME</a>
                    <a className={animatedLink}>POUSADA YBITU</a>
                    <a className={animatedLink}>PASSEIOS E EVENTOS</a>
                    <a className={animatedLink}>CONTATO</a>
                </ul>
            </nav>
            <button className={cartButtonClasses}>
                {/* Camada de brilho que atravessa */}
                <div className="absolute inset-0 w-1/2 h-full bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-[200%] transition-transform duration-500 ease-out z-0"></div>
                
                <span className={cartIconClasses}>
                    <img src={seta} alt="Ícone do carrinho de compras" className="w-full h-6 z-0" />
                </span>
                <span className="relative z-10">VER CARRINHO</span>
            </button>
        </header>
    )
}