import { useEffect, useRef } from "react"
import useDashboardStore from "../store/dashboardStore"

export function useSSE() {
  const { city, setLoading, setError, setSectionData, resetDashboard } = useDashboardStore()
  const esRef = useRef(null)

  const fetch = (cityName) => {
    if (!cityName?.trim()) return
    if (esRef.current) esRef.current.close()

    resetDashboard()

    setLoading(true)
    setError(null)

    const es = new EventSource(
      `http://localhost:7842/api/stream?city=${encodeURIComponent(cityName)}`
    )
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const { section, data } = JSON.parse(e.data)
        setSectionData(section, data)
        if (section === "verdict") {
          setLoading(false)
          es.close()
        }
      } catch {}
    }

    es.onerror = () => {
      setError("Connection lost. Is the backend running?")
      setLoading(false)
      es.close()
    }
  }

  useEffect(() => () => esRef.current?.close(), [])

  return { fetch }
}