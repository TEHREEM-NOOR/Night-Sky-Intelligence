import { useEffect, useRef, useState } from "react"
import useDashboardStore  from "../store/dashboardStore"

// Simplified continent paths (equirectangular projection)
const CONTINENTS = [
  // North America
  "M 180,80 L 220,75 L 255,90 L 270,130 L 250,160 L 220,175 L 195,165 L 175,140 L 170,110 Z",
  // South America
  "M 220,175 L 245,170 L 260,195 L 255,240 L 235,270 L 215,260 L 205,230 L 210,195 Z",
  // Europe
  "M 370,70 L 410,65 L 430,80 L 420,100 L 390,105 L 370,95 Z",
  // Africa
  "M 375,110 L 415,105 L 435,130 L 430,190 L 405,220 L 380,210 L 365,175 L 365,135 Z",
  // Asia
  "M 430,60 L 560,55 L 580,90 L 560,130 L 510,145 L 460,135 L 430,110 L 425,80 Z",
  // Australia
  "M 520,190 L 565,185 L 575,215 L 555,240 L 520,235 L 505,210 Z",
]

export default function ISSWorldMap({ issLat, issLng }) {
  const animRef = useRef(null)
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 })
  const [track,  setTrack]  = useState([])

  // Convert lat/lng to SVG coordinates (800x400 map)
  const toXY = (lat, lng) => ({
    x: ((lng + 180) / 360) * 800,
    y: ((90  - lat)  / 180) * 400,
  })

  useEffect(() => {
    if (issLat == null || issLng == null) return
    const pos = toXY(issLat, issLng)
    setDotPos(pos)
    setTrack((t) => [...t.slice(-60), pos])
  }, [issLat, issLng])

  // Live ISS position polling
  useEffect(() => {
    const poll = async () => {
      try {
        const r = await fetch("http://api.open-notify.org/iss-now.json")
        const d = await r.json()
        const pos = toXY(+d.iss_position.latitude, +d.iss_position.longitude)
        setDotPos(pos)
        setTrack((t) => [...t.slice(-80), pos])
      } catch {}
    }
    poll()
    const id = setInterval(poll, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="glass-panel rounded-2xl p-4 shadow-panel">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-nebula-cyan animate-pulse" />
        <span className="font-display text-xs text-nebula-cyan tracking-widest uppercase">ISS Live Track</span>
      </div>

      <svg viewBox="0 0 800 400" className="w-full rounded-xl overflow-hidden" style={{ background: "linear-gradient(180deg, #03040f 0%, #070b1a 100%)" }}>
        {/* Grid lines */}
        {[0,1,2,3,4,5,6].map(i => (
          <line key={`v${i}`} x1={i*133} y1={0} x2={i*133} y2={400} stroke="#1a2d6b" strokeWidth="0.5" />
        ))}
        {[0,1,2,3].map(i => (
          <line key={`h${i}`} x1={0} y1={i*133} x2={800} y2={i*133} stroke="#1a2d6b" strokeWidth="0.5" />
        ))}

        {/* Equator */}
        <line x1="0" y1="200" x2="800" y2="200" stroke="#4fc3f722" strokeWidth="1" strokeDasharray="4,4" />

        {/* Continents */}
        {CONTINENTS.map((d, i) => (
          <path key={i} d={d} fill="#111d4a" stroke="#1a2d6b" strokeWidth="1" />
        ))}

        {/* Ground track trail */}
        {track.length > 1 && (
          <polyline
            points={track.map(p => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#00e5ff"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            strokeDasharray="3,3"
          />
        )}

        {/* ISS dot with glow rings */}
        <circle cx={dotPos.x} cy={dotPos.y} r="16" fill="#00e5ff" fillOpacity="0.05" />
        <circle cx={dotPos.x} cy={dotPos.y} r="10" fill="#00e5ff" fillOpacity="0.1" />
        <circle cx={dotPos.x} cy={dotPos.y} r="5"  fill="#00e5ff" fillOpacity="0.9" />
        <circle cx={dotPos.x} cy={dotPos.y} r="5"  fill="none" stroke="#00e5ff" strokeWidth="1">
          <animate attributeName="r" values="5;20;5" dur="3s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* ISS label */}
        <text x={dotPos.x + 10} y={dotPos.y - 8} fill="#00e5ff" fontSize="10" fontFamily="JetBrains Mono" opacity="0.8">
          🛸 ISS
        </text>
      </svg>
    </div>
  )
}