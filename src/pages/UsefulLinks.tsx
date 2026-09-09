import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/solaris-india-residential.webp'
import { PageHero, Section } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { usefulLinks } from '../content/site'

export default function UsefulLinks() {
  return (
    <>
      <Seo
        title="Useful Links"
        description="Government and DISCOM portals for solar in Gujarat - Surya Gujarat, GEDA, Torrent Power and DGVCL."
        path="/useful-links/"
      />
      <PageHero image={pageHeroImg} eyebrow="Knowledge Center" title="Useful links" intro="Government and DISCOM portals for going solar in Gujarat." />
      <Section>
        <Reveal stagger className="grid gap-3 sm:grid-cols-2">
          {usefulLinks.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border border-white/10 bg-navy p-5 transition-colors hover:border-orange"
            >
              <span>
                <span className="block font-display font-600">{l.label}</span>
                <span className="block font-mono text-xs text-muted">{l.url.replace('https://', '')}</span>
              </span>
              <span aria-hidden="true" className="text-orange">
                ↗
              </span>
            </a>
          ))}
        </Reveal>
      </Section>
    </>
  )
}
