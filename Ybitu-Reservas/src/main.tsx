import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router";

import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import Quartos from "./pages/Quartos.tsx";
import Hospedes from "./pages/Hospedes.tsx";
import Pagamento from "./pages/Pagamento.tsx";
import Feedback from "./pages/Feedback.tsx";
import Contato from "./pages/Contato.tsx";
import Datas from "./pages/Datas.tsx";
import NotFound from "./pages/NotFound.tsx";
import Usuario from "./pages/Usuario.tsx";

import "./styles/style.scss"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
        <Header />

        <div className="pt-24">
          <Routes>
            <Route index element={<Home />} />
            <Route path="Home" element={<Home />} />
            <Route path="Contato" element={<Contato />} />
            <Route path="Cadastro" element={<Cadastro />} />
            <Route path="Login" element={<Login />} />
            <Route path="Data" element={<Datas />} />
            <Route path="Quartos" element={<Quartos />} />
            <Route path="Hóspedes" element={<Hospedes />} />
            <Route path="Pagamento" element={<Pagamento />} />
            <Route path="Feedback" element={<Feedback />} />
            <Route path="Usuario" element={<Usuario />} />
            <Route path="*" element={<NotFound/>}></Route>
          </Routes>
        </div>

        <Footer />
    </BrowserRouter>
  </StrictMode>,
)
