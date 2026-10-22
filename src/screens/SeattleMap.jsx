import { useState, useEffect, useRef } from 'react'
import { STADIUM_DATA, StadiumSilhouette } from '../stadiums'

export default function SeattleMap({ save, onSelectLevel, onStartOver, onOpenParentDashboard, travelFrom, onTravelDone }) {
  const { playerName, trophiesEarned, currentLevel } = save
  const [traveling, setTraveling] = useState(false)
  const travelTimer = useRef(null)

  useEffect(() => {
    if (travelFrom === null || travelFrom === undefined) return
    const next = travelFrom + 1
    if (next > 3) { onTravelDone(); return }
    setTraveling(true)
    travelTimer.current = setTimeout(() => {
      setTraveling(false)
      onTravelDone()
    }, 2500)
    return () => clearTimeout(travelTimer.current)
  }, [travelFrom])

  if (traveling) {
    const dest = STADIUM_DATA[Math.min(travelFrom + 1, 3)]
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #1a3a5c 0%, #0a2540 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        gap: '1.5rem',
      }}>
        <div style={{ fontSize: '3rem' }}>🚈</div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em' }}>
            Riding the Light Rail...
          </p>
          <p style={{ opacity: 0.6, marginTop: '0.4rem' }}>Next stop: {dest.name}</p>
        </div>
        <div style={{ width: '200px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '3px', background: '#FFD700', animation: 'trainProgress 2.5s linear forwards' }} />
        </div>
        <style>{`@keyframes trainProgress { from { width: 0% } to { width: 100% } }`}</style>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1a3a5c 0%, #0a2540 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.25rem 1rem 2rem',
      color: '#fff',
    }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em', lineHeight: 1 }}>
              Seattle Superfan
            </h1>
            <p style={{ opacity: 0.65, fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Hey {playerName}! Pick your next stadium.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
            <button
              onClick={onStartOver}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.6)',
                borderRadius: '8px',
                padding: '0.35rem 0.7rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              Start Over
            </button>
            {/* Understated on purpose -- for a parent to notice, not a kid to tap */}
            <button
              onClick={onOpenParentDashboard}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.68rem',
                cursor: 'pointer',
                padding: '0.1rem',
              }}
            >
              Parent Dashboard
            </button>
          </div>
        </div>

        {/* Trophy progress */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.6, whiteSpace: 'nowrap' }}>Trophies:</span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {STADIUM_DATA.map(s => (
              <div key={s.id} style={{
                width: '32px', height: '32px',
                borderRadius: '8px',
                background: trophiesEarned.includes(s.id) ? s.bg : 'rgba(255,255,255,0.05)',
                border: `1px solid ${trophiesEarned.includes(s.id) ? s.border : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
                opacity: trophiesEarned.includes(s.id) ? 1 : 0.35,
                transition: 'all 0.3s',
              }}>
                {trophiesEarned.includes(s.id) ? '🏆' : s.emoji}
              </div>
            ))}
          </div>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.05em', marginLeft: 'auto' }}>
            {trophiesEarned.length} / 4
          </span>
        </div>

        {/* Stadium cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {STADIUM_DATA.map(s => {
            const earned = trophiesEarned.includes(s.id)
            const isNext = s.id === currentLevel && !earned
            const locked = s.id > currentLevel

            return (
              <div
                key={s.id}
                onClick={() => isNext && onSelectLevel(s.id)}
                style={{
                  borderRadius: '16px',
                  background: locked ? 'rgba(255,255,255,0.04)' : s.bg,
                  border: `2px solid ${isNext ? s.accent : locked ? 'rgba(255,255,255,0.08)' : s.border}`,
                  padding: '0',
                  display: 'flex',
                  alignItems: 'stretch',
                  cursor: isNext ? 'pointer' : 'default',
                  opacity: locked ? 0.45 : 1,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  boxShadow: isNext ? '0 4px 24px rgba(0,0,0,0.35)' : 'none',
                  overflow: 'hidden',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (isNext) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 6px 32px rgba(0,0,0,0.45)' } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = isNext ? '0 4px 24px rgba(0,0,0,0.35)' : 'none' }}
              >
                {/* Silhouette panel */}
                <div style={{
                  width: '100px',
                  flexShrink: 0,
                  padding: '0.6rem 0.5rem 0.3rem',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  opacity: locked ? 0.3 : 0.7,
                  background: 'rgba(0,0,0,0.15)',
                }}>
                  <StadiumSilhouette id={s.id} color={locked ? '#888' : s.accent} />
                </div>

                {/* Text content */}
                <div style={{ flex: 1, padding: '0.85rem 0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
                    fontSize: '1.2rem',
                    letterSpacing: '0.03em',
                    lineHeight: 1.1,
                  }}>
                    {s.name}
                  </div>
                  <div style={{ opacity: 0.6, fontSize: '0.75rem', marginTop: '0.15rem' }}>{s.team}</div>
                  {!locked && !earned && (
                    <div style={{ fontSize: '0.78rem', marginTop: '0.35rem', opacity: 0.8, lineHeight: 1.3 }}>{s.tagline}</div>
                  )}
                  {earned && (
                    <div style={{ fontSize: '0.78rem', marginTop: '0.3rem', color: s.accent, fontWeight: 600 }}>
                      Trophy earned!
                    </div>
                  )}
                </div>

                {/* CTA / status badge */}
                <div style={{ flexShrink: 0, padding: '0.85rem 0.85rem 0.85rem 0', display: 'flex', alignItems: 'center' }}>
                  {isNext ? (
                    <div style={{
                      fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
                      background: s.accent,
                      color: '#000',
                      fontWeight: 700,
                      fontSize: '1rem',
                      letterSpacing: '0.05em',
                      padding: '0.5rem 0.8rem',
                      borderRadius: '10px',
                      whiteSpace: 'nowrap',
                      animation: 'badgePulse 2s ease-in-out infinite',
                    }}>
                      TAP TO PLAY
                    </div>
                  ) : (
                    <div style={{
                      fontSize: '1.5rem',
                      opacity: earned ? 1 : 0.3,
                    }}>
                      {earned ? '🏆' : '🔒'}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes badgePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(0.97); }
        }
      `}</style>
    </div>
  )
}
