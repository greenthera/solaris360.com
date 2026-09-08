import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from a sub-path on GitHub Pages: greenthera.shivantra.com/solaris360.com/
  // (repo name is "solaris360.com"). Change to '/' when moving to the apex domain.
  base: '/solaris360.com/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
  },
  ssr: {
    noExternal: ['gsap'],
  },
})
