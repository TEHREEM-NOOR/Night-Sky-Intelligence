import { Star, X } from "lucide-react"
import { useFavorites } from "../hooks/useFavorites"
import { useSSE } from "../hooks/useSSE"
import useDashboardStore  from "../store/dashboardStore"

export default function CityFavorites() {
  const { favorites, remove }  = useFavorites()
  const { fetch }              = useSSE()
  const { setCity }            = useDashboardStore()

  if (!favorites.length) return null

  const select = (city) => { setCity(city); fetch(city) }

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {favorites.map((f) => (
        <div key={f} className="flex items-center gap-1 pl-3 pr-1 py-1.5 rounded-full bg-space-800 border border-space-600 group hover:border-star-gold transition-colors">
          <Star size={11} className="text-star-gold fill-star-gold shrink-0" />
          <button onClick={() => select(f)} className="text-star-dim group-hover:text-star-gold text-sm font-body transition-colors">
            {f}
          </button>
          <button
            onClick={() => remove(f)}
            className="ml-1 p-0.5 rounded-full hover:bg-space-700 text-star-dim hover:text-nebula-pink transition-colors"
          >
            <X size={10} />
          </button>
        </div>
      ))}
    </div>
  )
}