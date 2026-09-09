import { useEffect, useRef, useState } from 'react'
import type { Testimonial } from '../../content/testimonials'
import { company } from '../../content/company'

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`Rated ${n} out of 5`}>
      {Array.from({ length: 5 }).map((_, k) => (
        <svg
          key={k}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={k < n ? '#f3a02e' : 'none'}
          stroke="#f3a02e"
          strokeWidth="1.5"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
        </svg>
      ))}
    </span>
  )
}

/** Auto-rotating testimonial slider, styled to match the kw-card system. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0)
  const paused = useRef(false)
  const n = items.length

  useEffect(() => {
    if (n < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      if (!paused.current) setI((v) => (v + 1) % n)
    }, 6500)
    return () => window.clearInterval(id)
  }, [n])

  if (n === 0) return null
  const go = (next: number) => setI(((next % n) + n) % n)
  const t = items[i]

  return (
    <div
      className="kw-card mx-auto max-w-3xl px-6 py-8 hover:translate-y-0 focus-within:translate-y-0 sm:px-10 sm:py-10"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
    >
      <span className="kw-card-index" aria-hidden="true">
        {String(i + 1).padStart(2, '0')}
      </span>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted">
        <span className="text-orange">Google reviews</span>
        <span aria-hidden="true">·</span>
        <span>
          {company.reviews.average} / 5 · {company.reviews.count} reviews
        </span>
      </div>

      <div aria-live="polite" className="relative mt-6 min-h-56 sm:min-h-48">
        <div key={i} className="testi-quote">
          <svg
            className="mb-3 h-7 w-7 text-orange/30"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.5 5C6 6.6 4 9.8 4 13.9V19h6.2v-6.2H7.4c.1-2.4 1.2-4 3.3-5L9.5 5Zm10 0c-3.5 1.6-5.5 4.8-5.5 8.9V19h6.2v-6.2h-2.8c.1-2.4 1.2-4 3.3-5L19.5 5Z" />
          </svg>
          <blockquote>
            <p className="whitespace-pre-line font-display text-lg leading-relaxed text-paper/90 sm:text-[1.35rem] sm:leading-relaxed">
              {t.text}
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center border border-orange/40 font-mono text-sm text-orange"
                aria-hidden="true"
              >
                {t.author.trim().charAt(0).toUpperCase()}
              </span>
              <span>
                <span className="block font-display text-sm text-paper">{t.author}</span>
                <span className="block font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted">
                  <Stars n={t.rating} />
                  {t.date ? ` · ${t.date}` : ''}
                </span>
              </span>
            </footer>
          </blockquote>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
        <div className="flex gap-1.5">
          {items.map((_, d) => (
            <button
              key={d}
              type="button"
              onClick={() => go(d)}
              aria-label={`Review ${d + 1}`}
              aria-current={d === i}
              className={`h-1 w-5 transition-colors ${
                d === i ? 'bg-orange' : 'bg-white/15 hover:bg-white/35'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(i - 1)}
            aria-label="Previous review"
            className="grid h-8 w-8 place-items-center border border-white/20 text-paper transition-colors hover:border-orange hover:text-orange"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(i + 1)}
            aria-label="Next review"
            className="grid h-8 w-8 place-items-center border border-white/20 text-paper transition-colors hover:border-orange hover:text-orange"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5 16 12l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
