import useDashboardStore  from "../store/dashboardStore"
import ISSWorldMap from "./ISSWorldMap"
import { Satellite } from "lucide-react"

export default function ISSPanel() {
const iss = useDashboardStore((s) => s.iss_position)

  if (iss === null) return (
    <div className="glass-panel rounded-2xl p-6 animate-pulse shadow-panel">
      <div className="h-4 w-32 bg-space-700 rounded mb-4" />
      <div className="h-48 bg-space-800 rounded-xl" />
    </div>
  )

  if (iss === false) return (
    <div className="glass-panel rounded-2xl p-6 shadow-panel">
      <p className="text-star-dim font-body text-sm">ISS data unavailable</p>
    </div>
  )

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-panel animate-fade-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-space-800 border border-nebula-cyan/20">
          <Satellite size={18} className="text-nebula-cyan" />
        </div>
        <div>
          <h2 className="font-display text-sm text-nebula-cyan glow-text-blue tracking-widest uppercase">ISS Tracker</h2>
          <p className="text-star-dim text-xs font-body mt-0.5">
      Currently over: {iss?.location ?? "--"}, {iss?.lat ?? "--"}, {iss?.lng ?? "--"}          </p>
        </div>
      </div>

      <ISSWorldMap issLat={iss.lat} issLng={iss.lng} />

      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: "Next Pass",  value: iss.next_pass_local, color: "text-nebula-cyan" },
          { label: "Duration",   value: iss.duration,        color: "text-star-gold"   },
          { label: "Direction",  value: iss.direction,       color: "text-nebula-purple"},
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-space-900 rounded-xl p-3 border border-space-700">
            <p className="text-star-dim text-xs font-body mb-1">{label}</p>
            <p className={`font-mono text-sm font-medium ${color}`}>{value ?? "—"}</p>
          </div>
        ))}
      </div>
    </div>
  )
}