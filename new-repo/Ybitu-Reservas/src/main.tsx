import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router";

import Quartos from "./pages/Quartos.tsx";
import Pagamento from "./pages/Pagamento.tsx";
import Feedback from "./pages/Feedback.tsx";

import "./styles/style.scss"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Quartos />} />
        <Route path="Quartos" element={<Quartos />} />
        <Route path="Pagamento" element={<Pagamento />} />
        <Route path="feedback" element={<Feedback />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
