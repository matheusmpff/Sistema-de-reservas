import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import SideBar from "../src/components/sideBar";
import Home from "../src/pages/Home";
import Andamento from "./pages/Andamento";
import Quartos from "./pages/Quartos";
import Hospedes from "./pages/Hospedes";
import Feedbacks from "./pages/Feedback";
import Login from "./pages/Login";

function DashboardLayout({ saudacao }) {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <SideBar />

      <div className="flex-1 h-full p-6 text-offwhite overflow-y-auto bg-transparent">
        <div className="text-6xl">{saudacao}! Usuário.</div>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  const horaAtual = new Date().getHours();
  let saudacao = "";
  if (horaAtual >= 5 && horaAtual < 12) {
    saudacao = "Bom dia";
  } else if (horaAtual >= 12 && horaAtual < 18) {
    saudacao = "Boa tarde";
  } else {
    saudacao = "Boa noite";
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route element={<DashboardLayout saudacao={saudacao} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/andamento" element={<Andamento />} />
          <Route path="/quartos" element={<Quartos />} />
          <Route path="/hospedes" element={<Hospedes />} />
          <Route path="/feedback" element={<Feedbacks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}