import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/solaris-panorama-about.webp'
import { PageHero, Section } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { company } from '../content/company'
import { testimonials } from '../content/testimonials'

export default function Reviews() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: company.legalName,
      url: company.domain,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: company.reviews.average,
        reviewCount: company.reviews.count,
        bestRating: 5,
      },
      review: testimonials.slice(0, 12).map((t) => ({
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: t.rating, bestRating: 5 },
        author: { '@type': 'Person', name: t.author },
        reviewBody: t.text,
      })),
    },
  ]

  return (
    <>
      <Seo
        title="Reviews"
        description={`What Solaris360 customers say - ${company.reviews.count} Google reviews, rated ${company.reviews.average} out of 5, for rooftop solar EPC across Surat.`}
        path="/reviews/"
        jsonLd={jsonLd}
      />
      <PageHero
        image={pageHeroImg}
        eyebrow="About"
        title="What our customers say"
        intro={
          <span>
            Rated {company.reviews.average} out of 5 across {company.reviews.count} Google reviews.{' '}
            <a
              href={company.reviews.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange underline"
            >
              Read them on Google
            </a>
            .
          </span>
        }
      />

      <Section>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <Reveal
              key={i}
              className="mb-4 block break-inside-avoid border border-white/10 bg-navy/40 p-5"
            >
              <p className="font-mono text-xs text-orange" aria-hidden="true">
                {'★'.repeat(t.rating)}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-paper/85">
                {t.text}
              </p>
              <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                {t.author}
                {t.date ? ` · ${t.date}` : ''}
              </p>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted">
          Reviews are from Solaris360's Google Business profile.{' '}
          <a
            href={company.reviews.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange underline"
          >
            See all {company.reviews.count} reviews
          </a>
          .
        </p>
      </Section>
    </>
  )
}
