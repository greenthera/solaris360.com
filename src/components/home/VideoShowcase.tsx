import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

/**
 * Full-bleed background-video band (Home only). Poster shows immediately; the
 * video loads and plays only when scrolled into view, and stays a still poster
 * under reduced motion or on a save-data connection.
 */
export function VideoShowcase() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData
    if (reduce || saveData) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (!v.src) v.src = v.dataset.src || ''
            v.play().catch(() => {})
          } else {
            v.pause()
          }
        }
      },
      { threshold: 0.15 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <section className="relative flex min-h-[28rem] items-end overflow-hidden border-y border-white/10 md:min-h-[34rem]">
      <video
        ref={ref}
        data-src="/media/website-bg.mp4"
        poster="/media/website-bg-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover brightness-[0.45]"
      />
      <div className="absolute inset-0 bg-ink/40" aria-hidden="true" />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/60 to-ink/25" aria-hidden="true" />
      <div className="absolute inset-0 vg-wire opacity-25" aria-hidden="true" />

      <div className="container-x relative py-14 md:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-orange">On the roof</p>
        <h2 className="mt-3 max-w-xl text-3xl md:text-5xl">Engineered on site, monitored for life.</h2>
        <p className="mt-4 max-w-md text-muted">
          Survey, structural and electrical design, install, earthing and commissioning - then web
          monitoring and 24×7 inverter support.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/project-gallery/" className="btn btn-primary">
            See project gallery
          </Link>
          <Link to="/execution-process/" className="btn btn-ghost">
            How execution works
          </Link>
        </div>
      </div>
    </section>
  )
}
