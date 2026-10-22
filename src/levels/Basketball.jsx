import { useState, useEffect, useRef } from 'react'
import { getWord, scramble } from '../content/spelling'
import { playSwish, playRimClang, playHorn, playCrowd } from '../sounds'
import { FONT_DISPLAY as DISP } from '../theme'
import { recordAttempt } from '../progress'

const MAX_BASKETS = 7
const DISPLAY_DURATION = 1500
const SHOT_CLOCK_START = 24
const SHOT_CLOCK_APPEARS_AT = 3

export default function Basketball({ playerName, onWin }) {
  const [baskets, setBaskets] = useState(0)
  const initialWord = getWord(0)
  const [word, setWord] = useState(initialWord)
  const [tiles, setTiles] = useState(() => scramble(initialWord))
  const [selected, setSelected] = useState([])
  const [phase, setPhase] = useState('show')
  const [result, setResult] = useState(null)
  const [retries, setRetries] = useState(0)
  const [shotClock, setShotClock] = useState(SHOT_CLOCK_START)
  const [showShotClock, setShowShotClock] = useState(false)
  const clockRef = useRef(null)
  const wordRef = useRef(word)
  wordRef.current = word

  function loadWord(basketCount) {
    const w = getWord(basketCount)
    const t = scramble(w)
    setWord(w)
    setTiles(t)
    setSelected([])
    setRetries(0)
    setPhase('show')
    setShotClock(SHOT_CLOCK_START)
  }

  useEffect(() => {
    if (phase !== 'show') return
    clearInterval(clockRef.current)
    const t = setTimeout(() => setPhase('spell'), DISPLAY_DURATION)
    return () => clearTimeout(t)
  }, [phase, word])

  useEffect(() => {
    if (phase !== 'spell') { clearInterval(clockRef.current); return }
    setShowShotClock(baskets >= SHOT_CLOCK_APPEARS_AT)
    if (baskets < SHOT_CLOCK_APPEARS_AT) return
    clearInterval(clockRef.current)
    clockRef.current = setInterval(() => {
      setShotClock(s => {
        if (s <= 1) { clearInterval(clockRef.current); handleTimeExpired(); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(clockRef.current)
  }, [phase, baskets])

  function handleTimeExpired() {
    clearInterval(clockRef.current)
    recordAttempt('Spelling', false, wordRef.current)
    playRimClang()
    setResult('clang')
    if (retries < 1) {
      setTimeout(() => { setRetries(r => r + 1); setSelected([]); setPhase('show'); setShotClock(SHOT_CLOCK_START); setResult(null) }, 1000)
    } else {
      setTimeout(() => { loadWord(baskets); setResult(null) }, 1200)
    }
  }

  function handleTileClick(idx) {
    if (phase !== 'spell' || result) return
    if (selected.includes(idx)) {
      setSelected(prev => prev.slice(0, prev.indexOf(idx)))
    } else if (selected.length < word.length) {
      const newSelected = [...selected, idx]
      setSelected(newSelected)
      if (newSelected.length === word.length) {
        const spelled = newSelected.map(i => tiles[i]).join('').toLowerCase()
        clearInterval(clockRef.current)
        recordAttempt('Spelling', spelled === word, word)
        if (spelled === word) {
          const newBaskets = baskets + 1
          playSwish()
          setTimeout(() => playCrowd(), 300)
          setResult('swish')
          if (newBaskets >= MAX_BASKETS) {
            setTimeout(() => { playHorn(); onWin() }, 1200)
          } else {
            setTimeout(() => { setBaskets(newBaskets); loadWord(newBaskets); setResult(null) }, 1600)
          }
        } else {
          playRimClang()
          setResult('clang')
          if (retries < 1) {
            setTimeout(() => { setRetries(r => r + 1); setSelected([]); setPhase('show'); setShotClock(SHOT_CLOCK_START); setResult(null) }, 1000)
          } else {
            setTimeout(() => { loadWord(baskets); setResult(null) }, 1200)
          }
        }
      }
    }
  }

  const shotClockUrgent = shotClock <= 8

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1a2e1e 0%, #0d1a0f 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0.75rem 1rem 1.5rem',
      color: '#fff',
    }}>

      {/* Climate Pledge Arena scoreboard */}
      <div style={{
        width: '100%', maxWidth: '500px',
        background: '#0a0f0a',
        borderRadius: '10px',
        border: '3px solid #2C5234',
        marginBottom: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
      }}>
        <div style={{
          background: '#2C5234',
          padding: '0.3rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #FFC200',
        }}>
          <span style={{ fontFamily: DISP, fontSize: '0.9rem', letterSpacing: '0.1em', color: '#FFC200' }}>
            CLIMATE PLEDGE ARENA
          </span>
          <span style={{ fontFamily: DISP, fontSize: '0.8rem', letterSpacing: '0.08em', color: 'rgba(238,49,36,0.9)' }}>
            STORM 🏀
          </span>
        </div>
        <div style={{ padding: '0.5rem 1rem 0.6rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: DISP, fontSize: '0.65rem', letterSpacing: '0.15em', color: '#1a2a1a', marginBottom: '0.15rem' }}>BASKETS</div>
            <div style={{ fontFamily: DISP, fontSize: '2.2rem', letterSpacing: '0.05em', color: '#FFC200', lineHeight: 1 }}>
              {baskets}
              <span style={{ fontSize: '1rem', color: 'rgba(255,194,0,0.35)', marginLeft: '2px' }}>/{MAX_BASKETS}</span>
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#1a2a1a' }} />
          {showShotClock && (
            <>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: DISP, fontSize: '0.65rem', letterSpacing: '0.15em', color: '#1a2a1a', marginBottom: '0.15rem' }}>SHOT CLOCK</div>
                <div style={{
                  fontFamily: DISP,
                  fontSize: '2.2rem',
                  letterSpacing: '0.05em',
                  color: shotClockUrgent ? '#EE3124' : '#FFC200',
                  lineHeight: 1,
                  transition: 'color 0.3s',
                  textShadow: shotClockUrgent ? '0 0 12px rgba(238,49,36,0.7)' : 'none',
                }}>
                  {shotClock}
                </div>
              </div>
              <div style={{ width: '1px', height: '40px', background: '#1a2a1a' }} />
            </>
          )}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: DISP, fontSize: '0.65rem', letterSpacing: '0.15em', color: '#1a2a1a', marginBottom: '0.15rem' }}>STATUS</div>
            <div style={{ fontFamily: DISP, fontSize: '1rem', letterSpacing: '0.04em', color: phase === 'show' ? '#FFC200' : result === 'swish' ? '#00ff88' : result === 'clang' ? '#EE3124' : '#fff' }}>
              {phase === 'show' ? 'MEMORIZE' : phase === 'spell' ? 'SPELL IT' : result === 'swish' ? 'SWISH!' : 'CLANG!'}
            </div>
          </div>
        </div>
      </div>

      {/* Climate Pledge Arena court with arena seating */}
      <div style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
        <svg viewBox="0 0 500 220" width="100%" style={{ display: 'block', borderRadius: '10px', overflow: 'hidden' }}>

          {/* === ARENA SEATING BOWL === */}
          {/* Dark arena background */}
          <rect width="500" height="220" fill="#080e08" />
          {/* Side seating — left */}
          <polygon points="0,220 0,0 55,30 55,220" fill="#0f1a0f" />
          {/* Side seating — right */}
          <polygon points="500,220 500,0 445,30 445,220" fill="#0f1a0f" />
          {/* Seat rows left */}
          {[0,1,2,3].map(row => (
            <rect key={row} x={0} y={row * 28} width={55 - row * 4} height={26}
              fill={row % 2 === 0 ? '#0d1f0d' : '#112211'} />
          ))}
          {/* Seat tiles left */}
          {[0,1,2,3].map(row =>
            Array.from({ length: 4 }, (_, col) => (
              <rect key={`l${row}-${col}`} x={col * 11 + 2} y={row * 28 + 3} width="9" height="16" rx="2"
                fill="#152015" opacity="0.9" />
            ))
          )}
          {/* Seat rows right */}
          {[0,1,2,3].map(row => (
            <rect key={row} x={445 + row * 4} y={row * 28} width={55 - row * 4} height={26}
              fill={row % 2 === 0 ? '#0d1f0d' : '#112211'} />
          ))}
          {[0,1,2,3].map(row =>
            Array.from({ length: 4 }, (_, col) => (
              <rect key={`r${row}-${col}`} x={447 + col * 11} y={row * 28 + 3} width="9" height="16" rx="2"
                fill="#152015" opacity="0.9" />
            ))
          )}
          {/* Storm fan color dots */}
          {[[10,14],[22,42],[40,5],[460,14],[478,42],[490,5],[15,72],[35,98],[465,72],[485,98]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="4"
              fill={['#FFC200','#EE3124','#2C5234','#FFC200','#EE3124','#fff','#FFC200','#2C5234','#EE3124','#FFC200'][i]}
              opacity="0.55" />
          ))}
          {/* The famous Climate Pledge 1962 roof — visible at top */}
          <polygon points="250,0 500,32 0,32" fill="#0d180d" opacity="0.9" />
          <line x1="0" y1="32" x2="250" y2="0" stroke="rgba(255,194,0,0.2)" strokeWidth="1.5" />
          <line x1="500" y1="32" x2="250" y2="0" stroke="rgba(255,194,0,0.2)" strokeWidth="1.5" />
          <line x1="130" y1="32" x2="250" y2="0" stroke="rgba(255,194,0,0.1)" strokeWidth="1" />
          <line x1="370" y1="32" x2="250" y2="0" stroke="rgba(255,194,0,0.1)" strokeWidth="1" />

          {/* === HARDWOOD COURT === */}
          {/* Court surface */}
          <rect x="55" y="32" width="390" height="188" fill="#c8a060" />
          {/* Wood grain stripes */}
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x="55" y={32 + i * 12} width="390" height="6" fill="rgba(0,0,0,0.04)" />
          ))}
          {/* Court lines */}
          <rect x="65" y="38" width="370" height="176" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <line x1="250" y1="38" x2="250" y2="214" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <circle cx="250" cy="126" r="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <circle cx="250" cy="126" r="5" fill="rgba(255,255,255,0.3)" />
          {/* Free throw lane — Storm green */}
          <rect x="175" y="38" width="150" height="76" fill="rgba(44,82,52,0.35)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          {/* Free throw circle */}
          <circle cx="250" cy="114" r="28" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          {/* Backboard */}
          <rect x="218" y="40" width="64" height="9" rx="2" fill="#fff" opacity="0.9" />
          {/* Hoop — Storm orange/red */}
          <ellipse cx="250" cy="54" rx="20" ry="7" fill="none" stroke="#EE3124" strokeWidth="3" />
          {/* Net */}
          {[-12, -4, 4, 12].map(dx => (
            <line key={dx} x1={250 + dx} y1="54" x2={250 + dx * 0.7} y2="76" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          ))}
          <line x1="232" y1="76" x2="268" y2="76" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          {/* Three-point arc */}
          <path d="M 100,214 Q 250,70 400,214" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          {/* Storm logo hint at center */}
          <text x="250" y="134" textAnchor="middle" dominantBaseline="central"
            fill="rgba(255,194,0,0.08)" fontSize="36" fontWeight="900" fontFamily="sans-serif">⚡</text>

          {/* Shot arc */}
          {result === 'swish' && (
            <circle cx="250" cy="200" r="12" fill="#ff8800">
              <animateMotion path="M 0,0 Q -100,-170 0,-146" dur="0.8s" fill="freeze" />
            </circle>
          )}
        </svg>

        {result === 'swish' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '4rem', letterSpacing: '0.04em', color: '#FFC200', textShadow: '0 0 30px rgba(255,194,0,0.9)' }}>
              SWISH!
            </div>
          </div>
        )}
        {result === 'clang' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '3rem', color: '#ff6666' }}>CLANG! TRY AGAIN</div>
          </div>
        )}
      </div>

      {/* Word display / spell area */}
      <div style={{
        width: '100%', maxWidth: '500px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        marginTop: '0.75rem',
        textAlign: 'center',
        border: '1px solid rgba(255,194,0,0.15)',
        minHeight: '170px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        {phase === 'show' ? (
          <>
            <p style={{ opacity: 0.55, fontSize: '0.82rem', marginBottom: '0.5rem' }}>Remember this word!</p>
            <div style={{ fontFamily: DISP, fontSize: '3.5rem', letterSpacing: '0.12em', color: '#FFC200' }}>
              {word.toUpperCase()}
            </div>
          </>
        ) : (
          <>
            <p style={{ opacity: 0.55, fontSize: '0.82rem', marginBottom: '0.6rem' }}>
              {selected.length < word.length ? 'Tap the letters in order:' : 'Checking...'}
            </p>
            {/* Letter slots */}
            <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {Array.from({ length: word.length }, (_, i) => (
                <div key={i} style={{
                  width: '40px', height: '46px',
                  border: `2px solid ${i < selected.length ? '#FFC200' : 'rgba(255,255,255,0.2)'}`,
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: DISP,
                  fontSize: '1.5rem',
                  color: '#FFC200',
                  background: i < selected.length ? 'rgba(255,194,0,0.12)' : 'rgba(0,0,0,0.2)',
                  transition: 'all 0.1s',
                }}>
                  {i < selected.length ? tiles[selected[i]] : ''}
                </div>
              ))}
            </div>
            {/* Letter tiles */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {tiles.map((letter, idx) => {
                const isSelected = selected.includes(idx)
                return (
                  <button
                    key={idx}
                    onClick={() => handleTileClick(idx)}
                    disabled={!!result}
                    style={{
                      width: '42px', height: '42px',
                      borderRadius: '8px',
                      border: `2px solid ${isSelected ? 'rgba(255,194,0,0.4)' : 'rgba(255,255,255,0.25)'}`,
                      background: isSelected ? 'rgba(255,194,0,0.15)' : 'rgba(255,255,255,0.08)',
                      color: isSelected ? 'rgba(255,194,0,0.5)' : '#fff',
                      fontFamily: DISP,
                      fontSize: '1.3rem',
                      letterSpacing: '0.02em',
                      cursor: result ? 'default' : 'pointer',
                      transition: 'all 0.1s',
                    }}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      <p style={{ opacity: 0.35, fontSize: '0.78rem', marginTop: '0.75rem' }}>
        {playerName} • {MAX_BASKETS - baskets} more basket{MAX_BASKETS - baskets !== 1 ? 's' : ''} to win!
      </p>
    </div>
  )
}
