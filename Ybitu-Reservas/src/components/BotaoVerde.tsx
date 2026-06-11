
import type { ReactElement} from "react";

interface BotaoProps {
    text: string;
    icon?: ReactElement
}

export default function BotaoVerde(params: BotaoProps) {
    return (
        <button className={`cursor-pointer font-semibold flex bg-(--cor-primaria) py-5 rounded px-5 text-(--cor-background) text-center`}>
            {params.text}
            {params.icon ? params.icon : null}
        </button>
    )
};
