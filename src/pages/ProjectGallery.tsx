import { useState } from 'react'
import { Seo } from '../components/layout/Seo'
import { PageHero, Section } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { Lightbox } from '../components/ui/Lightbox'
import shotIndustrial from '../assets/solaris-india-industrial.webp'
import shotResidence from '../assets/solaris-india-residential.webp'
import shotService from '../assets/solaris-india-service.webp'
import shotConsultation from '../assets/solaris-india-consultation.webp'
import shotStructure from '../assets/solaris-india-structure.webp'

type Cat = 'All' | 'Residential' | 'Commercial' | 'Industrial'

const shots: { src: string; cat: Exclude<Cat, 'All'>; title: string; alt: string }[] = [
  { src: shotResidence, cat: 'Residential', title: 'Residential solar installation', alt: 'Indian installers in orange and navy workwear securing solar panels on a residential terrace' },
  { src: shotIndustrial, cat: 'Industrial', title: 'Industrial rooftop inspection', alt: 'Two Indian engineers reviewing a tablet between rows of industrial rooftop solar panels' },
  { src: shotService, cat: 'Commercial', title: 'Inverter service and monitoring', alt: 'Indian solar technicians inspecting wall-mounted inverters on a commercial rooftop' },
  { src: shotConsultation, cat: 'Residential', title: 'Home solar consultation', alt: 'Indian solar consultant discussing a rooftop plan with homeowners on their veranda' },
  { src: shotStructure, cat: 'Commercial', title: 'Elevated solar carport', alt: 'Indian engineer inspecting the steel support of an elevated solar carport' },
]

export default function ProjectGallery() {
  const [cat, setCat] = useState<Cat>('All')
  const [active, setActive] = useState<number | null>(null)
  const filtered = cat === 'All' ? shots : shots.filter((s) => s.cat === cat)

  return (
    <>
      <Seo
        title="Project Gallery"
        description="Illustrative images of residential, commercial and industrial solar installation and maintenance in India."
        path="/project-gallery/"
      />
      <PageHero eyebrow="EPC Services" title="Photo gallery" intro="Explore residential, industrial and commercial solar in an Indian setting." />
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
          AI-generated illustrations of solar installation and service in India.
        </p>
      </Section>

      <Lightbox
        items={filtered.map((s) => ({ src: s.src, alt: s.alt, title: s.title, meta: `${s.cat} · Illustrative image` }))}
        index={active}
        onClose={() => setActive(null)}
        onIndex={setActive}
      />
    </>
  )
}
