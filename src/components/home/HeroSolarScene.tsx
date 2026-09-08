import { useId } from 'react'

/** A single coordinate system keeps the panels, cables and inverter connected. */
export function HeroSolarScene() {
  const id = useId().replace(/:/g, '')
  const panels = [{ x: 75, y: 245 }, { x: 300, y: 230 }, { x: 75, y: 90 }, { x: 300, y: 75 }]
  return (
    <svg className="hero-installation" viewBox="0 60 760 480" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-panel`} x2="1" y2="1">
          <stop stopColor="#a87936" /><stop offset=".3" stopColor="#504124" /><stop offset=".7" stopColor="#172332" /><stop offset="1" stopColor="#0b1422" />
        </linearGradient>
        <linearGradient id={`${id}-metal`} x2="1" y2="1">
          <stop stopColor="#f2ede5" /><stop offset="1" stopColor="#777988" />
        </linearGradient>
        <radialGradient id={`${id}-halo`}>
          <stop stopColor="#f3a02e" stopOpacity=".2" /><stop offset="1" stopColor="#f3a02e" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-cells`} width="46" height="34" patternUnits="userSpaceOnUse">
          <rect width="44" height="32" rx="1" stroke="#e8bc7760" strokeWidth=".7" />
          <path d="M11 0V32M22 0V32M33 0V32M0 8H44M0 16H44M0 24H44" stroke="#f2c98b18" strokeWidth=".5" />
        </pattern>
        <linearGradient id={`${id}-shine`}><stop stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#ffe6b5" stopOpacity=".5" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <clipPath id={`${id}-clip`}><rect width="190" height="130" rx="2" /></clipPath>
      </defs>
      <ellipse cx="320" cy="300" rx="310" ry="265" fill={`url(#${id}-halo)`} className="installation-halo" />
      <g transform="translate(0 200) matrix(1 -.28 .48 .7 0 0)" stroke="#f3a02e0e">
        {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${i * 50} 0V450M0 ${i * 38}H650`} />)}
      </g>
      <g className="installation-float">
        <g transform="translate(0 185) matrix(1 -.28 .48 .7 0 0)">

          {panels.map(({ x, y }, index) => (
            <g transform={`translate(${x} ${y})`} key={index}>
              <g className="installation-panel" style={{ animationDelay: `${.8 + index * .16}s` }}>
                <path d="M0 0H190V130L183 138H-7V8Z" fill="#111422" stroke="#8f795a" />
                <rect width="190" height="130" rx="2" fill={`url(#${id}-panel)`} stroke="#e4c290" strokeWidth="2" />
                <rect x="3" y="3" width="184" height="124" fill={`url(#${id}-cells)`} />
                {[0, 1, 2].map(cell => <rect key={cell} x={6 + ((index + cell * 2) % 4) * 46} y={6 + cell * 34} width="40" height="28" fill="#ffbf61" className="installation-cell" style={{ animationDelay: `${index * .7 + cell * 1.3}s` }} />)}
                <g clipPath={`url(#${id}-clip)`}>
                  <rect className="installation-gleam" x="-100" y="0" width="90" height="150" fill={`url(#${id}-shine)`} style={{ animationDelay: `${index * .5}s` }} />
                </g>
              </g>
            </g>
          ))}
        </g>
        <g className="installation-wiring">
          {['M294 387Q430 510 643 356', 'M512 314Q570 416 643 356', 'M225 272Q420 470 643 356', 'M442 198Q565 390 643 356'].map((path, index) => (
            <g key={path}>
              <path d={path} stroke="#090c18" strokeWidth="2" />
              <path d={path} stroke="#b9864345" strokeWidth="1" strokeDasharray="4 9" />
              <path d={path} stroke="#ffd18a" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 85" className="installation-current" style={{ animationDelay: `${index * -.8}s` }} />
            </g>
          ))}
        </g>
        <g transform="translate(635 333) matrix(.55 -.18 .35 .6 0 0)">
          <g className="installation-device">
            <path d="M0 8L8 0H168L176 8V92L168 100H8L0 92Z" fill="#080d1c" stroke="#a6814b" />
            <rect x="4" y="3" width="168" height="90" rx="9" fill="#1c2134" stroke="#e4c290" strokeOpacity=".6" />
            <rect x="11" y="10" width="154" height="75" rx="5" fill="#090f1e" stroke="#ffffff12" />
            <text x="21" y="26" fontSize="8" fill="#d6c5ab" fontFamily="var(--font-mono)" letterSpacing="1.2">SOLARIS360</text>
            <circle cx="151" cy="23" r="2.5" fill="#f3a02e" className="installation-led" />
            <path d="M21 34H155" stroke="#ffffff12" />
            <path d="M21 48H155M21 61H155M40 40V69M70 40V69M100 40V69M130 40V69" stroke="#ffffff08" />
            <path d="M22 56H38C45 56 45 40 53 40S61 70 69 70S77 40 85 40S93 70 101 70S109 40 117 40S125 56 133 56H153" stroke="#f3a02e30" strokeWidth="2" />
            <path className="installation-display-wave" d="M22 56H38C45 56 45 40 53 40S61 70 69 70S77 40 85 40S93 70 101 70S109 40 117 40S125 56 133 56H153" stroke="#ffd191" strokeWidth="2" strokeLinecap="round" strokeDasharray="45 210" />
            <path d="M65 96H111" stroke="#f3a02e" strokeOpacity=".5" strokeWidth="2" />
            <circle cx="6" cy="47" r="1" fill="#ded1be" /><circle cx="170" cy="47" r="1" fill="#ded1be" />
          </g>
        </g>
      </g>
      <g className="installation-hud" stroke="#f3a02e75" strokeWidth="1">
        <path d="M40 205H705" strokeOpacity=".35" />
        <circle cx="323" cy="302" r="18" /><path d="M295 302h14M337 302h14M323 274v14M323 316v14" />
      </g>

    </svg>
  )
}
