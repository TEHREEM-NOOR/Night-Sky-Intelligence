import React from 'react'
import useDashboardStore from '../store/dashboardStore'

export default function WeatherPanel() {
  const weather = useDashboardStore((s) => s.weather)
  const moon = useDashboardStore((s) => s.moon)

  return (
    <div style={styles.panel}>
      <h2 style={styles.heading}>🌤️ Tonight's Conditions</h2>

      {!weather ? (
        <p style={styles.muted}>Fetching weather...</p>
      ) : (
        <div style={styles.grid}>
          <Stat label="Cloud Cover" value={`${weather.cloud_cover_avg ?? 'N/A'}%`} />
          <Stat label="Conditions" value={weather.cloud_label ?? weather.label ?? 'N/A'} />
          <Stat label="Wind Speed" value={`${weather.wind_speed_kmh ?? weather.wind_speed ?? 'N/A'} km/h`} />
        </div>
      )}

      <h3 style={styles.subheading}>🌙 Moon Phase</h3>
      {!moon ? (
        <p style={styles.muted}>Calculating moon phase...</p>
      ) : (
        <div style={styles.moonRow}>
          <span style={styles.moonEmoji}>{moon.emoji}</span>
          <div>
            <div style={{ fontWeight: '600' }}>{moon.phase_name}</div>
            <div style={styles.muted}>{moon.illumination_pct}% illuminated</div>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: '#a78bfa', fontSize: '1.1rem', fontWeight: '700' }}>{value}</div>
      <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.2rem' }}>{label}</div>
    </div>
  )
}

const styles = {
  panel: {
    background: '#111128',
    border: '1px solid #1e1e3f',
    borderRadius: '12px',
    padding: '1.25rem',
  },
  heading: { color: '#a78bfa', marginBottom: '1rem', fontSize: '1rem' },
  subheading: { color: '#6b7280', fontSize: '0.85rem', margin: '1rem 0 0.5rem' },
  grid: { display: 'flex', justifyContent: 'space-around' },
  muted: { color: '#6b7280', fontSize: '0.85rem' },
  moonRow: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  moonEmoji: { fontSize: '2rem' },
}