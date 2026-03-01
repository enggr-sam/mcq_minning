import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

interface HelloResponse {
  message: string
}

export default function App() {
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/hello`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<HelloResponse>
      })
      .then((data) => {
        setMessage(data.message)
        setError(null)
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load')
        setMessage(null)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'linear-gradient(180deg, var(--bg) 0%, var(--surface) 100%)',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 600,
          marginBottom: '1rem',
          color: 'var(--text)',
        }}
      >
        MCQ Mining
      </h1>
      {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}
      {error && (
        <p style={{ color: '#f87171' }}>Error: {error}</p>
      )}
      {!loading && !error && message && (
        <p
          style={{
            fontSize: '1.25rem',
            color: 'var(--accent)',
            fontWeight: 500,
          }}
        >
          {message}
        </p>
      )}
    </main>
  )
}
