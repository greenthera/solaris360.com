import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/solaris-india-residential.webp'
import contentImg from '../assets/solaris-india-consultation.webp'
import { PageHero, Section, SectionTitle, ImageBand } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { whySolar } from '../content/site'

export default function WhySolar() {
  return (
    <>
      <Seo
        title="Why Solar"
        description="Going solar saves up to 60% versus grid electricity and diesel, has no fuel or variable cost, and the plant lasts more than 20 years."
        path="/why-solar/"
      />
      <PageHero image={pageHeroImg} eyebrow="About" title="Why go solar" intro="Limitless solar energy - and a smart move for your budget." />
      <Section>
        <SectionTitle title="Three reasons it adds up" />
        <Reveal stagger as="div" className="mt-10 grid gap-3 md:grid-cols-3">
            {whySolar.map((w) => (
              <div key={w.label} className="kw-card">
                <div className="font-mono text-3xl text-orange tnum">{w.value}</div>
                <p className="mt-2 font-display text-sm font-600">{w.label}</p>
                <p className="mt-2 text-sm text-muted">{w.body}</p>
              </div>
            ))}
          </Reveal>
      </Section>
      <ImageBand image={contentImg} alt="Indian solar consultant discussing a rooftop plan with homeowners on their veranda" />
    </>
  )
}
