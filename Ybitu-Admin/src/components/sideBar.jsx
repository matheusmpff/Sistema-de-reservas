import React from "react";
import { Link } from "react-router";

export default function sideBar () {
    return (
        <div className="w-[15%] h-screen flex flex-col bg-cor-primaria-clara text-offwhite">
            <img></img>
            <div>
                <Link to={""}>
                    <img></img>
                    <span>Home</span>
                </Link>
                <Link to={""}>
                    <img></img>
                    <span>Andamento</span>
                </Link>
                <Link to={""}>
                    <img></img>
                    <span>Quartos</span>
                </Link>
                <Link to={""}>
                    <img></img>
                    <span>Hóspedes</span>
                </Link>
                <Link to={""}>
                    <img></img>
                    <span>Feedback</span>
                </Link>
            </div>
            <button></button>
        </div>
    )
}