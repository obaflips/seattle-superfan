import { useEffect, useState } from 'react'
import { playHorn, playCrowd } from '../sounds'
import { STADIUM_DATA } from '../theme'
import Button from '../components/Button'

const CONFETTI_COLORS = ['#C4CED4', '#B7A57A', '#EBB400', '#FFC200', '#005C5C', '#4B2E83', '#5D9732', '#EE3124']

function randomBetween(a, b) { return a + Math.random() * (b - a) }

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: randomBetween(0, 100),
      delay: randomBetween(0, 2),
      duration: randomBetween(2.5, 5),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: randomBetween(8, 16),
      rotation: randomBetween(0, 360),
    }))
  )

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confettiFall ${p.duration}s ${p.delay}s linear infinite`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export default function Championship({ playerName, onPlayAgain }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Record this champion
    try {
      const existing = JSON.parse(localStorage.getItem('superfan_hof') || '[]')
      const entry = { name: playerName, date: new Date().toLocaleDateString() }
      localStorage.setItem('superfan_hof', JSON.stringify([...existing, entry]))
    } catch {}

    const t = setTimeout(() => {
      setVisible(true)
      playHorn()
      setTimeout(playCrowd, 500)
    }, 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #1a0a2e 50%, #0a2010 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: '#fff',
      textAlign: 'center',
      position: 'relative',
    }}>
      <Confetti />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
        }}>
          {STADIUM_DATA.map((s, i) => (
            <div
              key={i}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'scale(1)' : 'scale(0)',
                transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.12}s`,
              }}
            >
              🏆
            </div>
          ))}
        </div>

        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.5s ease 0.6s',
        }}>
          <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '0.5rem' }}>Congratulations,</p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.25rem', lineHeight: 1.1 }}>
            {playerName}
          </h1>
          <h2 style={{
            fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem',
            background: 'linear-gradient(90deg, #FFD700, #FFC200, #EBB400)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            ULTIMATE SEATTLE SUPERFAN!
          </h2>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', margin: '1.5rem 0' }}>
            {STADIUM_DATA.map((s, i) => (
              <div key={i} style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '10px',
                background: s.accent,
                color: '#000',
                fontSize: '0.8rem',
                fontWeight: 600,
                opacity: 0.9,
              }}>
                {s.emoji} {s.name}
              </div>
            ))}
          </div>

          <Button variant="ghost" accent="#FFD700" onClick={onPlayAgain} style={{ marginTop: '0.5rem' }}>
            Play Again
          </Button>
        </div>
      </div>
    </div>
  )
}
