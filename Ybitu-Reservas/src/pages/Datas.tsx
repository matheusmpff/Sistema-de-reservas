import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { useOutletContext } from "react-router";
import type { UseBookCont } from "../types";

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < breakpoint : false
    );

    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, [breakpoint]);

    return isMobile;
}

export default function Datas() {
    const [reservas, setReservas] = useOutletContext<UseBookCont>()
    const [range, setRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

    const isMobile = useIsMobile();

    useEffect(() => {
        if (range === undefined || range.from === undefined || range.to === undefined || range.from == range.to) {
            console.log("pai")
            return;
        }
        console.log("mae")
        let date_in = range.from;
        let date_out = range.to;

        setReservas({
            currentID: reservas.currentID,
            bookings: reservas.bookings.map((book) => {
                if (book.id == reservas.currentID) {
                    return {
                        ...book,
                        date_in: date_in,
                        date_out: date_out,
                    };
                }
                return book;
            })
        })
    }, [range])

    return (
        <>
            <div className="container mx-auto min-h-screen p-4 md:p-6 flex flex-col items-center">
                <p className="text-lg md:text-2xl font-medium text-gray-700 mb-6 self-center text-center">
                    Selecione o período da sua estadia:
                </p>
                <div className="relative p-3 md:p-6 rounded-2xl shadow-2xl w-full lg:w-min bg-transparent flex justify-center overflow-x-auto">
                    <DayPicker
                        locale={ptBR}
                        mode="range"
                        selected={range}
                        onSelect={setRange}
                        numberOfMonths={isMobile ? 1 : 2}
                        showOutsideDays={true}
                        classNames={{
                            months: "flex flex-col sm:flex-row gap-4 md:gap-8",
                            month: "space-y-4",
                            month_caption: "flex justify-center pt-1 relative items-center mb-4",
                            caption_label:
                                "text-sm font-semibold text-gray-800 bg-white px-3 py-1.5 md:px-4 md:py-2 text-base md:text-2xl lg:text-4xl rounded-2xl shadow-sm first-letter:uppercase",
                            nav: "absolute top-7 md:top-9 left-2 md:left-4 right-2 md:right-4 flex justify-between items-center pointer-events-none z-10",
                            button_previous:
                                "pointer-events-auto h-8 w-8 md:h-10 md:w-10 bg-white text-gray-700 shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer",
                            button_next:
                                "pointer-events-auto h-8 w-8 md:h-10 md:w-10 bg-white text-gray-700 shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer",
                            month_grid: "w-full border-collapse",
                            weekdays: "flex justify-between",
                            weekday:
                                "text-gray-500 rounded-md w-8 md:w-9 font-semibold text-xs md:text-[0.85rem] text-center mb-2",
                            week: "flex w-full mb-1 justify-between",
                            day: "h-9 w-9 md:h-12 md:w-12 text-center text-sm md:text-md p-0 relative focus-within:relative focus-within:z-20 flex items-center justify-center",
                            day_button:
                                "h-9 w-9 md:h-12 md:w-11 p-0 font-bold shadow-black bg-white rounded-sm transition-all cursor-pointer flex items-center justify-center hover:bg-[#1a5c43] hover:text-white text-xs md:text-sm",
                            selected: "text-white [&>button]:!bg-transparent",
                            range_start:
                                "!bg-[var(--cor-primaria)] !text-white rounded-sm font-semibold [&>button]:!bg-transparent [&>button]:shadow-2xl",
                            range_end:
                                "!bg-[var(--cor-primaria)] !text-white rounded-sm font-semibold shadow-2xl [&>button]:!bg-transparent",
                            range_middle:
                                "!bg-[#BCBCBC] !text-[var(--cor-primaria)] rounded-none hover:bg-[#93a69c] [&>button]:!bg-transparent",
                            outside:
                                "!bg-transparent opacity-60 pointer-events-none [&>button]:!text-gray-500 [&>button]:!bg-transparent [&>button]:!shadow-none",
                        }}
                    />
                </div>
                {range?.from && (
                    <p className="mt-4 text-sm text-gray-500 text-center">
                        Selecionado: {range.from.toLocaleDateString("pt-BR")}
                        {range.to && ` até ${range.to.toLocaleDateString("pt-BR")}`}
                    </p>
                )}
            </div>
        </>
    );
}
