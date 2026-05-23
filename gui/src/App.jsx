import { Settings } from "lucide-react"
import CitySearchBar       from "./components/CitySearchBar"
import CityFavorites       from "./components/CityFavorites"
import ISSPanel            from "./components/ISSPanel"
import AsteroidsPanel      from "./components/AsteroidsPanel"
import WeatherPanel        from "./components/WeatherPanel"
import APODPanel           from "./components/APODPanel"
import VerdictPanel        from "./components/VerdictPanel"
import ExportButton        from "./components/ExportButton"
import NotificationToggle  from "./components/NotificationToggle"
import useDashboardStore   from "./store/dashboardStore"

export default function App() {
  const { iss, verdict, city, toggleSettings } = useDashboardStore()
  const hasData = iss !== null

  // Notify when verdict arrives
  const notifyVerdict = () => {
    if (verdict && city && window.electronAPI) {
      window.electronAPI.notifyVerdict({ city, score: verdict.score })
    }
  }

  return (
    <div className="star-field min-h-screen relative">
      <div className="nebula-bg" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 animate-fade-up">
          <div>
            <h1 className="font-display text-3xl text-star-white glow-text-blue tracking-widest uppercase">
              🌌 Night Sky Intel
            </h1>
            <p className="text-star-dim font-body text-sm mt-2">
              Live space intelligence for any city on Earth
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <NotificationToggle />
            <ExportButton />

          </div>
        </div>

        {/* Search */}
        <CitySearchBar />
        <CityFavorites />

        {/* Dashboard */}
        {hasData && (
          <div className="mt-10 space-y-6">
            <VerdictPanel />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ISSPanel />
                <APODPanel />
              </div>
              <div className="space-y-6">
                <WeatherPanel />
                <AsteroidsPanel />
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasData && (
          <div className="text-center mt-24 animate-float">
            <p className="text-6xl mb-4">🔭</p>
            <p className="font-display text-star-dim text-sm tracking-widest uppercase">
              Enter a city to begin
            </p>
          </div>
        )}
      </div>

    </div>
  )
}