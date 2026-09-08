import { Link } from 'react-router-dom'
import { VectorGround } from '../ui/VectorGround'
import { LiveMeter } from './LiveMeter'
import { HeroSolarScene } from './HeroSolarScene'
import { wa, waMsg, company } from '../../content/company'
import { heroBgUrl as heroImg } from '../../lib/heroBg'

/** Hero load-in is pure CSS (`hero-rise`, gated by `html.anim`). */
export function Hero() {
  return (
    <section className="solar-hero relative overflow-hidden border-b border-white/10">
      <img
        src={heroImg}
        alt=""
        aria-hidden="true"
        className="hero-photo absolute inset-0 h-full w-full object-cover opacity-45"
        fetchPriority="high"
        decoding="async"
        width={1600}
        height={873}
      />
      <div
        className="absolute inset-0 bg-linear-to-r from-ink via-ink/85 to-ink/40"
        aria-hidden="true"
      />
      <div className="absolute inset-0 vg-mesh opacity-70" aria-hidden="true" />
      <VectorGround variant="wire" />


      <div className="container-x hero-layout relative py-20 md:py-28">
        <div className="hero-copy">
        <p className="hero-rise mb-4 font-mono text-xs uppercase tracking-[0.25em] text-orange">
          {company.descriptor}
        </p>
        <h1 className="hero-rise max-w-4xl text-4xl leading-[1.05] md:text-6xl" style={{ animationDelay: '80ms' }}>
          Let your roof<br />catch <span className="hero-sun-text">the sun.</span>
        </h1>
        <p
          className="hero-rise mt-5 max-w-xl text-lg text-muted"
          style={{ animationDelay: '220ms' }}
        >
          Gone solar? Look around - your neighbours have. Solaris360 designs, builds and monitors
          rooftop systems so every unit shows up on the meter.
        </p>

        <div className="hero-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '340ms' }}>
          <a href={wa(waMsg.quote)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Go Solar now
          </a>
          <Link to="/emi-calculator/" className="btn btn-ghost">
            Estimate my EMI
          </Link>
        </div>

        <div className="hero-rise mt-14 max-w-2xl" style={{ animationDelay: '440ms' }}>
          <LiveMeter />
        </div>

        <p className="hero-rise mt-6 text-sm text-muted" style={{ animationDelay: '600ms' }}>
          Call{' '}
          <a href={`tel:${company.phone.mainDigits}`} className="font-600 text-paper">
            {company.phone.main}
          </a>{' '}
          to Go Solar now!
        </p>
        </div>
        <div className="hero-stage">
          <div className="hero-stage-heading"><span>SOLARIS360 / ENERGY SYSTEM</span><span className="stage-status">ROOFTOP SOLAR</span></div>
          <HeroSolarScene />
          <div className="hero-stage-caption"><span>01 / CAPTURE</span><span>02 / CONVERT</span><span>03 / POWER</span></div>
          <div className="hero-stage-footer"><span>Designed for your roof.</span><span>Built for the long run. ↗</span></div>
        </div>
      </div>
    </section>
  )
}
