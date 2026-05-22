import React from 'react'
import useDashboardStore from '../store/dashboardStore'

export default function ISSPanel() {
  const position = useDashboardStore((s) => s.iss_position)
  const passes = useDashboardStore((s) => s.iss_passes)

  return (
    <div style={styles.panel}>
      <h2 style={styles.heading}>🛸 ISS Position</h2>

      {!position ? (
        <p style={styles.loading}>Fetching ISS position...</p>
      ) : (
        <div style={styles.grid}>
          <Stat label="Latitude" value={position.latitude?.toFixed(4) ?? 'N/A'} />
          <Stat label="Longitude" value={position.longitude?.toFixed(4) ?? 'N/A'} />
          <Stat label="Over" value={position.location ?? 'Unknown'} />
        </div>
      )}

      <h3 style={styles.subheading}>Next Passes</h3>
      {!passes ? (
        <p style={styles.loading}>Fetching pass times...</p>
      ) : passes.length === 0 ? (
        <p style={styles.muted}>Pass data unavailable (Open-Notify outage)</p>
      ) : (
        <ul style={styles.list}>
          {passes.map((p, i) => (
            <li key={i} style={styles.listItem}>
              <span>🕐 {p.time ?? p.risetime}</span>
              <span style={styles.muted}>{p.duration ?? `${p.duration_seconds}s`}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: '#a78bfa', fontSize: '1.25rem', fontWeight: '700' }}>{value}</div>
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
  loading: { color: '#6b7280', fontSize: '0.85rem' },
  muted: { color: '#6b7280', fontSize: '0.85rem' },
  list: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    padding: '0.4rem 0.5rem',
    background: '#0d0d1a',
    borderRadius: '6px',
  },
}