import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import just what we need from bootstrap
import 'bootstrap/js/dist/button';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/tab';

import Quartos from './pages/Quartos.tsx'
import Cadastro from './pages/Cadastro.tsx'

import './styles/style.scss'
import Feedback from './pages/Feedback.tsx';
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Cadastro />
  </StrictMode>,
)
