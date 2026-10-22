import { useState, useEffect } from 'react'
import { STADIUM_DATA, StadiumSilhouette } from '../stadiums'
import Button from '../components/Button'

export default function LevelIntro({ levelId, playerName, onEnter }) {
  const [visible, setVisible] = useState(false)
  const s = STADIUM_DATA[levelId]

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: s.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      color: '#fff',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Large faded silhouette as background */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '120%',
        maxWidth: '700px',
        opacity: 0.08,
        pointerEvents: 'none',
      }}>
        <StadiumSilhouette id={levelId} color="#ffffff" />
      </div>

      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0',
      }}>
        {/* Stadium silhouette — foreground, colored */}
        <div style={{
          width: '280px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.5s ease',
          marginBottom: '1.5rem',
          filter: `drop-shadow(0 8px 24px rgba(0,0,0,0.5))`,
        }}>
          <StadiumSilhouette id={levelId} color={s.accent} />
        </div>

        {/* Level number */}
        <div style={{
          fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
          fontSize: '0.9rem',
          letterSpacing: '0.25em',
          color: s.accent,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease 0.1s',
          marginBottom: '0.25rem',
        }}>
          LEVEL {levelId + 1} — {s.subject.toUpperCase()}
        </div>

        {/* Stadium name */}
        <div style={{
          fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
          fontSize: 'clamp(2.8rem, 10vw, 4.5rem)',
          lineHeight: 1,
          letterSpacing: '0.03em',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s ease 0.15s',
          marginBottom: '0.25rem',
        }}>
          {s.name}
        </div>

        {/* Team */}
        <div style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: '1rem',
          fontWeight: 600,
          opacity: visible ? 0.7 : 0,
          transition: 'opacity 0.4s ease 0.25s',
          letterSpacing: '0.1em',
          marginBottom: '1.25rem',
        }}>
          {s.team.toUpperCase()}
        </div>

        {/* Hype line */}
        <div style={{
          fontSize: '1.1rem',
          opacity: visible ? 0.85 : 0,
          transition: 'opacity 0.4s ease 0.35s',
          marginBottom: '2rem',
          maxWidth: '320px',
          lineHeight: 1.4,
        }}>
          {s.hype}
        </div>

        {/* Enter button -- entrance animation on this wrapper, not Button's own
            style, so Button's built-in hover-scale still works once visible */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.9)',
          transition: 'all 0.4s ease 0.45s',
        }}>
          <Button onClick={onEnter} accent={s.accent} style={{ fontSize: '1.4rem', padding: '0.7rem 2.5rem' }}>
            ENTER THE STADIUM
          </Button>
        </div>

        <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', opacity: 0.4 }}>
          {playerName} • {s.emoji}
        </div>
      </div>
    </div>
  )
}
