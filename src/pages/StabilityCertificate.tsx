import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/hero-substation-dusk.webp'
import contentImg from '../assets/array-crew-dusk.webp'
import { PageHero, Section, ImageBand } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { company, wa } from '../content/company'

export default function StabilityCertificate() {
  return (
    <>
      <Seo
        title="Stability Certificate"
        description="Structural stability certificates from a licensed structural engineer for rooftop solar projects - for your building file and DISCOM submission."
        path="/stability-certificate/"
      />
      <PageHero
        image={pageHeroImg}
        eyebrow="Other Services"
        title="Structural stability certificate"
        intro="A licensed structural engineer's sign-off that your roof can carry the array - for your records and your DISCOM file."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start">
          <Reveal>
            <p className="max-w-xl text-lg leading-relaxed text-paper/90">
              We provide ready-made reports for empanelled agencies as per their requirement at a very
              reasonable price.
            </p>
          </Reveal>

          <Reveal className="border border-white/10 bg-navy p-6">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-orange">
              Contact our team
            </p>
            <dl className="mt-4 divide-y divide-white/10 text-sm">
              <div className="grid gap-1 py-3 sm:grid-cols-[5rem_1fr] sm:gap-3">
                <dt className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted">Phone</dt>
                <dd>
                  <a href={`tel:${company.phone.shadowStructureDigits}`} className="text-paper hover:text-orange">
                    9904277712
                  </a>
                </dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[5rem_1fr] sm:gap-3">
                <dt className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted">Email</dt>
                <dd className="min-w-0 [overflow-wrap:anywhere]">
                  <a
                    href={`mailto:${company.email.shadowStructure}`}
                    className="text-paper hover:text-orange"
                  >
                    {company.email.shadowStructure}
                  </a>
                </dd>
              </div>
            </dl>
            <a
              href={wa('I am interested', company.phone.shadowStructureDigits)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-5 w-full"
            >
              I am interested
            </a>
          </Reveal>
        </div>
      </Section>

      <ImageBand image={contentImg} alt="Rooftop solar installation at dusk" />
    </>
  )
}
