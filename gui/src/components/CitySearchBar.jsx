import React, { useState } from 'react'
import useDashboardStore from '../store/dashboardStore'

const API_BASE = 'http://localhost:7842'

export default function CitySearchBar() {
  const [input, setInput] = useState('')
  const { loading, setLoading, setError, resetDashboard, setSectionData, setGeocode } =
    useDashboardStore()

  const fetchDashboard = async (cityName) => {
    if (!cityName.trim()) return
    resetDashboard()
    setLoading(true)
    setError(null)

    try {
      // use SSE stream so panels appear progressively
      const url = `${API_BASE}/api/stream?city=${encodeURIComponent(cityName)}`
      const source = new EventSource(url)

      source.onmessage = (event) => {
        const msg = JSON.parse(event.data)

        if (msg.section === 'error') {
          setError(msg.message)
          setLoading(false)
          source.close()
          return
        }

        if (msg.section === 'geocode') {
          setGeocode(msg.data.city, msg.data.lat, msg.data.lng)
          return
        }

        if (msg.section === 'done') {
          setLoading(false)
          source.close()
          return
        }

        setSectionData(msg.section, msg.data)
      }

      source.onerror = () => {
        setError('Connection to backend lost. Is the server running?')
        setLoading(false)
        source.close()
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchDashboard(input)
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.logo}>🌌</span>
        <h1 style={styles.title}>Night Sky Intel</h1>
        <p style={styles.subtitle}>Real-time stargazing conditions for any city</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter city name... e.g. Lahore"
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? '⏳ Loading...' : '🔭 Search'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  wrapper: {
    padding: '2rem',
    textAlign: 'center',
    borderBottom: '1px solid #1e1e3f',
    background: 'linear-gradient(180deg, #0d0d1a 0%, #0a0a0f 100%)',
  },
  header: { marginBottom: '1.5rem' },
  logo: { fontSize: '3rem' },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#a78bfa',
    letterSpacing: '0.05em',
  },
  subtitle: { color: '#6b7280', marginTop: '0.25rem' },
  form: { display: 'flex', justifyContent: 'center', gap: '0.75rem' },
  input: {
    width: '320px',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #2d2d5f',
    background: '#111128',
    color: '#e0e0ff',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    background: '#7c3aed',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '600',
  },
}