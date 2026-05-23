export default function CloudSparkline({ hourly = [], tonightAvg = 0 }) {
  const W = 700, H = 100, PAD = 20
  const max = 100

  if (!hourly.length) return null

  const points = hourly.map((v, i) => {
    const x = PAD + (i / (hourly.length - 1)) * (W - PAD * 2)
    const y = H - PAD - ((v / max) * (H - PAD * 2))
    return `${x},${y}`
  }).join(" ")

  // Tonight window — roughly hours 20-24 of today
  const tonightStart = PAD + (20 / 48) * (W - PAD * 2)
  const tonightEnd   = PAD + (24 / 48) * (W - PAD * 2)

  return (
    <div className="glass-panel rounded-2xl p-4 shadow-panel mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-nebula-purple animate-pulse" />
          <span className="font-display text-xs text-nebula-purple tracking-widest uppercase">48hr Cloud Cover</span>
        </div>
        <span className="font-mono text-xs text-star-dim">
          Tonight avg: <span className={tonightAvg < 40 ? "text-nebula-cyan" : "text-nebula-pink"}>{tonightAvg}%</span>
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Tonight highlight */}
        <rect
          x={tonightStart} y={PAD}
          width={tonightEnd - tonightStart} height={H - PAD * 2}
          fill="#b388ff" fillOpacity="0.08"
          rx="4"
        />
        <text x={(tonightStart + tonightEnd) / 2} y={PAD + 10} fill="#b388ff" fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono" opacity="0.7">
          Tonight
        </text>

        {/* Grid */}
        {[0, 25, 50, 75, 100].map(v => {
          const y = H - PAD - ((v / 100) * (H - PAD * 2))
          return (
            <g key={v}>
              <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#1a2d6b" strokeWidth="0.5" />
              <text x={PAD - 5} y={y + 3} fill="#546e8a" fontSize="8" textAnchor="end" fontFamily="JetBrains Mono">{v}%</text>
            </g>
          )
        })}

        {/* Area fill */}
        <defs>
          <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b388ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#b388ff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polyline points={points} fill="none" stroke="#b388ff" strokeWidth="2" strokeLinejoin="round" />

        {/* Hour labels */}
        {[0, 6, 12, 18, 24, 30, 36, 42, 48].map(h => {
          const x = PAD + (h / 48) * (W - PAD * 2)
          return (
            <text key={h} x={x} y={H - 4} fill="#546e8a" fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono">
              {h}h
            </text>
          )
        })}
      </svg>
    </div>
  )
}