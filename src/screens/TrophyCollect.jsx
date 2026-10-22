import { useEffect, useState } from 'react'
import { playCrowd, playFireworks } from '../sounds'
import { STADIUM_DATA } from '../theme'
import Button from '../components/Button'

export default function TrophyCollect({ levelId, playerName, onContinue }) {
  const [visible, setVisible] = useState(false)
  const info = STADIUM_DATA[levelId]

  useEffect(() => {
    const t1 = setTimeout(() => {
      setVisible(true)
      playCrowd()
      playFireworks()
    }, 100)
    return () => clearTimeout(t1)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: info.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: '#fff',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '6rem',
        transform: visible ? 'scale(1)' : 'scale(0)',
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        marginBottom: '1.5rem',
      }}>
        🏆
      </div>

      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.4s ease 0.3s',
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          {playerName} earned the
        </h1>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: info.accent, marginBottom: '0.5rem' }}>
          {info.name} Trophy! {info.emoji}
        </h2>
        <p style={{ opacity: 0.7, marginBottom: '2.5rem' }}>
          Amazing work — keep going!
        </p>
        <Button variant="ghost" accent={info.accent} onClick={onContinue}>
          Back to Map →
        </Button>
      </div>
    </div>
  )
}
