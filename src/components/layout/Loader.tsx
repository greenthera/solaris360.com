/** The Solaris360 mark, drawn in as a loading animation. */
export function LoaderMark() {
  return (
    <svg className="loader-mark" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      {/* ambient glow */}
      <circle className="loader-halo" cx="80" cy="88" r="46" fill="#f3a02e" opacity="0.12" />
      {/* orbit ring + travelling segment */}
      <circle cx="80" cy="82" r="62" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1.5" />
      <circle
        className="loader-orbit"
        cx="80"
        cy="82"
        r="62"
        stroke="#f3a02e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="34 355"
      />
      {/* sun arc + baseline */}
      <path
        className="loader-arc"
        d="M42 96 A38 38 0 0 1 118 96"
        stroke="#f3a02e"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        className="loader-base"
        d="M42 108 H118"
        stroke="#f3a02e"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* rays */}
      <path className="loader-ray" d="M80 20 V40" stroke="#fdfdfc" strokeWidth="6" strokeLinecap="round" />
      <path className="loader-ray" d="M44 33 L57 46" stroke="#fdfdfc" strokeWidth="6" strokeLinecap="round" />
      <path className="loader-ray" d="M116 33 L103 46" stroke="#fdfdfc" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

/** Full-screen loading overlay. `done` fades it away. */
export function Loader({ done = false }: { done?: boolean }) {
  return (
    <div className="loader" data-done={done} role="status" aria-live="polite" aria-hidden={done}>
      <div className="flex flex-col items-center">
        <LoaderMark />
        <p className="loader-word">Solaris360</p>
        <span className="sr-only">Loading</span>
      </div>
    </div>
  )
}
