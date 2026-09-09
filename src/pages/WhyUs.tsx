import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/inverters-wall.webp'
import contentImg from '../assets/rooftop-array-cityscape.webp'
import { PageHero, Section, SectionTitle, Card, ImageBand } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { whyUs } from '../content/site'

export default function WhyUs() {
  return (
    <>
      <Seo
        title="Why Solaris 360"
        description="100% success ratio, all-in reliability and zero-defect delivery - Solaris360 does all the necessary work from start to end for its customers."
        path="/why-us/"
      />
      <PageHero image={pageHeroImg} eyebrow="About" title="Why Solaris 360" intro="Rooftop solar power, done properly." />
      <Section>
        <SectionTitle title="What sets us apart" />
        <Reveal stagger as="div" className="mt-10 grid gap-3 md:grid-cols-3">
            {whyUs.map((w) => (
              <Card key={w.title}>
                <h3 className="font-display text-lg">{w.title}</h3>
                <p className="mt-2 text-sm text-muted">{w.body}</p>
              </Card>
            ))}
          </Reveal>
      </Section>
      <ImageBand image={contentImg} alt="A finished rooftop array overlooking the city" />
    </>
  )
}
