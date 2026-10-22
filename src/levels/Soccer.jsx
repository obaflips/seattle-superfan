import { useState, useEffect, useRef } from 'react'
import { getQuestion } from '../content/spanish'
import { playGoal, playNearMiss, playWhistle } from '../sounds'
import { FONT_DISPLAY as DISP } from '../theme'
import { recordAttempt } from '../progress'

const MAX_GOALS = 5
const SWEET_MIN = 60
const SWEET_MAX = 85

export default function Soccer({ playerName, onWin }) {
  const [goals, setGoals] = useState(0)
  const [question, setQuestion] = useState(() => getQuestion())
  const [phase, setPhase] = useState('aim') // 'aim' | 'power'
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [power, setPower] = useState(0)
  const [charging, setCharging] = useState(false)
  const [result, setResult] = useState(null) // 'goal' | 'nearmiss' | 'wrongaim' | null

  // Refs mirror state so keyboard handlers never go stale and never need re-attaching
  const phaseRef = useRef('aim')
  const selectedGoalRef = useRef(null)
  const goalsRef = useRef(0)
  const retryCountRef = useRef(0)
  const resultRef = useRef(null)
  const chargingRef = useRef(false)
  const powerRef = useRef(0)
  const chargeInterval = useRef(null)
  const correctIdxRef = useRef(question.choices.indexOf(question.spanish))

  // Keep refs in sync with state
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { selectedGoalRef.current = selectedGoal }, [selectedGoal])
  useEffect(() => { goalsRef.current = goals }, [goals])
  useEffect(() => { resultRef.current = result }, [result])
  useEffect(() => {
    correctIdxRef.current = question.choices.indexOf(question.spanish)
  }, [question])

  function loadNextQuestion() {
    const q = getQuestion()
    retryCountRef.current = 0
    setQuestion(q)
    setSelectedGoal(null)
    setPhase('aim')
    setPower(0)
    powerRef.current = 0
    setResult(null)
    setCharging(false)
    chargingRef.current = false
  }

  function startCharge() {
    if (chargingRef.current) return
    if (phaseRef.current !== 'power') return
    if (resultRef.current) return

    chargingRef.current = true
    setCharging(true)
    powerRef.current = 0
    setPower(0)

    chargeInterval.current = setInterval(() => {
      powerRef.current = Math.min(powerRef.current + 2, 100)
      setPower(powerRef.current)
      if (powerRef.current >= 100) clearInterval(chargeInterval.current)
    }, 16)
  }

  function releaseCharge() {
    if (!chargingRef.current) return
    clearInterval(chargeInterval.current)
    chargingRef.current = false
    setCharging(false)

    const p = powerRef.current
    const isCorrectAim = selectedGoalRef.current === correctIdxRef.current
    const inSweetSpot = p >= SWEET_MIN && p <= SWEET_MAX

    if (!isCorrectAim) {
      playWhistle()
      resultRef.current = 'wrongaim'
      setResult('wrongaim')
      setTimeout(() => { powerRef.current = 0; loadNextQuestion() }, 1500)
    } else if (inSweetSpot) {
      playGoal()
      resultRef.current = 'goal'
      setResult('goal')
      const newGoals = goalsRef.current + 1
      setTimeout(() => {
        setGoals(newGoals)
        goalsRef.current = newGoals
        if (newGoals >= MAX_GOALS) { onWin() } else { loadNextQuestion() }
      }, 1800)
    } else {
      playNearMiss()
      resultRef.current = 'nearmiss'
      setResult('nearmiss')
      if (retryCountRef.current < 1) {
        retryCountRef.current += 1
        setTimeout(() => {
          powerRef.current = 0
          setPower(0)
          resultRef.current = null
          setResult(null)
        }, 1200)
      } else {
        setTimeout(() => { powerRef.current = 0; loadNextQuestion() }, 1200)
      }
    }
  }

  // Keyboard handlers — attached once, never re-attached
  useEffect(() => {
    const onDown = e => { if (e.code === 'Space' && !e.repeat) { e.preventDefault(); startCharge() } }
    const onUp = e => { if (e.code === 'Space') releaseCharge() }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      clearInterval(chargeInterval.current)
    }
  }, []) // empty deps — all state accessed via refs

  function handleGoalClick(idx) {
    if (phase !== 'aim' || result) return
    // The vocab check IS this aim decision -- the power-bar mini-game after
    // it is a separate motor-skill layer, so progress is recorded here,
    // not in releaseCharge() (which can re-fire on a near-miss retry).
    recordAttempt('Spanish', idx === question.choices.indexOf(question.spanish), question.spanish)
    setSelectedGoal(idx)
    selectedGoalRef.current = idx
    setPhase('power')
    phaseRef.current = 'power'
  }

  const correctIdx = question.choices.indexOf(question.spanish)
  const goalColors = question.choices.map((_, idx) => {
    if (result === 'goal' && idx === correctIdx) return '#00ff88'
    if (result === 'wrongaim' && idx === correctIdx) return '#FFD700'
    if (idx === selectedGoal) return 'rgba(255,255,255,0.3)'
    return 'rgba(255,255,255,0.08)'
  })

  // SVG coords — field starts at y=32, goals at y=38
  const GOAL_Y = 38
  const BALL_Y = 190
  const GK_Y = 60

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #001A44 0%, #5D9732 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0.75rem 1rem 1.5rem',
      color: '#fff',
    }}>

      {/* Lumen Field scoreboard */}
      <div style={{
        width: '100%', maxWidth: '500px',
        background: '#000d22',
        borderRadius: '10px',
        border: '3px solid #003087',
        marginBottom: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          background: '#003087',
          padding: '0.3rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #EBB400',
        }}>
          <span style={{ fontFamily: DISP, fontSize: '1rem', letterSpacing: '0.12em', color: '#EBB400' }}>
            LUMEN FIELD
          </span>
          <span style={{ fontFamily: DISP, fontSize: '0.85rem', letterSpacing: '0.1em', color: 'rgba(93,151,50,0.9)' }}>
            SOUNDERS ⚽
          </span>
        </div>
        <div style={{ padding: '0.5rem 1rem 0.6rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: DISP, fontSize: '0.65rem', letterSpacing: '0.15em', color: '#1a3050', marginBottom: '0.25rem' }}>GOALS</div>
            <div style={{ display: 'flex', gap: '5px' }}>
              {Array.from({ length: MAX_GOALS }, (_, i) => (
                <div key={i} style={{
                  width: '28px', height: '28px', borderRadius: '4px',
                  background: i < goals ? '#003087' : '#070e1a',
                  border: `1px solid ${i < goals ? '#EBB400' : '#0d1e30'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem',
                  boxShadow: i < goals ? '0 0 6px rgba(235,180,0,0.4)' : 'none',
                  transition: 'all 0.2s',
                }}>
                  {i < goals ? '⚽' : ''}
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#0d1e30' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: DISP, fontSize: '0.65rem', letterSpacing: '0.15em', color: '#1a3050', marginBottom: '0.1rem' }}>STATUS</div>
            <div style={{ fontFamily: DISP, fontSize: '1rem', letterSpacing: '0.05em', color: '#EBB400' }}>
              {phase === 'aim' ? 'PICK YOUR GOAL' : retryCountRef.current > 0 ? 'TRY AGAIN' : 'POWER YOUR SHOT'}
            </div>
          </div>
        </div>
      </div>

      {/* Emoji question */}
      <div style={{ fontSize: '5rem', marginBottom: '0.75rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>
        {question.emoji}
      </div>

      {/* Soccer field — extended viewBox to show Lumen Field crowd above goals */}
      <div style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
        <svg viewBox="0 0 500 230" width="100%" style={{ display: 'block', borderRadius: '10px', overflow: 'hidden' }}>

          {/* === LUMEN FIELD CROWD SECTION (y 0-32) === */}
          <rect width="500" height="32" fill="#000d22" />
          {/* Seat rows */}
          {[0, 1, 2].map(row => (
            <rect key={row} x="0" y={row * 10} width="500" height="9"
              fill={row % 2 === 0 ? '#001a40' : '#002050'} />
          ))}
          {/* Seat tiles */}
          {[0, 1, 2].map(row =>
            Array.from({ length: 40 }, (_, col) => (
              <rect key={`${row}-${col}`} x={col * 12.5 + 1} y={row * 10 + 1} width="10" height="7" rx="2"
                fill={row % 2 === 0 ? '#002460' : '#002870'} opacity="0.85" />
            ))
          )}
          {/* Fan color highlights */}
          {[[40,5],[110,15],[200,5],[290,15],[380,5],[460,15]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="3.5"
              fill={['#5D9732','#EBB400','#fff','#003087','#5D9732','#EBB400'][i % 6]}
              opacity="0.6" />
          ))}
          {/* Lumen Field roof edge — the dramatic canopy */}
          <rect x="0" y="28" width="500" height="4" fill="#003087" />
          <rect x="0" y="30" width="500" height="2" fill="#EBB400" opacity="0.6" />

          {/* === FIELD === */}
          <rect x="0" y="32" width="500" height="198" fill="#2d8a2a" />
          {/* Grass stripes */}
          {[0,1,2,3,4,5,6,7].map(i => (
            <rect key={i} x="0" y={32 + i * 25} width="500" height="12"
              fill="rgba(0,0,0,0.06)" />
          ))}
          <rect x="10" y="42" width="480" height="178" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          <line x1="250" y1="42" x2="250" y2="220" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <circle cx="250" cy="130" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* Center dot */}
          <circle cx="250" cy="130" r="3" fill="rgba(255,255,255,0.3)" />
          <path d="M 130,90 Q 250,50 370,90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* Three goal nets — shifted down to y=GOAL_Y */}
          {[80, 250, 420].map((cx, idx) => (
            <g key={idx} onClick={() => handleGoalClick(idx)} style={{ cursor: phase === 'aim' ? 'pointer' : 'default' }}>
              <rect
                x={cx - 45} y={GOAL_Y} width="90" height="50" rx="4"
                fill={goalColors[idx]}
                stroke={idx === selectedGoal ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)'}
                strokeWidth={idx === selectedGoal ? 3 : 1.5}
                style={{ transition: 'all 0.2s' }}
              />
              {[-30, -10, 10, 30].map(dx => (
                <line key={dx} x1={cx + dx} y1={GOAL_Y} x2={cx + dx} y2={GOAL_Y + 50}
                  stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              ))}
              {[15, 30, 45].map(dy => (
                <line key={dy} x1={cx - 45} y1={GOAL_Y + dy} x2={cx + 45} y2={GOAL_Y + dy}
                  stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              ))}
              <text x={cx} y={GOAL_Y + 68} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700"
                fontFamily={DISP} letterSpacing="0.04em">
                {question.choices[idx]}
              </text>
            </g>
          ))}

          {/* Ball */}
          {result === 'goal' && selectedGoal !== null && (
            <circle cx={[80, 250, 420][selectedGoal]} cy={GK_Y} r="10" fill="#fff" stroke="#333" strokeWidth="1.5">
              <animateMotion path={`M ${250 - [80, 250, 420][selectedGoal]},${BALL_Y - GK_Y} L 0,0`} dur="0.8s" fill="freeze" />
            </circle>
          )}
          {!result && phase === 'power' && (
            <circle cx="250" cy={BALL_Y} r="10" fill="#fff" stroke="#333" strokeWidth="1.5" />
          )}
          {!result && phase === 'aim' && (
            <circle cx="250" cy={BALL_Y} r="10" fill="#fff" stroke="#333" strokeWidth="1.5">
              <animate attributeName="r" values="9;11;9" dur="1.5s" repeatCount="indefinite" />
            </circle>
          )}

          {/* Goalkeeper */}
          {(phase === 'power' || result) && (
            <g transform={`translate(${result === 'wrongaim' || result === 'nearmiss' ? (selectedGoal !== null ? [80, 250, 420][selectedGoal] : 250) : 250}, ${GK_Y})`}>
              <rect x="-8" y="-12" width="16" height="20" rx="3" fill="#FFD700" />
              <circle cx="0" cy="-18" r="7" fill="#FFDAB9" />
            </g>
          )}
        </svg>

        {result === 'goal' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '4rem', letterSpacing: '0.04em', color: '#FFD700', textShadow: '0 0 30px rgba(255,215,0,0.9)' }}>
              GOAL!
            </div>
          </div>
        )}
        {result === 'wrongaim' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '2.8rem', color: '#ff7777' }}>SAVED! TRY AGAIN</div>
          </div>
        )}
        {result === 'nearmiss' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '2.8rem', color: '#ffbb44' }}>SO CLOSE!</div>
          </div>
        )}
      </div>

      {/* Power meter */}
      {phase === 'power' && !result && (
        <div style={{ width: '100%', maxWidth: '500px', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.3rem' }}>
            <span>Power</span>
            <span>Sweet spot: {SWEET_MIN}–{SWEET_MAX}%</span>
          </div>
          <div style={{
            height: '36px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              left: `${SWEET_MIN}%`, width: `${SWEET_MAX - SWEET_MIN}%`,
              top: 0, bottom: 0,
              background: 'rgba(0,255,100,0.25)',
              borderLeft: '2px solid rgba(0,255,100,0.7)',
              borderRight: '2px solid rgba(0,255,100,0.7)',
            }} />
            <div style={{
              height: '100%',
              width: `${power}%`,
              background: power >= SWEET_MIN && power <= SWEET_MAX
                ? 'linear-gradient(90deg, #00cc55, #00ff88)'
                : power > SWEET_MAX
                  ? 'linear-gradient(90deg, #ff4444, #ff6666)'
                  : 'linear-gradient(90deg, #4488ff, #66aaff)',
              borderRadius: '6px',
              transition: 'background-color 0.1s',
            }} />
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7 }}>
            Hold the button (or SPACE) — release in the green zone!
          </p>
          <div
            onMouseDown={startCharge}
            onMouseUp={releaseCharge}
            onMouseLeave={releaseCharge}
            onTouchStart={e => { e.preventDefault(); startCharge() }}
            onTouchEnd={e => { e.preventDefault(); releaseCharge() }}
            style={{
              marginTop: '0.5rem',
              padding: '1rem',
              borderRadius: '12px',
              background: charging ? 'rgba(0,255,100,0.2)' : 'rgba(255,255,255,0.1)',
              border: `2px solid ${charging ? 'rgba(0,255,100,0.7)' : 'rgba(255,255,255,0.25)'}`,
              textAlign: 'center',
              fontFamily: DISP,
              fontSize: '1.3rem',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              transition: 'background 0.1s, border-color 0.1s',
            }}
          >
            {charging ? 'RELEASE!' : 'HOLD TO SHOOT'}
          </div>
        </div>
      )}

      <p style={{ opacity: 0.35, fontSize: '0.78rem', marginTop: '0.75rem' }}>
        {playerName} • {MAX_GOALS - goals} more goal{MAX_GOALS - goals !== 1 ? 's' : ''} to win!
      </p>
    </div>
  )
}
