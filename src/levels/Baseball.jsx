import { useState } from 'react'
import { getQuestion } from '../content/math'
import { playSwingWhoosh, playBatCrack, playFireworks, playCrowd, playWrong, playSideRetired } from '../sounds'
import { FONT_DISPLAY as DISP, FONT_DECO as DECO } from '../theme'
import { recordAttempt } from '../progress'

const MAX_HR = 5
const MAX_STRIKES = 3
const MAX_OUTS = 3

// T-Mobile Park's own identity colors (STADIUM_DATA, src/stadiums.jsx) carried
// through as the Deco hairline/accent palette -- see DESIGN.md.
const NAVY = '#0C2C56'
const NAVY_DEEP = '#071220'
const NAVY_NEAR = '#0a2449'
const TEAL = '#005C5C'
const SILVER = '#C4CED4'
const CREAM = '#fdf6e3'

const RAY_ANGLES = [-70, -56, -42, -28, -14, 0, 14, 28, 42, 56, 70]

function DecoScene({ result }) {
  const celebrating = result === 'hr' || result === 'win'
  const dimmed = result === 'sideRetired'
  const shaking = result === 'strike' || result === 'strikeout' || result === 'sideRetired'

  return (
    <div className={shaking ? 'deco-shake' : undefined} style={{ width: '100%', height: '100%' }}>
      <svg viewBox="0 0 500 320" width="100%" height="100%" style={{ display: 'block' }}>
        <rect width="500" height="320" fill={NAVY_DEEP} />
        <polygon points="0,150 500,150 500,320 0,320" fill={NAVY} />
        <polygon points="0,172 500,172 500,320 0,320" fill={NAVY_NEAR} />

        {/* sunburst -- brighter on a home run, dimmed on a side-retired gut-punch */}
        <g transform="translate(250,210)" opacity={dimmed ? 0.15 : celebrating ? 0.9 : 0.4} style={{ transition: 'opacity 0.3s' }}>
          {RAY_ANGLES.map(a => (
            <polygon key={a} points="0,0 -7,-190 7,-190" fill={SILVER} transform={`rotate(${a})`} />
          ))}
        </g>

        {/* stepped Deco frame */}
        <g stroke={SILVER} strokeWidth="2" fill="none">
          <rect x="8" y="8" width="484" height="304" />
          <path d="M0,28 H8 M0,44 H8 M492,28 H500 M492,44 H500" />
          <path d="M28,0 V8 M44,0 V8 M28,320 V312 M44,320 V312" />
          <path d="M472,0 V8 M456,0 V8 M472,320 V312 M456,320 V312" />
        </g>

        {/* mound */}
        <polygon points="250,225 268,235 262,250 238,250 232,235" fill={NAVY_NEAR} stroke={TEAL} strokeWidth="1.5" />
        {/* home plate hint */}
        <polygon points="250,268 244,263 244,258 256,258 256,263" fill={SILVER} opacity="0.6" />

        {!celebrating && (
          <circle cx="250" cy="228" r="9" fill={CREAM} stroke={SILVER} strokeWidth="1.5">
            {!result && <animate attributeName="cy" values="228;224;228" dur="1.4s" repeatCount="indefinite" />}
          </circle>
        )}

        {celebrating && (
          <>
            <circle cx="250" cy="228" r="9" fill={CREAM}>
              <animateMotion path="M 0,0 Q 90,-140 190,-170" dur="1.3s" fill="freeze" />
            </circle>
            <g transform="translate(440,58)">
              {RAY_ANGLES.map(a => (
                <line key={a} x1="0" y1="0" x2="0" y2="-26" stroke={SILVER} strokeWidth="2" opacity="0" transform={`rotate(${a})`}>
                  <animate attributeName="opacity" values="0;1;0" begin="0.35s" dur="0.9s" />
                </line>
              ))}
            </g>
          </>
        )}

        {/* batter: faceted geometric figure, teal uniform / silver trim */}
        <g transform="translate(400,225) scale(0.62)">
          <polygon points="-16,-150 16,-150 16,-128 -16,-128" fill={SILVER} />
          <path d="M-18,-128 Q0,-144 18,-128 L22,-150 Q0,-168 -22,-150 Z" fill={TEAL} />
          <polygon points="-20,-128 20,-128 24,-55 -24,-55" fill={SILVER} />
          <polygon points="-24,-55 -6,-55 -12,20 -30,20" fill={TEAL} />
          <polygon points="6,-55 24,-55 32,20 14,20" fill={TEAL} />
          <polygon points="20,-95 70,-130 78,-116 32,-80" fill={SILVER} />
          <polygon points="72,-138 95,-180 103,-174 82,-130" fill="#8599a8" />
        </g>
      </svg>
      <style>{`
        @keyframes decoShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        .deco-shake { animation: decoShake 0.35s ease; }
      `}</style>
    </div>
  )
}

export default function Baseball({ playerName, onWin }) {
  const [homeRuns, setHomeRuns] = useState(0)
  const [strikes, setStrikes] = useState(0)
  const [outs, setOuts] = useState(0)
  const [question, setQuestion] = useState(() => getQuestion(0))
  const [result, setResult] = useState(null)

  function handleAnswer(choice) {
    if (result) return
    const isCorrect = choice === question.answer
    recordAttempt('Math', isCorrect, question.problem)
    playSwingWhoosh()
    if (isCorrect) {
      setTimeout(() => playBatCrack(), 90)
      setTimeout(() => { playFireworks(); playCrowd() }, 200)
      const newHR = homeRuns + 1
      if (newHR >= MAX_HR) {
        setResult('win')
        setHomeRuns(newHR)
        setTimeout(() => onWin(), 2200)
      } else {
        setResult('hr')
        setHomeRuns(newHR)
        setTimeout(() => { setResult(null); setQuestion(getQuestion(newHR)); setStrikes(0) }, 1800)
      }
    } else {
      playWrong()
      const newStrikes = strikes + 1
      if (newStrikes >= MAX_STRIKES) {
        setStrikes(MAX_STRIKES)
        const newOuts = outs + 1
        if (newOuts >= MAX_OUTS) {
          // 3 outs is real: it costs a home run you already earned, not just a counter reset
          setTimeout(() => playSideRetired(), 120)
          const revertedHR = Math.max(0, homeRuns - 1)
          setResult('sideRetired')
          setOuts(0)
          setHomeRuns(revertedHR)
          setTimeout(() => { setResult(null); setStrikes(0); setQuestion(getQuestion(revertedHR)) }, 1900)
        } else {
          setResult('strikeout')
          setOuts(newOuts)
          setTimeout(() => { setResult(null); setStrikes(0); setQuestion(getQuestion(homeRuns)) }, 1200)
        }
      } else {
        setResult('strike')
        setStrikes(newStrikes)
        setTimeout(() => setResult(null), 700)
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0.75rem 1rem 1.5rem',
      color: '#fff',
    }}>

      {/* T-Mobile Park Deco scoreboard */}
      <div style={{
        width: '100%', maxWidth: '500px',
        background: NAVY_DEEP,
        borderRadius: '4px',
        border: `2px solid ${SILVER}`,
        boxShadow: `0 0 0 4px ${NAVY_DEEP}, 0 0 0 5px ${TEAL}, 0 4px 20px rgba(0,0,0,0.6)`,
        marginBottom: '0.9rem',
        overflow: 'hidden',
      }}>
        {/* Scoreboard header */}
        <div style={{
          background: NAVY,
          padding: '0.35rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${TEAL}`,
        }}>
          <span style={{ fontFamily: DECO, fontSize: '1.1rem', letterSpacing: '0.1em', color: SILVER }}>
            T-Mobile Park
          </span>
          <span style={{ fontFamily: DECO, fontSize: '0.95rem', letterSpacing: '0.08em', color: TEAL }}>
            Mariners ⚾
          </span>
        </div>
        {/* Score display */}
        <div style={{ padding: '0.5rem 1rem 0.6rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: DISP, fontSize: '0.65rem', letterSpacing: '0.15em', color: '#445566', marginBottom: '0.2rem' }}>
              HOME RUNS
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: MAX_HR }, (_, i) => (
                <div key={i} style={{
                  width: '28px', height: '28px',
                  borderRadius: '2px',
                  background: i < homeRuns ? TEAL : '#0d1e30',
                  border: `1px solid ${i < homeRuns ? SILVER : '#1a2d40'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  boxShadow: i < homeRuns ? `0 0 6px rgba(196,206,212,0.5)` : 'none',
                }}>
                  {i < homeRuns ? '⚾' : ''}
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#1a2d40' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: DISP, fontSize: '0.65rem', letterSpacing: '0.15em', color: '#445566', marginBottom: '0.2rem' }}>
              STRIKES
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {Array.from({ length: MAX_STRIKES }, (_, i) => (
                <div key={i} style={{
                  width: '20px', height: '20px',
                  borderRadius: '50%',
                  background: i < strikes ? '#cc2222' : '#0d1e30',
                  border: `2px solid ${i < strikes ? '#ff4444' : '#1a2d40'}`,
                  boxShadow: i < strikes ? '0 0 6px rgba(255,68,68,0.5)' : 'none',
                  transition: 'all 0.2s',
                }} />
              ))}
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#1a2d40' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: DISP, fontSize: '0.65rem', letterSpacing: '0.15em', color: '#445566', marginBottom: '0.2rem' }}>
              OUTS
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {Array.from({ length: MAX_OUTS }, (_, i) => (
                <div key={i} style={{
                  width: '20px', height: '20px',
                  borderRadius: '50%',
                  background: i < outs ? '#8a1414' : '#0d1e30',
                  border: `2px solid ${i < outs ? '#cc2222' : '#1a2d40'}`,
                  boxShadow: i < outs ? '0 0 6px rgba(138,20,20,0.7)' : 'none',
                  transition: 'all 0.2s',
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Baseball field, Art Deco */}
      <div style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
        <div style={{ width: '100%', aspectRatio: '500 / 320', borderRadius: '10px', overflow: 'hidden', background: NAVY_DEEP }}>
          <DecoScene result={result} />
        </div>

        {(result === 'hr' || result === 'win') && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '4rem', letterSpacing: '0.04em', color: CREAM, textShadow: `0 0 30px rgba(0,92,92,0.9)` }}>
              HOME RUN!
            </div>
          </div>
        )}
        {result === 'strikeout' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '3rem', color: '#ff6666' }}>STRIKE OUT!</div>
          </div>
        )}
        {result === 'sideRetired' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '2.4rem', letterSpacing: '0.03em', color: '#ff5555', textShadow: '0 0 24px rgba(255,68,68,0.7)', textAlign: 'center' }}>
              3 OUTS — SIDE RETIRED!
            </div>
            <div style={{ fontFamily: DISP, fontSize: '1.3rem', color: '#ffaaaa', marginTop: '0.4rem' }}>
              −1 Home Run
            </div>
          </div>
        )}
        {result === 'strike' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '3rem', color: '#ff9944' }}>STRIKE!</div>
          </div>
        )}
      </div>

      {/* Problem card */}
      <div style={{
        width: '100%', maxWidth: '500px',
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        marginTop: '0.75rem',
        textAlign: 'center',
        border: '1px solid rgba(196,206,212,0.15)',
      }}>
        <p style={{ fontFamily: DECO, letterSpacing: '0.04em', opacity: 0.6, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Step up to the plate!</p>
        <div style={{ fontFamily: DISP, fontSize: '2.5rem', letterSpacing: '0.05em', marginBottom: '1rem', color: SILVER }}>
          {question.problem} = ?
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {question.choices.map(choice => (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={!!result}
              style={{
                flex: 1, maxWidth: '120px',
                padding: '0.9rem',
                fontFamily: DISP,
                fontSize: '1.6rem',
                letterSpacing: '0.03em',
                borderRadius: '12px',
                border: '2px solid rgba(196,206,212,0.3)',
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

      <p style={{ fontFamily: DECO, letterSpacing: '0.03em', opacity: 0.45, fontSize: '0.9rem', marginTop: '0.75rem' }}>
        {playerName} • {MAX_HR - homeRuns} more HR{MAX_HR - homeRuns !== 1 ? 's' : ''} to win the trophy!
      </p>
    </div>
  )
}
