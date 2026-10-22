import { useState, lazy, Suspense } from 'react'
import { getQuestion } from '../content/math'
import { playSwingWhoosh, playBatCrack, playFireworks, playCrowd, playWrong, playSideRetired } from '../sounds'
import { FONT_DISPLAY as DISP } from '../theme'
import { recordAttempt } from '../progress'

// three.js is ~1MB — only pull it into the bundle when a player actually enters this level
const BaseballScene = lazy(() => import('./baseball3d/BaseballScene'))

const MAX_HR = 5
const MAX_STRIKES = 3
const MAX_OUTS = 3

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
      background: 'linear-gradient(160deg, #0C2C56 0%, #071a35 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0.75rem 1rem 1.5rem',
      color: '#fff',
    }}>

      {/* T-Mobile Park retro scoreboard */}
      <div style={{
        width: '100%', maxWidth: '500px',
        background: '#060c16',
        borderRadius: '10px',
        border: '3px solid #1a3a5c',
        marginBottom: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
      }}>
        {/* Scoreboard header */}
        <div style={{
          background: '#0C2C56',
          padding: '0.3rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #005C5C',
        }}>
          <span style={{ fontFamily: DISP, fontSize: '1rem', letterSpacing: '0.12em', color: '#C4CED4' }}>
            T-MOBILE PARK
          </span>
          <span style={{ fontFamily: DISP, fontSize: '0.85rem', letterSpacing: '0.1em', color: '#005C5C' }}>
            MARINERS ⚾
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
                  borderRadius: '4px',
                  background: i < homeRuns ? '#e87c00' : '#0d1e30',
                  border: `1px solid ${i < homeRuns ? '#ff9922' : '#1a2d40'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  boxShadow: i < homeRuns ? '0 0 6px rgba(232,124,0,0.5)' : 'none',
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

      {/* Baseball field with T-Mobile Park stands, rendered in 3D */}
      <div style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
        <div style={{ width: '100%', aspectRatio: '500 / 310', borderRadius: '10px', overflow: 'hidden', background: '#071220' }}>
          <Suspense fallback={null}>
            <BaseballScene result={result} pitchKey={question.problem} />
          </Suspense>
        </div>

        {(result === 'hr' || result === 'win') && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: DISP, fontSize: '4rem', letterSpacing: '0.04em', color: '#FFD700', textShadow: '0 0 30px rgba(255,215,0,0.9)' }}>
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
        <p style={{ opacity: 0.55, fontSize: '0.82rem', marginBottom: '0.5rem' }}>Step up to the plate!</p>
        <div style={{ fontFamily: DISP, fontSize: '2.5rem', letterSpacing: '0.05em', marginBottom: '1rem', color: '#C4CED4' }}>
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

      <p style={{ opacity: 0.35, fontSize: '0.78rem', marginTop: '0.75rem' }}>
        {playerName} • {MAX_HR - homeRuns} more HR{MAX_HR - homeRuns !== 1 ? 's' : ''} to win the trophy!
      </p>
    </div>
  )
}
