import { Settings } from "lucide-react"
import CitySearchBar    from "./components/CitySearchBar"
import CityFavorites    from "./components/CityFavorites"
import ISSPanel         from "./components/ISSPanel"
import AsteroidsPanel   from "./components/AsteroidsPanel"
import WeatherPanel     from "./components/WeatherPanel"
import APODPanel        from "./components/APODPanel"
import VerdictPanel     from "./components/VerdictPanel"
import SettingsDrawer   from "./components/SettingsDrawer"
import useDashboardStore  from "./store/dashboardStore"

export default function App() {
  const { iss, toggleSettings } = useDashboardStore()
  const hasData = iss !== null

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
          <button
            onClick={toggleSettings}
            className="p-2.5 rounded-xl glass-panel border border-space-600 hover:border-nebula-blue text-star-dim hover:text-nebula-blue transition-all"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Search */}
        <CitySearchBar />
        <CityFavorites />

        {/* Dashboard grid */}
        {hasData && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <VerdictPanel />
            </div>
            <div className="space-y-6">
              <ISSPanel />
              <APODPanel />
            </div>
            <div className="space-y-6">
              <WeatherPanel />
              <AsteroidsPanel />
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

      <SettingsDrawer />
    </div>
  )
}