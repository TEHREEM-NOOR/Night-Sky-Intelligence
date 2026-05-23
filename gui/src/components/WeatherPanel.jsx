import  useDashboardStore  from "../store/dashboardStore"
import CloudSparkline from "./CloudSparkline"
import { Cloud } from "lucide-react"

export default function WeatherPanel() {
  const weather = useDashboardStore((s) => s.weather)
  const moon    = useDashboardStore((s) => s.moon)

  if (weather === null) return (
    <div className="glass-panel rounded-2xl p-6 animate-pulse shadow-panel">
      <div className="h-4 w-32 bg-space-700 rounded mb-4" />
      <div className="h-24 bg-space-800 rounded-xl" />
    </div>
  )

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-panel animate-fade-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-space-800 border border-nebula-purple/20">
          <Cloud size={18} className="text-nebula-purple" />
        </div>
        <h2 className="font-display text-sm text-nebula-purple glow-text-purple tracking-widest uppercase">Tonight's Conditions</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Cloud Cover", value: weather?.cloud_label ?? "—",       sub: `${weather?.cloud_cover ?? 0}%`,           color: weather?.cloud_cover < 40 ? "text-nebula-cyan" : "text-nebula-pink" },
          { label: "Wind Speed",  value: `${weather?.wind_speed ?? "—"} km/h`, sub: "at 10m height",                       color: "text-star-white" },
          { label: "Moon Phase",  value: moon?.emoji ?? "—",                 sub: moon?.phase_name ?? "—",                  color: "text-star-gold"  },
          { label: "Illumination",value: `${moon?.illumination ?? 0}%`,      sub: moon?.illumination < 40 ? "Dark sky ✓" : "Bright moon", color: moon?.illumination < 40 ? "text-nebula-cyan" : "text-star-dim" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-space-900 rounded-xl p-4 border border-space-700">
            <p className="text-star-dim text-xs font-body mb-2">{label}</p>
            <p className={`font-mono text-xl ${color}`}>{value}</p>
            <p className="text-star-dim text-xs font-body mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {weather?.hourly && <CloudSparkline hourly={weather.hourly} tonightAvg={weather.cloud_cover} />}
    </div>
  )
}