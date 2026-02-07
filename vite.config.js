import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: '/kurt-project/', // Set this to matches your GitHub repository name
  base: './', // Use relative paths so it works on any repo name
})
