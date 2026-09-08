import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { footerNav } from '../../content/nav'
import { company, wa, waMsg } from '../../content/company'
import ctaImg from '../../assets/array-crew-dusk.webp'

const policies = [
  { label: 'Terms', to: '/terms/' },
  { label: 'Privacy', to: '/privacy/' },
  { label: 'Returns', to: '/returns/' },
  { label: 'Shipping', to: '/shipping/' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-ink">
      {/* CTA strip ---------------------------------------------------- */}
      <div className="relative overflow-hidden border-b border-white/10">
        <img
          src={ctaImg}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/90 to-ink/50" aria-hidden="true" />
        <div className="container-x relative flex flex-col items-center gap-6 py-12 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-orange">Go Green, Go Solar</p>
            <h2 className="mx-auto mt-2 max-w-md text-2xl md:mx-0 md:text-3xl">
              Send your bill. Get a real number back.
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:justify-end">
            <a href={wa(waMsg.bill)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Message on WhatsApp
            </a>
            <a href={`tel:${company.phone.mainDigits}`} className="btn btn-ghost">
              Call {company.phone.main}
            </a>
          </div>
        </div>
      </div>

      {/* Directory ------------------------------------------------------ */}
      <div className="container-x grid gap-10 py-14 lg:grid-cols-[minmax(0,24rem)_1fr]">
        {/* Contact panel */}
        <div className="border border-white/12 bg-navy/60">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <Link to="/" aria-label="Solaris360 home" className="inline-flex">
              <Logo className="h-6" />
            </Link>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted">Surat · GJ</span>
          </div>
          <dl className="divide-y divide-white/[0.08] text-sm">
            <Row label="Address">
              <a
                href={company.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-paper"
              >
                {company.displayAddress}
              </a>
              <a
                href={company.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-orange"
              >
                Get directions ↗
              </a>
            </Row>
            <Row label="Call">
              <a href={`tel:${company.phone.mainDigits}`} className="hover:text-paper">
                {company.phone.main}
              </a>
            </Row>
            <Row label="WhatsApp">
              <a href={wa(waMsg.quote)} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                Chat with us
              </a>
            </Row>
            <Row label="Email">
              <a href={`mailto:${company.email.general}`} className="hover:text-paper">
                {company.email.general}
              </a>
            </Row>
            <Row label="Shadow / structure">
              <a href={`tel:${company.phone.shadowStructureDigits}`} className="hover:text-paper">
                {company.phone.shadowStructure}
              </a>
              <span className="block text-xs text-muted">{company.email.shadowStructure}</span>
            </Row>
            <Row label="Hours">{company.hours.display}</Row>
          </dl>
        </div>

        {/* Link index */}
        <div>
          <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(footerNav).map(([heading, links]) => (
              <nav key={heading} aria-label={heading}>
                <p className="border-b border-white/10 pb-2 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-orange">
                  {heading}
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">
                  {links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="transition-colors hover:text-paper">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-10 border-t border-white/10 pt-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted">Follow</p>
            <a
              href={company.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm text-muted hover:text-paper"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23 12s0-3.4-.4-5a3 3 0 0 0-2.1-2.1C18.8 4.5 12 4.5 12 4.5s-6.8 0-8.5.4A3 3 0 0 0 1.4 7C1 8.6 1 12 1 12s0 3.4.4 5a3 3 0 0 0 2.1 2.1c1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4a3 3 0 0 0 2.1-2.1c.4-1.6.4-5 .4-5ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z" />
              </svg>
              YouTube channel
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar --------------------------------------------------- */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <svg width="34" height="14" viewBox="0 0 44 16" fill="none" aria-hidden="true" className="text-orange">
              <path d="M4 13 Q22 2 40 13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <span>
              © {year} {company.legalName}
            </span>
          </div>
          <nav aria-label="Policies" className="flex flex-wrap gap-x-4 gap-y-1">
            {policies.map((p) => (
              <Link key={p.to} to={p.to} className="hover:text-paper">
                {p.label}
              </Link>
            ))}
          </nav>
          <p>
            Developed by{' '}
            <a
              href={company.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-600 text-paper hover:text-orange"
            >
              {company.developer.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 px-5 py-3 sm:grid-cols-[6.5rem_1fr] sm:gap-3">
      <dt className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted">{label}</dt>
      <dd className="min-w-0 [overflow-wrap:anywhere] text-paper/90">{children}</dd>
    </div>
  )
}
