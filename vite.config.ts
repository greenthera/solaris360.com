import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// type-only: loads the `ssgOptions` augmentation of vite's UserConfig
import type {} from 'vite-react-ssg/node'

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
  ssgOptions: {
    // also render the catch-all route as /404 -> dist/404.html, which GitHub Pages
    // serves (with HTTP 404) for any unknown URL
    includedRoutes: (paths) => [...paths.filter((p) => !p.includes(':') && !p.includes('*')), '/404'],
  },
})
