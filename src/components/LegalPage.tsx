import { Seo } from './layout/Seo'
import { PageHero, Section, Prose } from './ui/primitives'
import legalHeroImg from '../assets/site-overview-dusk.webp'
import type { LegalDoc } from '../content/legal/types'

export function LegalPage({ doc, path }: { doc: LegalDoc; path: string }) {
  return (
    <>
      <Seo
        title={doc.title}
        description={`${doc.title} for Solaris360 (solaris360.com).`}
        path={path}
        noindex={false}
      />
      <PageHero
        image={legalHeroImg}
        eyebrow="Legal"
        title={doc.title}
        intro={doc.updated ? <span className="font-mono text-sm">{doc.updated}</span> : undefined}
      />
      <Section>
        <Prose>
          {doc.intro?.map((p, i) => <p key={`i${i}`}>{p}</p>)}
          {doc.sections.map((s, si) => (
            <section key={si}>
              {s.heading && <h2>{s.heading}</h2>}
              {renderBody(s.body)}
            </section>
          ))}
        </Prose>
      </Section>
    </>
  )
}

function renderBody(lines: string[]) {
  const out: React.ReactNode[] = []
  let bullets: string[] = []
  const flush = (key: string) => {
    if (bullets.length) {
      out.push(
        <ul key={key}>
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>,
      )
      bullets = []
    }
  }
  lines.forEach((line, i) => {
    if (line.startsWith('- ')) {
      bullets.push(line.slice(2))
    } else {
      flush(`ul${i}`)
      out.push(<p key={`p${i}`}>{line}</p>)
    }
  })
  flush('ul-end')
  return out
}
