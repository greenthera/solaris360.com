import { useState } from 'react'
import { Seo } from '../components/layout/Seo'
import { PageHero, Section } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { Lightbox } from '../components/ui/Lightbox'
import arr1 from '../assets/array-daytime.webp'
import arr2 from '../assets/array-crew-dusk.webp'
import arr3 from '../assets/hero-substation-dusk.webp'
import arr4 from '../assets/site-overview-dusk.webp'
import arr5 from '../assets/hero-array-sunset.webp'

type Cat = 'All' | 'Residential' | 'Commercial' | 'Industrial'

const shots: { src: string; cat: Exclude<Cat, 'All'>; title: string; alt: string }[] = [
  { src: arr1, cat: 'Commercial', title: 'Rooftop array, daylight', alt: 'Rooftop solar array under a bright sky' },
  { src: arr2, cat: 'Industrial', title: 'Ground-mount with crew', alt: 'Ground-mount array with the install crew at dusk' },
  { src: arr3, cat: 'Commercial', title: 'Array beside substation', alt: 'Array beside a substation at dusk' },
  { src: arr4, cat: 'Industrial', title: 'Site overview, blue hour', alt: 'Wide site view at blue hour' },
  { src: arr5, cat: 'Residential', title: 'Panel rows at sunset', alt: 'Converging rows of panels at sunset' },
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
          Images are illustrative renderings.
        </p>
      </Section>

      <Lightbox
        items={filtered.map((s) => ({ src: s.src, alt: s.alt, title: s.title, meta: `${s.cat} · illustrative rendering` }))}
        index={active}
        onClose={() => setActive(null)}
        onIndex={setActive}
      />
    </>
  )
}
