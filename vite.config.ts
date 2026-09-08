import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works both at the domain root and when
  // served from a project subpath (e.g. GitHub Pages /<repo>/).
  base: './',
  plugins: [react()],
})
