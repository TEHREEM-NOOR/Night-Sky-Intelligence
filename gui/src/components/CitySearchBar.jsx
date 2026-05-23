import { useState, useRef, useEffect } from "react"
import { Search, Loader2, Star } from "lucide-react"
import useDashboardStore  from "../store/dashboardStore"
import { useSSE } from "../hooks/useSSE"
import { useFavorites } from "../hooks/useFavorites"

export default function CitySearchBar() {
  const [input, setSuggestions] = useState([])
  const [query, setQuery]       = useState("")
  const [open, setOpen]         = useState(false)
  const debounce                = useRef(null)
  const { loading, setCity }    = useDashboardStore()
  const { fetch }               = useSSE()
  const { favorites, add, has } = useFavorites()

  const suggest = async (q) => {
    if (q.length < 2) { setSuggestions([]); return }
    try {
      const r = await window.fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`,
        { headers: { "User-Agent": "night-sky-intel/1.0" } }
      )
      const d = await r.json()
      setSuggestions(d.map((x) => x.display_name.split(",").slice(0, 2).join(", ")))
    } catch { setSuggestions([]) }
  }

  const onChange = (e) => {
    setQuery(e.target.value)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => suggest(e.target.value), 350)
    setOpen(true)
  }

  const select = (city) => {
    setQuery(city)
    setCity(city)
    setSuggestions([])
    setOpen(false)
    fetch(city)
    add(city)
  }

  const onKey = (e) => {
    if (e.key === "Enter" && query.trim()) select(query.trim())
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-up">
      {/* Search input */}
      <div className="animated-border">
        <div className="flex items-center gap-3 px-5 py-2 bg-space-900 rounded-[5px]">
          {loading
            ? <Loader2 size={20} className="text-nebula-blue animate-spin shrink-0" />
            : <Search size={20} className="text-nebula-blue shrink-0" />
          }
          <input
            type="text"
            value={query}
            onChange={onChange}
            onKeyDown={onKey}
            onFocus={() => setOpen(true)}
            placeholder="Enter any city on Earth..."
            className="flex-1 bg-transparent text-star-white font-body text-lg outline-none placeholder:text-star-dim"
          />
          {query && has(query) && (
            <Star size={16} className="text-star-gold fill-star-gold shrink-0" />
          )}
        </div>
      </div>

      {/* Autocomplete dropdown */}
      {open && input.length > 0 && (
        <div className="glass-panel mt-2 rounded-2xl overflow-hidden shadow-panel z-50 relative">
          {input.map((s, i) => (
            <button
              key={i}
              onClick={() => select(s)}
              className="w-full text-left px-5 py-3 text-star-white font-body hover:bg-space-700 hover:text-nebula-blue transition-colors border-b border-space-800 last:border-0"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Favorites chips */}
      {favorites.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {favorites.map((f) => (
            <button
              key={f}
              onClick={() => select(f)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-space-800 border border-space-600 text-star-dim hover:border-nebula-blue hover:text-nebula-blue text-sm font-body transition-all"
            >
              <Star size={11} className="text-star-gold fill-star-gold" />
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}