import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router";

import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import Quartos from "./pages/Quartos.tsx";
import Pagamento from "./pages/Pagamento.tsx";
import Feedback from "./pages/Feedback.tsx";

import "./styles/style.scss"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
        <Header />

        <div className="pt-24">
          <Routes>
            <Route path="login" element={<Login />} />
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="cadastro" element={<Cadastro />} />
            <Route path="Quartos" element={<Quartos />} />
            <Route path="Pagamento" element={<Pagamento />} />
            <Route path="feedback" element={<Feedback />} />
          </Routes>
        </div>

        <Footer />
    </BrowserRouter>
  </StrictMode>,
)
