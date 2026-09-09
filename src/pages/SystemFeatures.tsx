import { Seo } from '../components/layout/Seo'
import pageHeroImg from '../assets/solaris-square-features.webp'
import contentImg from '../assets/solaris-panorama-features.webp'
import { PageHero, Section, ImageBand } from '../components/ui/primitives'
import { Reveal } from '../components/ui/Reveal'
import { Counter } from '../components/ui/Counter'
import { systemFeatures } from '../content/site'

export default function SystemFeatures() {
  return (
    <>
      <Seo
        title="System Features"
        description="25-year module warranty, 10-year inverter warranty, 5-year plant service warranty, ~4-year payback, web monitoring, government subsidy up to 25%, and 24×7 toll-free inverter support."
        path="/system-features/"
      />
      <PageHero image={pageHeroImg} eyebrow="EPC Services" title="Our system features" intro="What every Solaris360 rooftop system comes with." />
      <Section>
        <Reveal stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {systemFeatures.map((f) => (
            <div key={f.label} className="kw-card">
              <div className="font-mono text-3xl text-orange tnum">
                {f.text ? (
                  f.text
                ) : (
                  <>
                    {f.prefix}
                    <Counter to={f.value as number} pad={f.pad} />
                    {f.unit === '%' ? '%' : ` ${f.unit}`}
                  </>
                )}
              </div>
              <p className="mt-2 font-display text-sm font-600">{f.label}</p>
            </div>
          ))}
        </Reveal>
        <p className="mt-6 max-w-xl text-sm text-muted">
          The government subsidy shown is indicative and subject to the prevailing GEDA / MNRE scheme
          and your eligibility.
        </p>
      </Section>
      <ImageBand image={contentImg} alt="Organized solar inverters, protection boxes and electrical conduits" />
    </>
  )
}
