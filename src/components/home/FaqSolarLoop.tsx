import { useEffect, useId, useRef } from 'react'

/** An exploded solar module; its GSAP sequence runs only while visible. */
export function FaqSolarLoop({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  const id = useId().replace(/:/g, '')
  useEffect(() => {
    let disposed = false
    let cleanup: (() => void) | undefined
    import('gsap').then(({ gsap }) => {
      if (disposed || !root.current) return
      const el = root.current
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(el)
        const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.2, paused: true })
        timeline.fromTo(q('.faq-glass'), { y: -45 }, { y: 0, duration: 1.6, ease: 'power3.inOut' })
          .fromTo(q('.faq-cells'), { y: -20 }, { y: 0, duration: 1.6, ease: 'power3.inOut' }, 0)
          .fromTo(q('.faq-light'), { opacity: 0 }, { opacity: .8, stagger: .05, duration: .35 }, 1.1)
          .fromTo(q('.faq-sweep'), { x: -250 }, { x: 300, duration: 1.8, ease: 'power2.inOut' }, 1.3)
          .fromTo(q('.faq-current'), { strokeDashoffset: 0 }, { strokeDashoffset: -180, duration: 2, ease: 'none' }, 2)
          .to(q('.faq-light'), { opacity: .12, stagger: .03, duration: .6 }, 3.3)
          .to(q('.faq-glass'), { y: -45, duration: 1.7, ease: 'power3.inOut' }, 4.1)
          .to(q('.faq-cells'), { y: -20, duration: 1.7, ease: 'power3.inOut' }, 4.1)
        let visible = false
        const sync = () => { if (visible && !document.hidden) timeline.play(); else timeline.pause() }
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
        observer.observe(el)
        document.addEventListener('visibilitychange', sync)
        return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); timeline.kill() }
      }, el)
      cleanup = () => mm.revert()
    })
    return () => { disposed = true; cleanup?.() }
  }, [])
  return (
    <div ref={root} className={className}>
      <div className="faq-module-scene">
        <div className="faq-module-heading"><span>SOLARIS360</span><span>INSIDE SOLAR</span></div>
        <svg viewBox="0 0 440 450" role="img" aria-label="An animated exploded solar module: glass, photovoltaic cells and supporting base assemble as light passes across the cells.">
          <defs>
            <linearGradient id={`${id}-base`} x2="1" y2="1"><stop stopColor="#484361" /><stop offset="1" stopColor="#14162b" /></linearGradient>
            <linearGradient id={`${id}-glass`} x2="1" y2="1"><stop stopColor="#ffe2ac" stopOpacity=".2" /><stop offset=".6" stopColor="#f3a02e" stopOpacity=".02" /><stop offset="1" stopColor="#fff" stopOpacity=".12" /></linearGradient>
            <linearGradient id={`${id}-beam`}><stop stopColor="#ffd497" stopOpacity="0" /><stop offset=".5" stopColor="#ffd497" stopOpacity=".55" /><stop offset="1" stopColor="#ffd497" stopOpacity="0" /></linearGradient>
            <clipPath id={`${id}-clip`}><rect width="240" height="170" rx="3" /></clipPath>
          </defs>
          <ellipse cx="220" cy="336" rx="165" ry="48" fill="#000" opacity=".2" />
          <g stroke="#f3a02e15" fill="none"><ellipse cx="220" cy="316" rx="190" ry="76" /><ellipse cx="220" cy="316" rx="170" ry="64" strokeDasharray="2 7" /></g>
          <g transform="translate(64 216) matrix(.95 -.38 .5 .65 0 0)">
            <path d="M0 0H240V170L230 183H-10V13Z" fill="#111226" stroke="#80704f" />
            <rect width="240" height="170" rx="3" fill={`url(#${id}-base)`} stroke="#ffffff30" />
          </g>
          <g className="faq-cells">
            <g transform="translate(64 199) matrix(.95 -.38 .5 .65 0 0)">
              <rect width="240" height="170" fill="#11182b" stroke="#f3a02e70" />
              {Array.from({ length: 24 }, (_, i) => <g key={i} transform={`translate(${6 + i % 6 * 38} ${6 + Math.floor(i / 6) * 40})`}>
                <rect width="34" height="36" rx="2" fill="#292b46" stroke="#e4b77955" strokeWidth=".7" />
                <rect className="faq-light" width="34" height="36" rx="2" fill="#f3a02e" opacity=".12" />
                <path d="M8 0V36M17 0V36M26 0V36" stroke="#fff" strokeOpacity=".1" />
              </g>)}
            </g>
          </g>
          <g className="faq-glass">
            <g transform="translate(64 182) matrix(.95 -.38 .5 .65 0 0)">
              <rect width="240" height="170" rx="3" fill={`url(#${id}-glass)`} stroke="#ffe0a5" strokeOpacity=".65" />
              <g clipPath={`url(#${id}-clip)`}><rect className="faq-sweep" x="-80" width="80" height="170" fill={`url(#${id}-beam)`} /></g>
              <path d="M8 25V8H25M215 162H232V145" stroke="#ffe1b0" strokeWidth="2" />
            </g>
          </g>
          <path d="M310 312V358H220V388" fill="none" stroke="#f3a02e30" />
          <path className="faq-current" d="M310 312V358H220V388" fill="none" stroke="#ffd59b" strokeWidth="3" strokeDasharray="5 40" />
          <rect x="178" y="385" width="84" height="30" rx="15" fill="#1e1c35" stroke="#f3a02e70" />
          <text x="220" y="404" textAnchor="middle" fill="#f3a02e" fontSize="10" fontFamily="var(--font-mono)">DC → AC</text>
        </svg>
        <div className="faq-module-footer"><span>01 / LIGHT</span><span>02 / CELLS</span><span>03 / ENERGY</span></div>
      </div>
    </div>
  )
}
