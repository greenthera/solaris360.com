import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/array-elevated-residence.webp'
import contentImg from '../assets/mounting-structure-build.webp'
import { PageHero, Section, ImageBand } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { executionSteps } from '../content/site'

export default function ExecutionProcess() {
  return (
    <>
      <Seo
        title="Execution Process"
        description="Solar installation in three stages - system proposal, GEDA approval, and execution. The whole process takes about 3 months after GEDA approval."
        path="/execution-process/"
      />
      <PageHero image={pageHeroImg}
        eyebrow="EPC Services"
        title="How a rooftop installation runs"
        intro="Three stages, from first proposal to a commissioned, net-metered system."
      />
      <Section>
        <Reveal stagger as="ol" className="relative space-y-3 border-l border-white/15 pl-6">
            {executionSteps.map((s) => (
              <li key={s.n} className="relative border border-white/10 bg-navy p-6">
                <span className="absolute -left-[calc(1.5rem+13px)] top-6 grid h-6 w-6 place-items-center border border-orange bg-ink font-mono text-xs text-orange">
                  {s.n}
                </span>
                <h2 className="font-display text-lg">{s.title}</h2>
                <p className="mt-2 text-sm text-muted">{s.body}</p>
              </li>
            ))}
          </Reveal>
      </Section>
      <ImageBand image={contentImg} alt="A mounting structure going up on a rooftop during installation" />
    </>
  )
}
