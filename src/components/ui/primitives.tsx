import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'
import { VectorGround } from './VectorGround'

/** Dark page header used on every interior page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  image,
}: {
  eyebrow?: string
  title: string
  intro?: ReactNode
  crumbs?: { label: string; to?: string }[]
  /** shown as a framed photo alongside the heading (right on desktop) */
  image?: string
}) {
  return (
    <header className="relative overflow-hidden border-b border-white/10 vg-mesh">
      <VectorGround variant="wire" />
      <div
        className={`container-x relative grid items-center gap-10 py-14 md:py-20 ${
          image ? 'lg:grid-cols-[1.25fr_1fr]' : ''
        }`}
      >
        <div>
          {crumbs && (
            <nav
              aria-label="Breadcrumb"
              className="mb-4 flex flex-wrap gap-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted"
            >
              {crumbs.map((c, i) => (
                <span key={i} className="flex gap-1">
                  {c.to ? (
                    <Link to={c.to} className="hover:text-orange">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-paper/70">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && (
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-orange">{eyebrow}</p>
          )}
          <h1 className="max-w-3xl text-3xl leading-[1.08] md:text-5xl">{title}</h1>
          {intro && <div className="mt-5 max-w-2xl text-lg text-muted">{intro}</div>}
        </div>

        {image && (
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden border border-white/12 lg:ml-auto lg:mr-0">
            <img
              src={image}
              alt=""
              aria-hidden="true"
              width={1536}
              height={1536}
              decoding="async"
              className="block h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-ink/60 to-transparent" aria-hidden="true" />
            <span className="absolute bottom-3 left-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper/80">
              Solaris360 · Surat
            </span>
          </div>
        )}
      </div>
    </header>
  )
}

/**
 * Image + copy side by side. `flip` puts the image on the right.
 * Use inside a <Section> for consistent rhythm.
 */
export function MediaRow({
  image,
  alt,
  flip = false,
  children,
}: {
  image: string
  alt: string
  flip?: boolean
  children: ReactNode
}) {
  return (
    <Reveal className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <div className={`relative mx-auto aspect-square w-full max-w-sm overflow-hidden border border-white/12 ${flip ? 'md:order-2' : ''}`}>
        <img src={image} alt={alt} loading="lazy" decoding="async" className="block h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-ink/40 to-transparent" aria-hidden="true" />
      </div>
      <div className={flip ? 'md:order-1' : ''}>{children}</div>
    </Reveal>
  )
}

/** Full-width image strip with an optional caption. */
export function ImageBand({ image, alt, caption }: { image: string; alt: string; caption?: string }) {
  return (
    <figure className="relative">
      <div className="aspect-[3/1] overflow-hidden border-y border-white/10">
        <img src={image} alt={alt} loading="lazy" decoding="async" width={2400} height={800} className="block h-full w-full object-cover" />
      </div>
      {caption && (
        <figcaption className="container-x py-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-paper/80">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** A vertical rhythm section on the dark ground. */
export function Section({
  children,
  className,
  id,
  paper = false,
}: {
  children: ReactNode
  className?: string
  id?: string
  paper?: boolean
}) {
  return (
    <section
      id={id}
      className={[paper ? 'surface-paper' : '', 'relative cv-auto', className].filter(Boolean).join(' ')}
    >
      <div className="container-x py-14 md:py-20">{children}</div>
    </section>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
}) {
  return (
    <Reveal className="max-w-2xl">
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-orange">{eyebrow}</p>
      )}
      <h2 className="text-2xl md:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-muted">{intro}</p>}
    </Reveal>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={['kw-card', className].filter(Boolean).join(' ')} data-reveal-child>
      {children}
    </div>
  )
}

/**
 * Rich grid card. `index` shows a big watermark number and a small mono marker;
 * `metric` renders a large orange figure above the title.
 */
export function FeatureCard({
  index,
  metric,
  title,
  children,
  className,
}: {
  index?: number
  metric?: ReactNode
  title: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={['kw-card', className].filter(Boolean).join(' ')} data-reveal-child>
      {index != null && <span className="kw-card-index" aria-hidden="true">{String(index).padStart(2, '0')}</span>}
      {index != null && (
        <span className="mb-3 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-orange">
          {String(index).padStart(2, '0')}
        </span>
      )}
      {metric != null && <div className="kw-card-metric mb-2">{metric}</div>}
      <h3 className="font-display text-base font-600 text-paper">{title}</h3>
      {children && <div className="mt-2 text-sm leading-relaxed text-muted">{children}</div>}
    </div>
  )
}

/** Long-form typographic wrapper for legal pages + blog. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={[
        'max-w-[68ch] space-y-4 text-[0.95rem] leading-relaxed text-muted',
        '[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-700 [&_h2]:text-paper',
        '[&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-600 [&_h3]:text-paper',
        '[&_a]:text-orange [&_a]:underline [&_a]:underline-offset-2',
        '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1',
        '[&_strong]:text-paper',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
