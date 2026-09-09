import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/solaris-india-service.webp'
import contentImg from '../assets/solaris-panorama-faq.webp'
import { PageHero, Section, ImageBand } from '../components/ui/primitives'
import { Accordion } from '../components/ui/Accordion'
import { faq } from '../content/site'

export default function Faq() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]
  return (
    <>
      <Seo
        title="FAQ"
        description="Frequently asked questions about rooftop solar - plant size, power cuts, back-up inverters, appliances, and the roof area you need."
        path="/faq/"
        jsonLd={jsonLd}
      />
      <PageHero image={pageHeroImg} eyebrow="Knowledge Center" title="Frequently asked questions" intro="Most frequent questions and answers." />
      <Section>
        <Accordion items={faq.map((f) => ({ q: f.q, a: f.a }))} />
      </Section>
      <ImageBand image={contentImg} alt="Homeowner and solar advisor reviewing a tablet beside a solar-equipped home" />
    </>
  )
}
