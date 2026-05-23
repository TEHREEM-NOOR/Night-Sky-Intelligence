export default function AsteroidTimeline({ asteroids = [] }) {
  if (!asteroids.length) return null

  const maxDist  = Math.max(...asteroids.map(a => a.miss_distance_moon), 5)
  const W = 700, H = 200, PAD = 40

  return (
    <div className="glass-panel rounded-2xl p-4 shadow-panel mt-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-star-gold animate-pulse" />
        <span className="font-display text-xs text-star-gold tracking-widest uppercase">Asteroid Timeline — This Week</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Y axis — Moon distances */}
        {[0, 1, 2, 3, 5].map(v => {
          const y = H - PAD - ((v / maxDist) * (H - PAD * 2))
          return (
            <g key={v}>
              <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#1a2d6b" strokeWidth="0.5" />
              <text x={PAD - 5} y={y + 4} fill="#546e8a" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono">
                {v}🌙
              </text>
            </g>
          )
        })}

        {/* Earth line */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#4fc3f744" strokeWidth="1" strokeDasharray="4,2" />
        <text x={PAD} y={H - PAD + 14} fill="#4fc3f766" fontSize="9" fontFamily="JetBrains Mono">Earth</text>

        {/* Asteroids */}
        {asteroids.map((a, i) => {
          const x = PAD + ((i + 0.5) / asteroids.length) * (W - PAD * 2)
          const y = H - PAD - ((a.miss_distance_moon / maxDist) * (H - PAD * 2))
          const color = a.hazardous ? "#f48fb1" : "#ffd54f"
          const glow  = a.hazardous ? "#f48fb1" : "#ffd54f"

          return (
            <g key={i}>
              {/* Drop line */}
              <line x1={x} y1={y + 8} x2={x} y2={H - PAD} stroke={color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2,2" />

              {/* Glow ring */}
              <circle cx={x} cy={y} r="12" fill={glow} fillOpacity="0.08" />

              {/* Asteroid dot */}
              <circle cx={x} cy={y} r={a.hazardous ? 7 : 5} fill={color} fillOpacity="0.9">
                {a.hazardous && (
                  <animate attributeName="r" values="7;10;7" dur="2s" repeatCount="indefinite" />
                )}
              </circle>

              {/* Label */}
              <text x={x} y={y - 14} fill={color} fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono">
                {a.name?.replace("(", "").replace(")", "").trim().split(" ").pop()}
              </text>
              <text x={x} y={y - 5} fill={color} fontSize="7" textAnchor="middle" fontFamily="JetBrains Mono" opacity="0.7">
                {a.miss_distance_moon?.toFixed(1)}🌙
              </text>
            </g>
          )
        })}

        {/* Hazardous legend */}
        {asteroids.some(a => a.hazardous) && (
          <g>
            <circle cx={W - PAD - 60} cy={20} r={5} fill="#f48fb1" />
            <text x={W - PAD - 50} y={24} fill="#f48fb1" fontSize="9" fontFamily="JetBrains Mono">⚠ Hazardous</text>
          </g>
        )}
      </svg>
    </div>
  )
}