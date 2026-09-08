import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/site-overview-dusk.webp'
import { PageHero, Section } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { warranty } from '../content/legal/warranty'

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/** Section body: consecutive "- " lines collapse into one list; others are paragraphs. */
function Body({ lines }: { lines: string[] }) {
  const out: React.ReactNode[] = []
  let bullets: string[] = []
  const flush = (key: string) => {
    if (!bullets.length) return
    out.push(
      <ul key={key} className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>,
    )
    bullets = []
  }
  lines.forEach((line, i) => {
    if (line.startsWith('- ')) {
      bullets.push(line.slice(2))
    } else {
      flush(`u${i}`)
      out.push(
        <p key={`p${i}`} className="mt-3 text-sm leading-relaxed text-muted first:mt-0">
          {line}
        </p>,
      )
    }
  })
  flush('u-end')
  return <>{out}</>
}

export default function Warranty() {
  const sections = warranty.sections.filter((s) => s.heading)

  return (
    <>
      <Seo
        title={warranty.title}
        description={`${warranty.title} for Solaris360 (solaris360.com).`}
        path="/warranty/"
      />
      <PageHero
        image={pageHeroImg}
        eyebrow="Legal"
        title={warranty.title}
        intro={warranty.intro?.[0]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:items-start">
          {/* contents */}
          <Reveal className="lg:sticky lg:top-28">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-orange">Contents</p>
            <ol className="mt-4 space-y-2 text-sm text-muted">
              {sections.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-xs text-orange tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <a href={`#${slug(s.heading!)}`} className="transition-colors hover:text-paper">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* body */}
          <div>
            {warranty.intro?.[1] && (
              <Reveal className="border-l-2 border-orange/60 pl-4 text-sm leading-relaxed text-muted">
                {warranty.intro[1]}
              </Reveal>
            )}

            <div className="mt-8 space-y-3">
              {sections.map((s, i) => (
                <Reveal
                  key={i}
                  as="section"
                  id={slug(s.heading!)}
                  className="scroll-mt-28 border border-white/10 bg-navy/50 p-6"
                >
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-700 text-paper">{s.heading}</h2>
                  <div className="mt-3">
                    <Body lines={s.body} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
