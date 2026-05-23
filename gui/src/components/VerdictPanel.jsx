import useDashboardStore  from "../store/dashboardStore"

const STARS = ["★☆☆☆☆","★★☆☆☆","★★★☆☆","★★★★☆","★★★★★"]
const LABELS = ["STAY INSIDE","POOR CONDITIONS","DECENT NIGHT","GREAT NIGHT","PERFECT NIGHT"]
const COLORS = ["text-star-dim","text-nebula-pink","text-star-gold","text-nebula-cyan","text-nebula-cyan"]

export default function VerdictPanel() {
  const verdict = useDashboardStore((s) => s.verdict)
  const city    = useDashboardStore((s) => s.city)

  if (!verdict) return null

  const idx   = (verdict.score ?? 1) - 1
  const color = COLORS[idx]

  return (
    <div className="animated-border animate-fade-up">
      <div className="glass-panel rounded-[15px] p-8 text-center">
        <p className="font-display text-xs text-star-dim tracking-widest uppercase mb-3">
          Stargazing Verdict — {city}
        </p>

        <p className={`font-display text-5xl mb-2 ${color} glow-text-blue`}>
          {STARS[idx]}
        </p>

        <p className={`font-display text-2xl tracking-widest ${color} mb-6`}>
          {LABELS[idx]}
        </p>

        <div className="flex flex-col gap-2 text-left max-w-xs mx-auto">
          {verdict.factors?.map((f, i) => (
            <div key={i} className="flex items-center gap-3 text-sm font-body">
              <span className={f.positive ? "text-nebula-cyan" : "text-nebula-pink"}>
                {f.positive ? "✓" : "✗"}
              </span>
              <span className="text-star-dim">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}