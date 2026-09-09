import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/solaris-india-industrial.webp'
import contentImg from '../assets/solaris-india-residential.webp'
import introImg from '../assets/solaris-india-consultation.webp'
import { PageHero, Section, SectionTitle, Card, ImageBand, MediaRow } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { whyUs } from '../content/site'

export default function About() {
  return (
    <>
      <Seo
        title="About Solaris 360"
        description="Solaris360 is a rooftop solar power EPC consulting and dealing in solar installations for industrial, commercial and residential projects in and around Surat."
        path="/about/"
      />
      <PageHero image={pageHeroImg}
        eyebrow="About"
        title="Rooftop solar power EPC for Surat"
        intro="We would like to introduce ourselves as a rooftop solar power EPC - consulting and dealing in solar installations for industrial, commercial and residential projects in and around the Surat area."
      />

      <Section>
        <MediaRow image={introImg} alt="Indian solar consultant discussing a rooftop plan with homeowners on their veranda">
          <div className="space-y-4 text-muted">
            <p>
              As a solar installer, we deal in grid-connected and off-grid standalone solar plants.
            </p>
            <p>
              The scope of our service includes electrical, civil and structural design; permits and
              liasoning from GEDA and DISCOM (Torrent / DGVCL / MGVCL); supply of solar panels,
              inverter and mounting structures; electrical and structural installation including
              earthing; and commissioning - with a five-year service warranty.
            </p>
          </div>
        </MediaRow>
      </Section>

      <Section className="border-t border-white/10">
        <SectionTitle eyebrow="Why Solaris 360" title="What you can expect from us" />
        <Reveal stagger as="div" className="mt-10 grid gap-3 md:grid-cols-3">
            {whyUs.map((w) => (
              <Card key={w.title}>
                <h3 className="font-display text-lg">{w.title}</h3>
                <p className="mt-2 text-sm text-muted">{w.body}</p>
              </Card>
            ))}
          </Reveal>
      </Section>

      <ImageBand image={contentImg} alt="Indian technicians installing solar panels on a residential terrace" />
    </>
  )
}
