import { Link } from 'react-router-dom'
import { Seo } from '../components/layout/Seo'
import { SolarEcosystem } from '../components/home/SolarEcosystem'
import { Hero } from '../components/home/Hero'
import { heroBgUrl } from '../lib/heroBg'
import { VideoShowcase } from '../components/home/VideoShowcase'
import { EmiTeaser } from '../components/home/EmiTeaser'
import { SolarSchematic } from '../components/home/SolarSchematic'
import { FaqSolarLoop } from '../components/home/FaqSolarLoop'
import { Testimonials } from '../components/home/Testimonials'
import { Marquee } from '../components/ui/Marquee'
import { Counter } from '../components/ui/Counter'
import { Accordion } from '../components/ui/Accordion'
import { Reveal } from '../components/ui/Reveal'
import { Section, SectionTitle, FeatureCard } from '../components/ui/primitives'
import { whySolar, whyUs, systemFeatures, executionSteps, faq, marqueeItems } from '../content/site'
import { epcBlocks } from '../content/services'
import { company } from '../content/company'
import { testimonials } from '../content/testimonials'

/** Punchy English reviews for the home slider; the full set lives on /reviews/. */
const isMostlyLatin = (s: string) =>
  [...s].filter((c) => c.charCodeAt(0) < 0x250).length / s.length > 0.9
const homeTestimonials = testimonials
  .filter((t) => t.text.length >= 90 && t.text.length <= 300 && isMostlyLatin(t.text))
  .slice(0, 8)

export default function Home() {
  return (
    <>
      <Seo
        title="Solaris360 - Rooftop Solar EPC in Surat"
        description="Solaris360 designs, builds and monitors rooftop solar systems for homes and businesses in and around Surat. Go Green, Go Solar."
        path="/"
        preloadImage={heroBgUrl}
      />

      <Hero />

      <SolarEcosystem />

      <Marquee items={marqueeItems} aria-label="Agencies and certifications" />

      {/* Why solar */}
      <Section id="why-solar" className="border-b border-white/10">
        <SectionTitle eyebrow="Why solar" title="It adds up fast" />
        <Reveal stagger as="div" className="mt-10 grid gap-3 md:grid-cols-3">
          {whySolar.map((w) => (
            <FeatureCard key={w.label} metric={w.value} title={w.label}>
              {w.body}
            </FeatureCard>
          ))}
        </Reveal>
      </Section>

      {/* EPC */}
      <Section className="border-b border-white/10">
        <SectionTitle
          eyebrow="EPC Services"
          title="We handle everything on the roof"
          intro="Design, permits, supply, installation and commissioning - with a five-year service warranty."
        />
        <Reveal stagger as="div" className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {epcBlocks.slice(0, 4).map((b, i) => (
            <FeatureCard key={b.title} index={i + 1} title={b.title}>
              <span className="line-clamp-4">{b.body}</span>
            </FeatureCard>
          ))}
        </Reveal>
        <Link to="/epc-services/" className="btn btn-ghost mt-8">
          Full EPC scope
        </Link>
      </Section>

      {/* System features - bento */}
      <Section className="border-b border-white/10">
        <SectionTitle eyebrow="System features" title="What every system comes with" />
        <Reveal stagger as="div" className="mt-10 grid gap-3 md:grid-cols-4 md:grid-rows-2">
          <FeatureCard
            className="flex flex-col justify-center md:col-span-2 md:row-span-2"
            metric={
              <>
                <Counter to={25} /> <span className="text-2xl">years</span>
              </>
            }
            title="Tier-1 module performance warranty"
          >
            Every Solaris360 system pairs a 25-year linear output warranty on the modules with a
            5-year service warranty on the installation and 24×7 toll-free inverter support.
          </FeatureCard>
          {systemFeatures.slice(1, 5).map((f) => (
            <FeatureCard
              key={f.label}
              metric={
                f.text ?? (
                  <>
                    {f.prefix}
                    <Counter to={f.value as number} pad={f.pad} />
                    {f.unit === '%' ? '%' : ` ${f.unit}`}
                  </>
                )
              }
              title={f.label}
            />
          ))}
        </Reveal>
        <Link to="/system-features/" className="btn btn-ghost mt-8">
          All features
        </Link>
      </Section>

      <VideoShowcase />

      {/* How it works */}
      <Section className="border-b border-white/10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionTitle
            eyebrow="How solar power works"
            title="From the panel to the meter to the grid"
            intro="Panels make DC, the inverter makes AC, the meter counts it, and anything you don't use flows back to the grid for credit."
          />
          <Reveal className="kw-card">
            <SolarSchematic />
          </Reveal>
        </div>
        <Link to="/how-solar-power-works/" className="btn btn-ghost mt-8">
          The full explainer
        </Link>
      </Section>

      {/* Why us */}
      <Section className="border-b border-white/10">
        <SectionTitle eyebrow="Why Solaris 360" title="You’re in safe hands" />
        <Reveal stagger as="div" className="mt-10 grid gap-3 md:grid-cols-3">
          {whyUs.map((w, i) => (
            <FeatureCard key={w.title} index={i + 1} title={w.title}>
              {w.body}
            </FeatureCard>
          ))}
        </Reveal>
      </Section>

      {/* Reviews */}
      <Section className="border-b border-white/10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-orange">Reviews</p>
          <h2 className="text-2xl md:text-4xl">Rated {company.reviews.average} on Google</h2>
        </Reveal>
        <div className="mt-10">
          <Testimonials items={homeTestimonials} />
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          <Link to="/reviews/" className="text-orange underline">
            Read all {company.reviews.count} reviews
          </Link>
        </p>
      </Section>

      {/* EMI teaser */}
      <Section className="border-b border-white/10">
        <EmiTeaser />
      </Section>

      {/* Execution process */}
      <Section className="border-b border-white/10">
        <SectionTitle eyebrow="Execution process" title="Three stages to a live system" />
        <Reveal stagger as="ol" className="mt-10 grid gap-3 md:grid-cols-3">
          {executionSteps.map((s) => (
            <li key={s.n} className="kw-card" data-reveal-child>
              <span className="kw-card-index" aria-hidden="true">
                {String(s.n).padStart(2, '0')}
              </span>
              <span className="mb-3 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-orange">
                Step {s.n}
              </span>
              <h3 className="font-display text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section className="border-b border-white/10">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.78fr] lg:items-start">
          <div>
            <SectionTitle eyebrow="FAQ" title="Common questions" />
            <div className="mt-8">
              <Accordion reveal items={faq.map((f) => ({ q: f.q, a: f.a }))} />
            </div>
            <p className="mt-6 text-sm text-muted">
              More in the{' '}
              <Link to="/faq/" className="text-orange underline">
                full FAQ
              </Link>{' '}
              · or call{' '}
              <a href={`tel:${company.phone.mainDigits}`} className="text-orange">
                {company.phone.main}
              </a>
              .
            </p>
          </div>
          <FaqSolarLoop className="mx-auto w-full max-w-md lg:sticky lg:top-28 lg:max-w-none" />
        </div>
      </Section>
    </>
  )
}
