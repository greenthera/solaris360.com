import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/rooftop-parapet-city.webp'
import contentImg from '../assets/solar-carport.webp'
import { PageHero, Section, SectionTitle, ImageBand } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { systemTypes } from '../content/services'

export default function SolarPvSystem() {
  return (
    <>
      <Seo
        title="Solar PV System"
        description="Off-grid / standalone, grid-connected and hybrid solar power systems - how each works and where it fits."
        path="/solar-pv-system/"
      />
      <PageHero image={pageHeroImg}
        eyebrow="EPC Services"
        title="Solar power generating systems"
        intro="Three system types are available. We size the right one to how you actually use power."
      />
      <Section>
        <Reveal stagger as="div" className="grid gap-3">
            {systemTypes.map((s) => (
              <div key={s.title} className="kw-card">
                <h2 className="font-display text-xl">{s.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </Reveal>
      </Section>
      <Section className="border-t border-white/10">
        <SectionTitle
          title="Not sure which you need?"
          intro="Send your latest electricity bill and roof details - we'll recommend a system and size."
        />
      </Section>
      <ImageBand image={contentImg} alt="A grid-connected solar carport array" />
    </>
  )
}
