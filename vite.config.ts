import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// type-only: loads the `ssgOptions` augmentation of vite's UserConfig
import type {} from 'vite-react-ssg/node'

// https://vite.dev/config/
export default defineConfig({
  // Served from the domain root: GitHub Pages custom domain solaris360.com (public/CNAME).
  // Was '/solaris360.com/' while staged at greenthera.shivantra.com/solaris360.com/.
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    // Keep unused Unicode subsets out of every page's CSS payload.
    assetsInlineLimit: (filePath) => filePath.endsWith('.woff2') ? false : undefined,
    cssCodeSplit: true,
  },
  ssr: {
    noExternal: ['gsap'],
  },
  ssgOptions: {
    // Only the three above-the-fold Latin faces are preloaded in index.html.
    beastiesOptions: { preloadFonts: false },
    // SSG otherwise preloads every Unicode subset referenced by the global CSS.
    // Unused languages/weights should remain demand-loaded by @font-face.
    onPageRendered: (_route, html) => html.replace(/<link\b[^>]*>/g, (tag) =>
      tag.includes('as="font"') && !tag.includes('data-critical-font') ? '' : tag,
    ),
    // also render the catch-all route as /404 -> dist/404.html, which GitHub Pages
    // serves (with HTTP 404) for any unknown URL
    includedRoutes: (paths) => [...paths.filter((p) => !p.includes(':') && !p.includes('*')), '/404'],
  },
})
