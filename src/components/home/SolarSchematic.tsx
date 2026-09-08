/**
 * The ambient energy schematic: panels → inverter → meter → home/grid, with
 * "current" flowing along the cables. Pure SVG + CSS (dash-flow keyframe),
 * frozen under reduced motion. aria-hidden - it's decoration for the copy
 * on /how-solar-power-works/.
 */
export function SolarSchematic({ className, orbit = false }: { className?: string; orbit?: boolean }) {
  if (orbit) return <SolarOrbit className={className} />
  return (
    <svg
      viewBox="0 0 420 220"
      className={['w-full', className].filter(Boolean).join(' ')}
      role="img"
      aria-label="Solar panels feed a DC-to-AC inverter, then a meter, then the home and the grid"
      fill="none"
    >
      <defs>
        <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#262357" />
          <stop offset="1" stopColor="#17163f" />
        </linearGradient>
      </defs>

      {/* PV array */}
      <g transform="translate(14 40)">
        {[0, 1, 2, 3].map((c) =>
          [0, 1, 2].map((r) => (
            <rect
              key={`${c}-${r}`}
              x={c * 22}
              y={r * 16}
              width="19"
              height="13"
              fill="url(#pv)"
              stroke="#f3a02e"
              strokeOpacity="0.5"
              strokeWidth="0.6"
            />
          )),
        )}
        <text x="0" y="72" fill="#9b98b8" fontSize="8" fontFamily="var(--font-mono)">
          PV ARRAY · DC
        </text>
      </g>

      {/* cable pv -> inverter */}
      <path
        d="M110 66 H165"
        stroke="#f3a02e"
        strokeWidth="2"
        strokeDasharray="4 6"
        strokeLinecap="round"
        style={{ animation: 'dash-flow 0.9s linear infinite' }}
        className="motion-reduce:[animation:none]"
      />

      {/* inverter */}
      <g transform="translate(165 44)">
        <rect width="46" height="44" fill="#1e1c4a" stroke="#ffffff22" />
        <circle cx="23" cy="16" r="5" fill="none" stroke="#f3a02e" strokeWidth="1.5" />
        <path d="M14 30h18M14 35h18" stroke="#9b98b8" strokeWidth="1.5" />
        <circle
          cx="40"
          cy="6"
          r="2.4"
          fill="#35c07a"
          style={{ animation: 'var(--animate-pulse-dot)' }}
          className="motion-reduce:[animation:none]"
        />
        <text x="0" y="58" fill="#9b98b8" fontSize="8" fontFamily="var(--font-mono)">
          INVERTER
        </text>
      </g>

      {/* cable inverter -> meter */}
      <path
        d="M211 66 H262"
        stroke="#35c07a"
        strokeWidth="2"
        strokeDasharray="4 6"
        strokeLinecap="round"
        style={{ animation: 'dash-flow 0.9s linear infinite' }}
        className="motion-reduce:[animation:none]"
      />

      {/* meter */}
      <g transform="translate(262 48)">
        <rect width="34" height="36" rx="2" fill="#1e1c4a" stroke="#ffffff22" />
        <circle cx="17" cy="14" r="8" fill="none" stroke="#9b98b8" strokeWidth="1.4" />
        <path d="M17 14 20 9" stroke="#f3a02e" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="6" y="26" width="22" height="5" fill="#0f0e24" />
        <text x="-2" y="52" fill="#9b98b8" fontSize="8" fontFamily="var(--font-mono)">
          NET METER
        </text>
      </g>

      {/* split to home + grid */}
      <path
        d="M296 66 H330 M330 66 V40 M330 66 V150 M330 40 H360 M330 150 H360"
        stroke="#5a50dc"
        strokeWidth="2"
        strokeDasharray="4 6"
        strokeLinecap="round"
        style={{ animation: 'dash-flow 0.9s linear infinite' }}
        className="motion-reduce:[animation:none]"
      />

      {/* home */}
      <g transform="translate(360 24)">
        <path d="M0 16 L14 4 L28 16 V34 H0 Z" fill="#1e1c4a" stroke="#ffffff22" />
        <rect x="10" y="22" width="8" height="12" fill="#f3a02e" fillOpacity="0.5" />
        <text x="-6" y="48" fill="#9b98b8" fontSize="8" fontFamily="var(--font-mono)">
          HOME
        </text>
      </g>

      {/* grid pylon */}
      <g transform="translate(360 132)">
        <path
          d="M14 0 L26 34 H2 Z M6 12 H22 M8 22 H20"
          fill="none"
          stroke="#9b98b8"
          strokeWidth="1.5"
        />
        <text x="-6" y="48" fill="#9b98b8" fontSize="8" fontFamily="var(--font-mono)">
          GRID
        </text>
      </g>
    </svg>
  )
}


/** The same solar-flow labels, arranged in a connected, counter-rotating orbit. */
function SolarOrbit({ className }: { className?: string }) {
  const nodes = [
    { label: 'PV ARRAY · DC', x: 260, y: 85, icon: '▦' },
    { label: 'INVERTER', x: 435, y: 260, icon: '∿' },
    { label: 'HOME', x: 260, y: 435, icon: '⌂' },
    { label: 'GRID', x: 85, y: 260, icon: '⚡' },
  ]
  return (
    <svg viewBox="0 0 520 520" className={['solar-orbit w-full', className].filter(Boolean).join(' ')}
      role="img" aria-label="Solar panels feed a DC-to-AC inverter, then a meter, then the home and the grid" fill="none">
      <circle cx="260" cy="260" r="235" stroke="#ffffff0d" />
      <circle cx="260" cy="260" r="175" stroke="#f3a02e30" />
      <circle cx="260" cy="260" r="110" stroke="#ffffff12" strokeDasharray="3 9" />
      <path d="M260 15V505M15 260H505" stroke="#ffffff0a" />
      <g className="solar-orbit-track">
        {nodes.map(({ label, x, y, icon }) => (
          <g key={label}>
            <path d={`M260 260L${x} ${y}`} stroke="#f3a02e30" />
            <path className="solar-orbit-current" d={`M260 260L${x} ${y}`} stroke="#f3a02e" strokeDasharray="3 65" />
            <g transform={`translate(${x} ${y})`}>
              <g className="solar-orbit-label">
                <rect x="-66" y="-37" width="132" height="74" rx="7" fill="#17163f" stroke="#f3a02e55" />
                <text y="0" textAnchor="middle" fontSize="28" fill="#f3a02e">{icon}</text>
                <text y="23" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill="#fdfdfc">{label}</text>
              </g>
            </g>
          </g>
        ))}
      </g>
      <circle className="solar-orbit-pulse" cx="260" cy="260" r="64" stroke="#f3a02e55" />
      <circle cx="260" cy="260" r="56" fill="#1e1c4a" stroke="#f3a02e" />
      <circle cx="260" cy="248" r="15" stroke="#9b98b8" />
      <path d="M260 248l7-10" stroke="#f3a02e" strokeWidth="2" />
      <text x="260" y="284" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill="#fdfdfc">NET METER</text>
    </svg>
  )
}
