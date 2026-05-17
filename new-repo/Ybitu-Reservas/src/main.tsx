import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router";

import Quartos from "./pages/Quartos.tsx";
import Pagamento from "./pages/Pagamento.tsx";
import Feedback from "./pages/Feedback.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import Home from "./pages/Home.tsx";

import "./styles/style.scss"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="min-h-screen flex flex-col justify-between">

        <Header />


        <Routes>
          <Route index element={<Quartos />} />
          <Route path="home" element={<Home />} />
          <Route path="cadastro" element={<Cadastro />} />
          <Route path="Quartos" element={<Quartos />} />
          <Route path="Pagamento" element={<Pagamento />} />
          <Route path="feedback" element={<Feedback />} />
        </Routes>


        <Footer />

      </div>
    </BrowserRouter>
  </StrictMode>,
)
