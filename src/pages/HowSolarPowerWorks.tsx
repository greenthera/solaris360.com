import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/array-daytime.webp'
import contentImg from '../assets/hero-array-sunset.webp'
import { PageHero, Section, SectionTitle, ImageBand } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { SolarSchematic } from '../components/home/SolarSchematic'
import { systemTypes } from '../content/services'
import { powerFlow, flowConditions, componentsIntro, netMetering } from '../content/howSolarWorks'
import { company } from '../content/company'

export default function HowSolarPowerWorks() {
  return (
    <>
      <Seo
        title="How Solar Power Works"
        description="Solar power generating systems, the six system components, the line diagram, current flow in different conditions, and net metering - explained."
        path="/how-solar-power-works/"
      />
      <PageHero
        image={pageHeroImg}
        eyebrow="Knowledge Center"
        title="How solar power works"
        intro="From the panel to the meter to the grid - and back."
      />

      {/* Line diagram - same animated schematic + layout as the homepage */}
      <Section className="border-t border-white/10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionTitle eyebrow="Line diagram" title="The six components" intro={componentsIntro} />
          <Reveal className="kw-card">
            <SolarSchematic />
          </Reveal>
        </div>
        <Reveal stagger as="ol" className="mt-12 max-w-3xl">
          {powerFlow.map((p, i) => (
            <li
              key={i}
              data-reveal-child
              className="grid grid-cols-[2.75rem_1fr] gap-4 sm:grid-cols-[3.5rem_1fr] sm:gap-6"
            >
              <div className="relative flex justify-center">
                <span className="z-10 grid h-11 w-11 flex-shrink-0 place-items-center border border-orange/45 bg-ink font-mono text-sm tabular-nums text-orange">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {i < powerFlow.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-11 h-full w-px -translate-x-1/2 bg-linear-to-b from-orange/40 to-white/10"
                  />
                )}
              </div>
              <p className="pb-8 pt-2.5 text-[0.95rem] leading-relaxed text-paper/85">{p}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      <Section className="border-t border-white/10">
        <SectionTitle eyebrow="System types" title="Three ways to generate" />
        <Reveal stagger as="div" className="mt-8 grid gap-3 md:grid-cols-3">
          {systemTypes.map((s) => (
            <div key={s.title} className="kw-card">
              <h3 className="font-display text-base">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section className="border-t border-white/10">
        <SectionTitle eyebrow="Current flow" title="What happens in different conditions" />
        <Reveal stagger as="div" className="mt-8 grid gap-3 md:grid-cols-3">
          {flowConditions.map((c) => (
            <div key={c.title} className="kw-card">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">{c.when}</p>
              <h3 className="mt-2 font-display text-base">{c.title}</h3>
              <p className="mt-2 text-sm text-muted">{c.body}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section className="border-t border-white/10">
        <SectionTitle eyebrow="Net metering" title="Your roof pays you back" intro={netMetering} />
        <p className="mt-6 text-sm text-muted">
          Our{' '}
          <a
            href={company.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange underline"
          >
            YouTube channel
          </a>{' '}
          walks through the systems and components in detail.
        </p>
      </Section>

      <ImageBand image={contentImg} alt="Panels to inverter to meter to grid" />
    </>
  )
}
