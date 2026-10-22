import { useState } from 'react'

function loadHof() {
  try { return JSON.parse(localStorage.getItem('superfan_hof') || '[]') } catch { return [] }
}

export default function NameEntry({ onComplete }) {
  const [name, setName] = useState('')
  const hof = loadHof()

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const save = { playerName: trimmed, trophiesEarned: [], currentLevel: 0 }
    localStorage.setItem('superfan_save', JSON.stringify(save))
    onComplete(trimmed)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0C2C56 0%, #005C5C 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: '#fff',
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏟️</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>
        Seattle Superfan Challenge
      </h1>
      <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2.5rem', textAlign: 'center' }}>
        Visit 4 stadiums. Earn 4 trophies. Become the Ultimate Superfan.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '360px' }}>
        <label style={{ fontSize: '1.2rem', fontWeight: 600 }}>What's your name, Superfan?</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
          maxLength={20}
          autoFocus
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '1.2rem',
            borderRadius: '12px',
            border: '2px solid rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            textAlign: 'center',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={!name.trim()}
          style={{
            width: '100%',
            padding: '0.85rem',
            fontSize: '1.2rem',
            fontWeight: 700,
            borderRadius: '12px',
            border: 'none',
            background: name.trim() ? '#C4CED4' : 'rgba(255,255,255,0.2)',
            color: name.trim() ? '#0C2C56' : 'rgba(255,255,255,0.4)',
            cursor: name.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s',
          }}
        >
          Let's Go! →
        </button>
      </form>

      {hof.length > 0 && (
        <div style={{
          marginTop: '2.5rem',
          width: '100%',
          maxWidth: '360px',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1rem',
            letterSpacing: '0.15em',
            color: '#FFD700',
            marginBottom: '0.75rem',
            textAlign: 'center',
          }}>
            Hall of Fame
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {hof.slice().reverse().map((entry, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.9rem',
              }}>
                <span>🏆 {entry.name}</span>
                <span style={{ opacity: 0.45, fontSize: '0.78rem' }}>{entry.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
