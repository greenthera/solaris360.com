import { lazy } from 'react'
import type { RouteRecord } from 'vite-react-ssg'
import { Layout } from './components/layout/Layout'

const page = (loader: () => Promise<{ default: React.ComponentType }>) => ({
  Component: lazy(loader),
})

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/components/layout/Layout.tsx',
    children: [
      { index: true, ...page(() => import('./pages/Home')) },

      { path: 'about/', ...page(() => import('./pages/About')) },
      { path: 'why-solar/', ...page(() => import('./pages/WhySolar')) },
      { path: 'why-us/', ...page(() => import('./pages/WhyUs')) },
      { path: 'reviews/', ...page(() => import('./pages/Reviews')) },

      { path: 'epc-services/', ...page(() => import('./pages/EpcServices')) },
      { path: 'solar-pv-system/', ...page(() => import('./pages/SolarPvSystem')) },
      { path: 'system-features/', ...page(() => import('./pages/SystemFeatures')) },
      { path: 'project-gallery/', ...page(() => import('./pages/ProjectGallery')) },
      { path: 'execution-process/', ...page(() => import('./pages/ExecutionProcess')) },

      { path: 'shadow-analysis/', ...page(() => import('./pages/ShadowAnalysis')) },
      { path: 'stability-certificate/', ...page(() => import('./pages/StabilityCertificate')) },
      { path: 'warranty/', ...page(() => import('./pages/Warranty')) },

      { path: 'how-solar-power-works/', ...page(() => import('./pages/HowSolarPowerWorks')) },
      { path: 'faq/', ...page(() => import('./pages/Faq')) },
      { path: 'useful-links/', ...page(() => import('./pages/UsefulLinks')) },

      { path: 'emi-calculator/', ...page(() => import('./pages/EmiCalculator')) },
      { path: 'contact/', ...page(() => import('./pages/Contact')) },

      { path: 'terms/', ...page(() => import('./pages/Terms')) },
      { path: 'privacy/', ...page(() => import('./pages/Privacy')) },
      { path: 'returns/', ...page(() => import('./pages/ReturnCancellation')) },
      { path: 'shipping/', ...page(() => import('./pages/ShippingTransportation')) },

      { path: '*', ...page(() => import('./pages/NotFound')) },
    ],
  },
]
