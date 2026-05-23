import useDashboardStore  from "../store/dashboardStore"
import AsteroidTimeline from "./AsteroidTimeline"
import { Zap } from "lucide-react"

export default function AsteroidsPanel() {
  const asteroids = useDashboardStore((s) => s.asteroids)

  if (asteroids === null) return (
    <div className="glass-panel rounded-2xl p-6 animate-pulse shadow-panel">
      <div className="h-4 w-40 bg-space-700 rounded mb-4" />
      <div className="h-32 bg-space-800 rounded-xl" />
    </div>
  )

  if (asteroids === false || !asteroids?.length) return (
    <div className="glass-panel rounded-2xl p-6 shadow-panel">
      <p className="text-star-dim font-body text-sm">No asteroid data available this week</p>
    </div>
  )

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-panel animate-fade-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-space-800 border border-star-gold/20">
          <Zap size={18} className="text-star-gold" />
        </div>
        <div>
          <h2 className="font-display text-sm text-star-gold glow-text-gold tracking-widest uppercase">Near-Earth Objects</h2>
          <p className="text-star-dim text-xs font-body mt-0.5">{asteroids.length} object{asteroids.length !== 1 ? "s" : ""} this week</p>
        </div>
        {asteroids.some(a => a.hazardous) && (
          <span className="ml-auto px-2 py-1 rounded-full bg-nebula-pink/10 border border-nebula-pink/30 text-nebula-pink text-xs font-mono">
            ⚠ {asteroids.filter(a => a.hazardous).length} hazardous
          </span>
        )}
      </div>

      {/* List */}
      <div className="space-y-3 mb-4">
        {asteroids.map((a, i) => (
          <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${a.hazardous ? "bg-nebula-pink/5 border-nebula-pink/20" : "bg-space-900 border-space-700"}`}>
            <div>
              <p className={`font-mono text-sm ${a.hazardous ? "text-nebula-pink" : "text-star-white"}`}>
                {a.hazardous && "⚠ "}{a.name}
              </p>
              <p className="text-star-dim text-xs font-body mt-0.5">{a.size_label}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm text-star-gold">{a.miss_distance_moon?.toFixed(1)}× 🌙</p>
              <p className="text-star-dim text-xs font-mono">{a.velocity} km/s</p>
            </div>
          </div>
        ))}
      </div>

      <AsteroidTimeline asteroids={asteroids} />
    </div>
  )
}