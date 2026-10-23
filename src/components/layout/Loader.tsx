import logoMark from '../../assets/logo-mark.webp'
import logoMarkAvif from '../../assets/logo-mark.avif'

/** Full-screen loading overlay. `done` fades it away. */
export function Loader({ done = false }: { done?: boolean }) {
  return (
    <div className="loader" data-done={done} role="status" aria-live="polite" aria-hidden={done}>
      <div className="loader-inner">
        <span className="loader-glow" aria-hidden="true" />
        <picture className="contents">
          <source type="image/avif" srcSet={logoMarkAvif} />
          <img
            className="loader-logo"
            src={logoMark}
            alt="Solaris360"
            width={380}
            height={78}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <span className="loader-track" aria-hidden="true">
          <span className="loader-bar" />
        </span>
        <span className="sr-only">Loading Solaris360</span>
      </div>
    </div>
  )
}
