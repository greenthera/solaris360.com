import type { RouteRecord } from 'vite-react-ssg'
import { Layout } from './components/layout/Layout'

// Router-level `lazy` (not React.lazy): the SSG resolves it before rendering, so each
// page's HTML lands inside <main> instead of a hidden Suspense chunk after the footer,
// and the client resolves the matched route before hydrating. Keep the import() inline
// in each `lazy` - vite-react-ssg reads it from the function source to preload the chunk.
const page = (m: { default: React.ComponentType }) => ({ Component: m.default })

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/components/layout/Layout.tsx',
    children: [
      { index: true, lazy: () => import('./pages/Home').then(page) },

      { path: 'about/', lazy: () => import('./pages/About').then(page) },
      { path: 'why-solar/', lazy: () => import('./pages/WhySolar').then(page) },
      { path: 'why-us/', lazy: () => import('./pages/WhyUs').then(page) },
      { path: 'reviews/', lazy: () => import('./pages/Reviews').then(page) },

      { path: 'epc-services/', lazy: () => import('./pages/EpcServices').then(page) },
      { path: 'solar-pv-system/', lazy: () => import('./pages/SolarPvSystem').then(page) },
      { path: 'system-features/', lazy: () => import('./pages/SystemFeatures').then(page) },
      { path: 'project-gallery/', lazy: () => import('./pages/ProjectGallery').then(page) },
      { path: 'execution-process/', lazy: () => import('./pages/ExecutionProcess').then(page) },

      { path: 'shadow-analysis/', lazy: () => import('./pages/ShadowAnalysis').then(page) },
      { path: 'stability-certificate/', lazy: () => import('./pages/StabilityCertificate').then(page) },
      { path: 'warranty/', lazy: () => import('./pages/Warranty').then(page) },

      { path: 'how-solar-power-works/', lazy: () => import('./pages/HowSolarPowerWorks').then(page) },
      { path: 'faq/', lazy: () => import('./pages/Faq').then(page) },
      { path: 'useful-links/', lazy: () => import('./pages/UsefulLinks').then(page) },

      { path: 'emi-calculator/', lazy: () => import('./pages/EmiCalculator').then(page) },
      { path: 'contact/', lazy: () => import('./pages/Contact').then(page) },

      { path: 'terms/', lazy: () => import('./pages/Terms').then(page) },
      { path: 'privacy/', lazy: () => import('./pages/Privacy').then(page) },
      { path: 'returns/', lazy: () => import('./pages/ReturnCancellation').then(page) },
      { path: 'shipping/', lazy: () => import('./pages/ShippingTransportation').then(page) },

      { path: '*', lazy: () => import('./pages/NotFound').then(page) },
    ],
  },
]
