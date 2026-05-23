import { useState, useEffect } from "react"

const KEY = "nsi_favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites))
  }, [favorites])

  const add    = (city) => setFavorites((f) => f.includes(city) ? f : [...f, city].slice(0, 8))
  const remove = (city) => setFavorites((f) => f.filter((c) => c !== city))
  const has    = (city) => favorites.includes(city)

  return { favorites, add, remove, has }
}