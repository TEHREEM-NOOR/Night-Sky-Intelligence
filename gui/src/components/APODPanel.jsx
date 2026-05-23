import useDashboardStore from "../store/dashboardStore"
import { Telescope } from "lucide-react"

export default function APODPanel() {
  const apod = useDashboardStore((s) => s.apod)

  if (!apod) return null

  const description = apod.excerpt ?? apod.explanation ?? apod.description ?? ""
  const imageUrl    = apod.url ?? apod.image_url ?? apod.hdurl ?? null

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-panel animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-space-800 border border-nebula-blue/20">
          <Telescope size={18} className="text-nebula-blue" />
        </div>
        <h2 className="font-display text-sm text-nebula-blue glow-text-blue tracking-widest uppercase">NASA Today</h2>
      </div>

      {/* Image */}
      {imageUrl && apod.media_type !== "video" && (
        <img
          src={imageUrl}
          alt={apod.title}
          className="w-full rounded-xl mb-4 object-cover max-h-64"
          onError={(e) => { e.target.style.display = "none" }}
        />
      )}



      {/* Title */}
      <p className="font-display text-base text-star-white mb-3">{apod.title}</p>

      {/* Full description — no truncation */}
      <p className="text-star-dim text-sm font-body leading-relaxed">
        {description}
      </p>
    </div>
  )
}