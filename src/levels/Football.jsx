import { useState } from 'react'
import { getQuestion } from '../content/reading'
import { playTouchdown, playGroan, playCrowd } from '../sounds'
import { FONT_DISPLAY as DISP } from '../theme'
import { recordAttempt } from '../progress'

const MAX_TD = 3
const YARDS_PER_CORRECT = 20
const END_ZONE = 100

export default function Football({ playerName, onWin }) {
  const [tdCount, setTdCount] = useState(0)
  const [yard, setYard] = useState(20)
  const [down, setDown] = useState(1)
  const [question, setQuestion] = useState(() => getQuestion(0))
  const [result, setResult] = useState(null)

  function handleAnswer(choice) {
    if (result) return
    const isCorrect = choice === question.answer
    recordAttempt('Reading', isCorrect, question.sentence)
    if (isCorrect) {
      const newYard = Math.min(yard + YARDS_PER_CORRECT, END_ZONE)
      setYard(newYard)
      setDown(1)
      if (newYard >= END_ZONE) {
        const newTD = tdCount + 1
        setTdCount(newTD)
        playTouchdown()
        setTimeout(() => playCrowd(), 300)
        setResult('td')
        if (newTD >= MAX_TD) {
          setTimeout(() => onWin(), 2000)
        } else {
          setTimeout(() => { setYard(20); setDown(1); setQuestion(getQuestion(newTD)); setResult(null) }, 1800)
        }
      } else {
        playCrowd()
        setResult('gain')
        setTimeout(() => { setQuestion(getQuestion(tdCount)); setResult(null) }, 1000)
      }
    } else {
      playGroan()
      const newDown = down + 1
      if (newDown > 4) {
        setResult('turnover')
        setYard(20)
        setDown(1)
        setTimeout(() => { setQuestion(getQuestion(tdCount)); setResult(null) }, 1400)
      } else {
        setResult('incomplete')
        setDown(newDown)
        setTimeout(() => { setQuestion(getQuestion(tdCount)); setResult(null) }, 900)
      }
    }
  }

  // Ball x: 0 yards = x=50, 100 yards = x=450 on the 500px field (x offset +15 for stands)
  const ballX = Math.round((yard / 100) * 400 + 50)
  const downLabel = ['1st', '2nd', '3rd', '4th'][down - 1]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #4B2E83 0%, #1e0f38 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0.75rem 1rem 1.5rem',
      color: '#fff',
    }}>

      {/* Husky Stadium scoreboard */}
      <div style={{
        width: '100%', maxWidth: '500px',
        background: '#1a0a30',
        borderRadius: '10px',
        border: '3px solid #4B2E83',
        marginBottom: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          background: '#4B2E83',
          padding: '0.3rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #B7A57A',
        }}>
          <span style={{ fontFamily: DISP, fontSize: '1rem', letterSpacing: '0.12em', color: '#B7A57A' }}>
            HUSKY STADIUM
          </span>
          <span style={{ fontFamily: DISP, fontSize: '0.85rem', letterSpacing: '0.1em', color: 'rgba(183,165,122,0.6)' }}>
            WASHINGTON 🏈
          </span>
        </div>
        <div style={{ padding: '0.5rem 1rem 0.6rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: DISP, fontSize: '0.65rem', letterSpacing: '0.15em', color: '#3a2060', marginBottom: '0.2rem' }}>TOUCHDOWNS</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {Array.from({ length: MAX_TD }, (_, i) => (
                <div key={i} style={{
                  width: '32px', height: '32px', borderRadius: '6px',
                  background: i < tdCount ? '#4B2E83' : '#150830',
                  border: `2px solid ${i < tdCount ? '#B7A57A' : '#2a1560'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem',
                  boxShadow: i < tdCount ? '0 0 8px rgba(183,165,122,0.4)' : 'none',
                  transition: 'all 0.2s',
                }}>
                  {i < tdCount ? '🏈' : ''}
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#2a1560' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: DISP, fontSize: '0.65rem', letterSpacing: '0.15em', color: '#3a2060', marginBottom: '0.2rem' }}>DOWN</div>
            <div style={{ fontFamily: DISP, fontSize: '2rem', letterSpacing: '0.05em', color: '#B7A57A' }}>{downLabel}</div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#2a1560' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: DISP, fontSize: '0.65rem', letterSpacing: '0.15em', color: '#3a2060', marginBottom: '0.2rem' }}>BALL AT</div>
            <div style={{ fontFamily: DISP, fontSize: '2rem', color: '#fff' }}>{yard} YD</div>
          </div>
        </div>
      </div>

      {/* Husky Stadium field with stands and Lake Washington */}
      <div style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
        <svg viewBox="0 0 500 230" width="100%" style={{ display: 'block', borderRadius: '10px', overflow: 'hidden' }}>

          {/* === TOP STANDS (y 0-28) === */}
          <rect width="500" height="28" fill="#1e0840" />
          {[0, 1].map(row => (
            <rect key={row} x="0" y={row * 14} width="500" height="13" fill={row % 2 === 0 ? '#240e4a' : '#2a1255'} />
          ))}
          {[0, 1].map(row =>
            Array.from({ length: 40 }, (_, col) => (
              <rect key={`t${row}-${col}`} x={col * 12.5 + 1} y={row * 14 + 2} width="10" height="10" rx="2"
                fill={row % 2 === 0 ? '#2e1460' : '#321868'} opacity="0.9" />
            ))
          )}
          {/* Gold fan dots */}
          {[[50,8],[125,4],[200,18],[300,8],[400,18],[470,4]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="#B7A57A" opacity="0.5" />
          ))}

          {/* === FIELD (y 28-202) === */}
          <rect x="0" y="28" width="500" height="174" fill="#2d5a1e" />
          {/* End zones */}
          <rect x="0" y="28" width="50" height="174" fill="#4B2E83" />
          <rect x="450" y="28" width="50" height="174" fill="#4B2E83" />
          <text x="25" y="120" textAnchor="middle" dominantBaseline="central"
            fill="#B7A57A" fontSize="9" fontWeight="800" transform="rotate(-90,25,115)">HUSKIES</text>
          <text x="475" y="120" textAnchor="middle" dominantBaseline="central"
            fill="#B7A57A" fontSize="9" fontWeight="800" transform="rotate(90,475,115)">HUSKIES</text>
          {/* Midfield "W" */}
          <text x="250" y="120" textAnchor="middle" dominantBaseline="central"
            fill="rgba(183,165,122,0.12)" fontSize="52" fontWeight="900" fontFamily="sans-serif">W</text>
          {/* Yard lines */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(y => {
            const x = 50 + (y / 100) * 400
            return (
              <g key={y}>
                <line x1={x} y1="28" x2={x} y2="202" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <text x={x} y="40" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">{y <= 50 ? y : 100 - y}</text>
              </g>
            )
          })}
          {/* Hash marks */}
          {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(y => {
            const x = 50 + (y / 100) * 400
            return [88, 145].map(hy => (
              <line key={`${y}-${hy}`} x1={x - 5} y1={hy} x2={x + 5} y2={hy}
                stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            ))
          })}
          {/* Football */}
          <g transform={`translate(${ballX}, 115)`} style={{ transition: 'transform 0.6s ease' }}>
            <ellipse cx="0" cy="0" rx="10" ry="6" fill="#8B4513" />
            <line x1="-6" y1="0" x2="6" y2="0" stroke="#fff" strokeWidth="1" />
          </g>

          {/* === BOTTOM STANDS (y 202-230) + Lake Washington === */}
          {/* Lake Washington (visible through open south end of Husky Stadium) */}
          <rect x="50" y="202" width="400" height="28" fill="#1a4a70" />
          <rect x="50" y="202" width="400" height="5" fill="#1d5580" opacity="0.7" />
          <text x="250" y="220" textAnchor="middle" fill="rgba(100,160,220,0.4)" fontSize="9" fontStyle="italic">Lake Washington</text>
          {/* Side wall sections */}
          <rect x="0" y="202" width="50" height="28" fill="#1e0840" />
          <rect x="450" y="202" width="50" height="28" fill="#1e0840" />
        </svg>

        {result === 'td' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '3.5rem', letterSpacing: '0.04em', color: '#FFD700', textShadow: '0 0 30px rgba(255,215,0,0.8)' }}>
              TOUCHDOWN!
            </div>
          </div>
        )}
        {result === 'turnover' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '2.5rem', color: '#ff6666' }}>TURNOVER ON DOWNS</div>
          </div>
        )}
        {result === 'incomplete' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '2.8rem', color: '#ffaa66' }}>INCOMPLETE PASS</div>
          </div>
        )}
        {result === 'gain' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '2.8rem', color: '#88ffaa' }}>+20 YARDS!</div>
          </div>
        )}
      </div>

      {/* Question card */}
      <div style={{
        width: '100%', maxWidth: '500px',
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        marginTop: '0.75rem',
        border: '1px solid rgba(183,165,122,0.15)',
      }}>
        <p style={{ opacity: 0.55, fontSize: '0.82rem', marginBottom: '0.6rem', textAlign: 'center' }}>
          Pick the right word to advance the ball!
        </p>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, textAlign: 'center', marginBottom: '1rem', lineHeight: 1.4 }}>
          {question.sentence}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {question.choices.map(choice => (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={!!result}
              style={{
                flex: 1,
                padding: '0.7rem 0.5rem',
                fontFamily: DISP,
                fontSize: '1.1rem',
                letterSpacing: '0.04em',
                borderRadius: '10px',
                border: '2px solid rgba(183,165,122,0.3)',
                background: result ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                cursor: result ? 'default' : 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!result) e.target.style.background = 'rgba(255,255,255,0.18)' }}
              onMouseLeave={e => { if (!result) e.target.style.background = 'rgba(255,255,255,0.08)' }}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      <p style={{ opacity: 0.35, fontSize: '0.78rem', marginTop: '0.75rem' }}>
        {playerName} • {MAX_TD - tdCount} more TD{MAX_TD - tdCount !== 1 ? 's' : ''} to win!
      </p>
    </div>
  )
}
