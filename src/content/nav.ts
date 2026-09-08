/**
 * Navigation tree - mirrors the current solaris360.com mega-menu, minus the
 * shop and blog (removed for this build), plus:
 *   - Other Services > Warranty
 *   - Knowledge Center > EMI Calculator
 */

export interface NavLink {
  label: string
  to: string
  external?: boolean
}

export interface NavGroup {
  label: string
  /** group header can itself be a link */
  to?: string
  columns: { heading?: string; links: NavLink[] }[]
}

export const nav: NavGroup[] = [
  {
    label: 'About',
    columns: [
      {
        links: [
          { label: 'Solaris 360', to: '/about/' },
          { label: 'Why Solar', to: '/why-solar/' },
          { label: 'Why Solaris 360', to: '/why-us/' },
        ],
      },
    ],
  },
  {
    label: 'EPC Services',
    to: '/epc-services/',
    columns: [
      {
        links: [
          { label: 'EPC Services', to: '/epc-services/' },
          { label: 'Solar PV System', to: '/solar-pv-system/' },
          { label: 'System Features', to: '/system-features/' },
          { label: 'Project Gallery', to: '/project-gallery/' },
          { label: 'Execution Process', to: '/execution-process/' },
        ],
      },
    ],
  },
  {
    label: 'Other Services',
    columns: [
      {
        links: [
          { label: 'Shadow Analysis', to: '/shadow-analysis/' },
          { label: 'Stability Certificate', to: '/stability-certificate/' },
          { label: 'Warranty', to: '/warranty/' },
        ],
      },
    ],
  },
  {
    label: 'Knowledge Center',
    columns: [
      {
        links: [
          { label: 'How Solar Power Works', to: '/how-solar-power-works/' },
          { label: 'FAQ', to: '/faq/' },
          { label: 'Useful Links', to: '/useful-links/' },
          { label: 'EMI Calculator', to: '/emi-calculator/' },
        ],
      },
    ],
  },
  {
    label: 'Contact Us',
    to: '/contact/',
    columns: [],
  },
]

/** Flat list for the footer + sitemap. */
export const footerNav = {
  Company: [
    { label: 'About', to: '/about/' },
    { label: 'Why Solar', to: '/why-solar/' },
    { label: 'Why Solaris 360', to: '/why-us/' },
    { label: 'Project Gallery', to: '/project-gallery/' },
    { label: 'Execution Process', to: '/execution-process/' },
  ],
  Services: [
    { label: 'EPC Services', to: '/epc-services/' },
    { label: 'Solar PV System', to: '/solar-pv-system/' },
    { label: 'System Features', to: '/system-features/' },
    { label: 'Shadow Analysis', to: '/shadow-analysis/' },
    { label: 'Stability Certificate', to: '/stability-certificate/' },
  ],
  Support: [
    { label: 'How Solar Power Works', to: '/how-solar-power-works/' },
    { label: 'FAQ', to: '/faq/' },
    { label: 'Useful Links', to: '/useful-links/' },
    { label: 'Warranty', to: '/warranty/' },
    { label: 'EMI Calculator', to: '/emi-calculator/' },
  ],
  Policies: [
    { label: 'Terms & Conditions', to: '/terms/' },
    { label: 'Privacy Policy', to: '/privacy/' },
    { label: 'Return & Cancellation', to: '/returns/' },
    { label: 'Shipping & Transportation', to: '/shipping/' },
  ],
} satisfies Record<string, NavLink[]>
