import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import SideBar from "../src/components/sideBar";
import Home from "../src/pages/Home";
import Andamento from "./pages/Andamento";
import Quartos from "./pages/Quartos";
import Hospedes from "./pages/Hospedes";
import Feedbacks from "./pages/Feedback";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

// Guarda de rota: se não tiver token, manda pro login
function PrivateRoute() {
  return localStorage.getItem("token")
    ? <Outlet />
    : <Navigate to="/" replace />;
}

function DashboardLayout() {
  const horaAtual = new Date().getHours();
  const saudacao =
    horaAtual >= 5 && horaAtual < 12 ? "Bom dia" :
    horaAtual >= 12 && horaAtual < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <SideBar />
      <div className="flex-1 h-full p-6 text-offwhite overflow-y-auto bg-transparent">
        <div className="text-6xl mb-2">{saudacao}!</div>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas privadas — redireciona para / se não autenticado */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/andamento" element={<Andamento />} />
            <Route path="/quartos" element={<Quartos />} />
            <Route path="/hospedes" element={<Hospedes />} />
            <Route path="/feedback" element={<Feedbacks />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}