import React from 'react'
import useDashboardStore from '../store/dashboardStore'

export default function AsteroidsPanel() {
  const asteroids = useDashboardStore((s) => s.asteroids)

  return (
    <div style={styles.panel}>
      <h2 style={styles.heading}>☄️ Near-Earth Asteroids</h2>

      {!asteroids ? (
        <p style={styles.muted}>Fetching asteroid data...</p>
      ) : asteroids.length === 0 ? (
        <p style={styles.muted}>No asteroids in range this week.</p>
      ) : (
        <div style={styles.list}>
          {asteroids.map((neo, i) => (
            <div key={i} style={{
              ...styles.item,
              borderLeft: `3px solid ${neo.is_hazardous ? '#ef4444' : '#7c3aed'}`,
            }}>
              <div style={styles.name}>
                {neo.is_hazardous && <span style={styles.hazard}>⚠️ </span>}
                {neo.name}
              </div>
              <div style={styles.meta}>
                <span>📏 {neo.size_label ?? neo.diameter_label}</span>
                <span>🌙 {neo.miss_distance_moon} Moon distances</span>
                <span>💨 {neo.velocity_kmh ?? neo.relative_velocity} km/h</span>
              </div>
            </div>
          ))}
        </div>
      )}
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
  muted: { color: '#6b7280', fontSize: '0.85rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  item: {
    background: '#0d0d1a',
    borderRadius: '6px',
    padding: '0.6rem 0.75rem',
    paddingLeft: '0.75rem',
  },
  name: { fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.3rem' },
  meta: { display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#9ca3af', flexWrap: 'wrap' },
  hazard: { color: '#ef4444' },
}