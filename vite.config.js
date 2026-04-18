import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src/',
  build: {
    rolldownOptions: {
      input: {
        cadastro: resolve(import.meta.dirname, 'src/cadastro.html'),
        login: resolve(import.meta.dirname, 'src/login.html'),
        calendario: resolve(import.meta.dirname, 'src/calendario.html'),
        quartos: resolve(import.meta.dirname, 'src/quartos.html'),
        pagamento: resolve(import.meta.dirname, 'src/pagamento.html'),
        feedback: resolve(import.meta.dirname, 'src/feedback.html'),
      },
    },
    outDir: '../dist/',
    emptyOutDir: true,
  },
})
