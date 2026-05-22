import React, { useState } from 'react'
import useDashboardStore from '../store/dashboardStore'

export default function APODPanel() {
  const apod = useDashboardStore((s) => s.apod)
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={styles.panel}>
      <h2 style={styles.heading}>🔭 Astronomy Picture of the Day</h2>

      {!apod ? (
        <p style={styles.muted}>Fetching APOD...</p>
      ) : (
        <div>
          <p style={styles.title}>{apod.title}</p>

          {apod.is_video ? (
            <div style={styles.videoNote}>
              🎬 Today's APOD is a video —{' '}
              <a href={apod.url} target="_blank" rel="noreferrer" style={styles.link}>
                Watch on NASA
              </a>
            </div>
          ) : apod.url ? (
            <img
              src={apod.url}
              alt={apod.title}
              style={styles.image}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : null}

          <p style={styles.explanation}>
            {expanded ? apod.explanation : apod.explanation?.slice(0, 120) + '...'}
            <button
              onClick={() => setExpanded(!expanded)}
              style={styles.readMore}
            >
              {expanded ? ' less' : ' more'}
            </button>
          </p>
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
  title: { fontWeight: '600', marginBottom: '0.75rem' },
  image: {
    width: '100%',
    borderRadius: '8px',
    marginBottom: '0.75rem',
    maxHeight: '200px',
    objectFit: 'cover',
  },
  explanation: { fontSize: '0.85rem', color: '#9ca3af', lineHeight: '1.5' },
  videoNote: { fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.75rem' },
  link: { color: '#a78bfa' },
  readMore: {
    background: 'none',
    border: 'none',
    color: '#7c3aed',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  muted: { color: '#6b7280', fontSize: '0.85rem' },
}