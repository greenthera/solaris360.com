import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import { initCookieConsent } from './lib/cookieConsent'
import './styles/globals.css'

export const createRoot = ViteReactSSG({ routes, basename: import.meta.env.BASE_URL }, ({ isClient }) => {
  // once, outside React (no StrictMode double-run), and never during prerender
  if (isClient) initCookieConsent()
})
