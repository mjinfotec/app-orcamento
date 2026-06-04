import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // O nome abaixo DEVE ser exatamente o nome que aparece na URL do seu repositório
  base: "/APP-ORCAMENTO/", 
})