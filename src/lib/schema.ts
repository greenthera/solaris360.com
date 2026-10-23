/**
 * Page-specific JSON-LD blocks, passed to <Seo jsonLd={[...]}>. Seo.tsx emits the
 * site-wide LocalBusiness / WebSite / WebPage / BreadcrumbList blocks itself.
 */
import { company } from '../content/company'

const SITE = company.domain

/** Free browser tool (EMI / ROI calculators). */
export function calculatorLd(name: string, path: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${SITE}${path}#app`,
    name,
    url: SITE + path,
    description,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any (web browser)',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    provider: { '@id': `${SITE}/#business` },
    inLanguage: 'en-IN',
  }
}

/** A service the business offers (EPC Services page). */
export function serviceLd(name: string, path: string, description: string, serviceType: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE}${path}#service`,
    name,
    serviceType,
    description,
    url: SITE + path,
    provider: { '@id': `${SITE}/#business` },
    areaServed: [
      { '@type': 'City', name: 'Surat' },
      { '@type': 'AdministrativeArea', name: 'South Gujarat' },
    ],
  }
}
