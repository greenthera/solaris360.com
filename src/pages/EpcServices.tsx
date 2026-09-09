import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/solaris-square-epc.webp'
import contentImg from '../assets/solaris-panorama-epc.webp'
import { PageHero, Section, SectionTitle, ImageBand } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { epcScope, epcBlocks } from '../content/services'

export default function EpcServices() {
  return (
    <>
      <Seo
        title="EPC Services"
        description="Solaris360's engineering, procurement and construction scope: design, GEDA/DISCOM liasoning, supply of panels, inverter and structures, installation, earthing and commissioning."
        path="/epc-services/"
      />
      <PageHero image={pageHeroImg}
        eyebrow="EPC Services"
        title="Engineering, procurement and construction - end to end"
        intro="Scope of our solar services for a solar installation:"
      />

      <Section>
        <Reveal stagger className="grid gap-3 sm:grid-cols-2">
          {epcScope.map((s) => (
            <div key={s} className="flex gap-3 border border-white/10 bg-navy p-4 text-sm">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 bg-orange" aria-hidden="true" />
              {s}
            </div>
          ))}
        </Reveal>
      </Section>

      <Section className="border-t border-white/10">
        <SectionTitle eyebrow="Components" title="What goes on your roof" />
        <Reveal stagger as="div" className="mt-10 grid gap-3 md:grid-cols-2">
            {epcBlocks.map((b) => (
              <div key={b.title} className="kw-card">
                <h3 className="font-display text-lg">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.body}</p>
              </div>
            ))}
          </Reveal>
      </Section>

      <ImageBand image={contentImg} alt="Aerial view of a large rooftop solar installation on an Indian textile factory" />
    </>
  )
}
