import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/style.scss'
// import App from './App.tsx'
import Quartos from './pages/Quartos.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Quartos />
  </StrictMode>,
)
