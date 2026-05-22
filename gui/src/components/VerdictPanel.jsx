import React from 'react'
import useDashboardStore from '../store/dashboardStore'

const SCORE_CONFIG = {
  1: { label: 'Poor', color: '#ef4444', stars: '★☆☆☆☆', bg: '#1a0a0a' },
  2: { label: 'Below Average', color: '#f97316', stars: '★★☆☆☆', bg: '#1a0f0a' },
  3: { label: 'Average', color: '#eab308', stars: '★★★☆☆', bg: '#1a1a0a' },
  4: { label: 'Good', color: '#22c55e', stars: '★★★★☆', bg: '#0a1a0a' },
  5: { label: 'Excellent', color: '#a78bfa', stars: '★★★★★', bg: '#0f0a1a' },
}

export default function VerdictPanel() {
  const verdict = useDashboardStore((s) => s.verdict)
  const city = useDashboardStore((s) => s.city)

  if (!verdict) {
    return (
      <div style={styles.panel}>
        <h2 style={styles.heading}>🌟 Stargazing Verdict</h2>
        <p style={styles.muted}>Calculating verdict...</p>
      </div>
    )
  }

  const config = SCORE_CONFIG[verdict.score] ?? SCORE_CONFIG[3]

  return (
    <div style={{ ...styles.panel, background: config.bg, borderColor: config.color }}>
      <h2 style={styles.heading}>🌟 Stargazing Verdict</h2>
      {city && <p style={styles.city}>{city}</p>}

      <div style={styles.scoreRow}>
        <span style={{ ...styles.stars, color: config.color }}>{config.stars}</span>
        <span style={{ ...styles.label, color: config.color }}>{config.label}</span>
        <span style={styles.score}>{verdict.score}/5</span>
      </div>

      {verdict.factors?.length > 0 && (
        <ul style={styles.factors}>
          {verdict.factors.map((f, i) => (
            <li key={i} style={styles.factor}>• {f}</li>
          ))}
        </ul>
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
    gridColumn: '1 / -1',
  },
  heading: { color: '#a78bfa', marginBottom: '0.75rem', fontSize: '1rem' },
  city: { color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.75rem' },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.75rem',
  },
  stars: { fontSize: '1.5rem', letterSpacing: '0.1em' },
  label: { fontSize: '1.25rem', fontWeight: '700' },
  score: { color: '#6b7280', fontSize: '0.9rem', marginLeft: 'auto' },
  factors: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  factor: { color: '#9ca3af', fontSize: '0.85rem' },
  muted: { color: '#6b7280', fontSize: '0.85rem' },
}