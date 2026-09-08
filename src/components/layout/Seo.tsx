import { Head } from 'vite-react-ssg'
import { company } from '../../content/company'

interface SeoProps {
  title: string
  description: string
  /** path only, e.g. "/emi-calculator/" */
  path: string
  /** absolute or /public-relative image for og:image */
  image?: string
  type?: 'website' | 'article'
  /** extra JSON-LD blocks */
  jsonLd?: object[]
  /** breadcrumb trail (last item = current page); "/" is prepended automatically */
  breadcrumbs?: { name: string; path: string }[]
  noindex?: boolean
  /** ISO date for articles */
  published?: string
  /** image URL to <link rel=preload as=image> (LCP hint) */
  preloadImage?: string
}

const SITE = company.domain
const OG_IMAGE = `${SITE}/og-default.jpg`
const LOGO = `${SITE}/favicon.svg`

/** LocalBusiness - emitted once, on every page. */
const businessLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'GeneralContractor'],
  '@id': `${SITE}/#business`,
  name: company.legalName,
  alternateName: company.name,
  description:
    'Rooftop solar power EPC in Surat - design, GEDA / DISCOM liasoning, supply, installation, commissioning, shadow analysis and structural stability certification for homes and businesses.',
  url: SITE,
  logo: LOGO,
  image: OG_IMAGE,
  telephone: company.phone.main,
  email: company.email.general,
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'GF/21, Palladium, VIP Road, Vesu',
    addressLocality: company.city,
    addressRegion: company.state,
    postalCode: company.postalCode,
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: company.geo.lat, longitude: company.geo.lng },
  hasMap: company.mapUrl,
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '17:00',
  },
  sameAs: [company.social.youtube],
  areaServed: [
    { '@type': 'City', name: 'Surat' },
    { '@type': 'AdministrativeArea', name: 'South Gujarat' },
  ],
  knowsAbout: ['Rooftop solar', 'Solar EPC', 'Net metering', 'Shadow analysis', 'Solar plant insurance'],
}

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: SITE,
  name: company.name,
  publisher: { '@id': `${SITE}/#business` },
  inLanguage: 'en-IN',
}

export function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  jsonLd = [],
  breadcrumbs,
  noindex = false,
  published,
  preloadImage,
}: SeoProps) {
  const url = SITE + path
  const fullTitle = path === '/' ? title : `${title} - ${company.name}`
  const ogImage = image ? (image.startsWith('http') ? image : SITE + image) : OG_IMAGE

  const blocks: object[] = [businessLd, websiteLd, ...jsonLd]

  if (breadcrumbs && breadcrumbs.length) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Home', path: '/' }, ...breadcrumbs].map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: SITE + c.path,
      })),
    })
  }

  return (
    <Head>
      <html lang="en-IN" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {preloadImage && <link rel="preload" as="image" href={preloadImage} fetchPriority="high" />}
      <meta
        name="robots"
        content={noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1'}
      />

      <meta property="og:site_name" content={company.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${company.name} - ${title}`} />
      {type === 'article' && published && (
        <meta property="article:published_time" content={published} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Head>
  )
}
