import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', // Use '/' for Vercel/Netlify, or '/kurt-project/dist/' for XAMPP
  // base: '/kurt-project/', // Set this to matches your GitHub repository name
})
