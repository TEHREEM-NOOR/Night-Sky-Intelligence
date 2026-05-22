import React from 'react'
import CitySearchBar from './components/CitySearchBar'
import ISSPanel from './components/ISSPanel'
import AsteroidsPanel from './components/AsteroidsPanel'
import WeatherPanel from './components/WeatherPanel'
import APODPanel from './components/APODPanel'
import VerdictPanel from './components/VerdictPanel'
import useDashboardStore from './store/dashboardStore'

export default function App() {
  const error = useDashboardStore((s) => s.error)
  const verdict = useDashboardStore((s) => s.verdict)

  // show dashboard grid only once any data has started arriving
  const hasData = useDashboardStore((s) =>
    s.iss_position || s.asteroids || s.weather || s.apod || s.moon || s.verdict
  )

  return (
    <div style={styles.app}>
      <CitySearchBar />

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {hasData && (
        <div style={styles.grid}>
          <VerdictPanel />
          <ISSPanel />
          <WeatherPanel />
          <AsteroidsPanel />
          <APODPanel />
        </div>
      )}

      {!hasData && !error && (
        <div style={styles.empty}>
          <p>🌠 Enter a city above to check tonight's stargazing conditions</p>
        </div>
      )}
    </div>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    background: '#0a0a0f',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1rem',
    padding: '1.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  error: {
    margin: '1rem 1.5rem',
    padding: '0.75rem 1rem',
    background: '#1a0a0a',
    border: '1px solid #ef4444',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '0.9rem',
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#4b5563',
    fontSize: '1.1rem',
  },
}