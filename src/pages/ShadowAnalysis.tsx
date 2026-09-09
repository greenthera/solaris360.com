import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/solaris-india-industrial.webp'
import contentImg from '../assets/solaris-india-consultation.webp'
import { PageHero, Section, ImageBand } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { company, wa } from '../content/company'

export default function ShadowAnalysis() {
  return (
    <>
      <Seo
        title="Shadow Analysis"
        description="Ready-made shadow analysis reports on PVsyst and Helioscope for empanelled agencies, at a reasonable price. Consultation on civil works and stability certificates from a licensed structural engineer."
        path="/shadow-analysis/"
      />
      <PageHero image={pageHeroImg}
        eyebrow="Other Services"
        title="Shadow analysis"
        intro="We model the sun path across your roof so every string is placed clear of shade."
      />
      <Section>
        <Reveal stagger as="div" className="grid gap-3 md:grid-cols-2">
            <div className="kw-card">
              <h2 className="font-display text-lg">Shadow Analysis on PVsyst</h2>
              <p className="mt-2 text-sm text-muted">
                We can also provide consultation on civil works and stability certificates from a
                licensed structural engineer for rooftop solar projects. Reach us at{' '}
                <a href={`tel:${company.phone.mainDigits}`} className="text-orange">
                  9998117531
                </a>{' '}
                or{' '}
                <a href={`mailto:${company.email.general}`} className="text-orange">
                  {company.email.general}
                </a>
                .
              </p>
            </div>
            <div className="kw-card">
              <h2 className="font-display text-lg">Shadow Analysis on Helioscope</h2>
              <p className="mt-2 text-sm text-muted">
                We provide ready-made shadow analysis reports for empanelled agencies as per their
                requirement at a very reasonable price. Contact our team at{' '}
                <a href={`tel:${company.phone.shadowStructureDigits}`} className="text-orange">
                  9904277712
                </a>{' '}
                or email{' '}
                <a href={`mailto:${company.email.shadowStructure}`} className="text-orange">
                  {company.email.shadowStructure}
                </a>
                .
              </p>
              <a
                href={wa('I am interested', company.phone.shadowStructureDigits)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-5"
              >
                Enquire on WhatsApp
              </a>
            </div>
          </Reveal>
      </Section>
      <ImageBand image={contentImg} alt="Indian solar consultant discussing a rooftop plan with homeowners on their veranda" />
    </>
  )
}
