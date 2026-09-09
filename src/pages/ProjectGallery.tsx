import { useState } from 'react'
import { Seo } from '../components/layout/Seo'
import { PageHero, Section } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { Lightbox } from '../components/ui/Lightbox'
import shotIndustrial from '../assets/rooftop-industrial-aerial.webp'
import shotCityscape from '../assets/rooftop-array-cityscape.webp'
import shotResidence from '../assets/array-elevated-residence.webp'
import shotCarport from '../assets/solar-carport.webp'
import shotParapet from '../assets/rooftop-parapet-city.webp'
import shotInverters from '../assets/inverters-wall.webp'
import shotResidentialDusk from '../assets/rooftop-residential-dusk.webp'
import shotStructure from '../assets/mounting-structure-build.webp'

type Cat = 'All' | 'Residential' | 'Commercial' | 'Industrial'

const shots: { src: string; cat: Exclude<Cat, 'All'>; title: string; alt: string }[] = [
  { src: shotIndustrial, cat: 'Industrial', title: 'Industrial rooftop array', alt: 'Aerial view along a large industrial rooftop solar array with a maintenance walkway' },
  { src: shotCityscape, cat: 'Commercial', title: 'City-centre rooftop', alt: 'A rooftop solar array overlooking the city skyline' },
  { src: shotResidence, cat: 'Residential', title: 'Elevated home array', alt: 'An elevated tilted solar array above a residential terrace' },
  { src: shotCarport, cat: 'Commercial', title: 'Solar carport', alt: 'An elevated solar carport structure over a paved yard' },
  { src: shotParapet, cat: 'Commercial', title: 'Parapet-mounted array', alt: 'Solar panels mounted along a building parapet' },
  { src: shotInverters, cat: 'Industrial', title: 'Inverter wall', alt: 'Wall-mounted string inverters and DC junction boxes' },
  { src: shotResidentialDusk, cat: 'Residential', title: 'Home rooftop at dusk', alt: 'A residential rooftop solar array at dusk' },
  { src: shotStructure, cat: 'Residential', title: 'Structure install', alt: 'A mounting structure being erected on a rooftop during installation' },
]

export default function ProjectGallery() {
  const [cat, setCat] = useState<Cat>('All')
  const [active, setActive] = useState<number | null>(null)
  const filtered = cat === 'All' ? shots : shots.filter((s) => s.cat === cat)

  return (
    <>
      <Seo
        title="Project Gallery"
        description="Rooftop and ground-mount solar projects by Solaris360 across residential, commercial and industrial sites in and around Surat."
        path="/project-gallery/"
      />
      <PageHero eyebrow="EPC Services" title="Photo gallery" intro="A look at systems we've designed and built." />
      <Section>
        <div className="mb-8 flex flex-wrap gap-2">
          {(['All', 'Residential', 'Commercial', 'Industrial'] as Cat[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCat(c)
                setActive(null)
              }}
              aria-pressed={cat === c}
              className={`border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] ${
                cat === c ? 'border-orange bg-orange text-ink' : 'border-white/15 text-muted'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <Reveal stagger className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {filtered.map((s, i) => (
            <figure key={s.src} className="group relative aspect-[4/3] overflow-hidden border border-white/10 bg-navy">
              <button
                type="button"
                onClick={() => setActive(i)}
                className="absolute inset-0 h-full w-full cursor-zoom-in"
                aria-label={`View ${s.title}`}
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  width={800}
                  height={600}
                />
              </button>
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-ink/85 to-transparent p-3">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper/90">{s.title}</span>
                <span className="font-mono text-[0.6rem] tabular-nums text-orange">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </figcaption>
            </figure>
          ))}
        </Reveal>

        <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted/70">
          Photos from recent Solaris360 installations.
        </p>
      </Section>

      <Lightbox
        items={filtered.map((s) => ({ src: s.src, alt: s.alt, title: s.title, meta: `${s.cat} project` }))}
        index={active}
        onClose={() => setActive(null)}
        onIndex={setActive}
      />
    </>
  )
}
