import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from the domain root (www.solaris360.com via a CNAME on gh-pages).
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
  },
  ssr: {
    noExternal: ['gsap'],
  },
})
