import { STADIUM_DATA, FONT_DISPLAY } from '../theme'
import { getProgress } from '../progress'
import Card from '../components/Card'
import Button from '../components/Button'

function loadHof() {
  try { return JSON.parse(localStorage.getItem('superfan_hof') || '[]') } catch { return [] }
}

function SubjectCard({ subject, accent, emoji, stats }) {
  const total = stats.correct + stats.incorrect
  const pct = total > 0 ? Math.round((stats.correct / total) * 100) : null
  const topMissed = Object.entries(stats.missed || {}).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <Card style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: '1.1rem', letterSpacing: '0.04em', color: accent }}>
          {emoji} {subject}
        </span>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: '1.3rem', color: '#fff' }}>
          {pct !== null ? `${pct}%` : '—'}
        </span>
      </div>
      <div style={{ fontSize: '0.8rem', opacity: 0.55, marginTop: '0.15rem' }}>
        {total > 0 ? `${stats.correct} of ${total} correct` : 'Not played yet'}
      </div>
      {topMissed.length > 0 && (
        <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '0.5rem', lineHeight: 1.5 }}>
          <span style={{ opacity: 0.6 }}>Needs practice: </span>
          {topMissed.map(([item, count]) => `${item} (${count}×)`).join(', ')}
        </div>
      )}
    </Card>
  )
}

export default function ParentDashboard({ onBack }) {
  const progress = getProgress()
  const hof = loadHof()
  const totals = Object.values(progress.subjects).reduce(
    (acc, s) => ({ correct: acc.correct + s.correct, total: acc.total + s.correct + s.incorrect }),
    { correct: 0, total: 0 },
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #1a0a2e 100%)',
      color: '#fff',
      padding: '2rem 1.5rem 3rem',
    }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: '1.8rem', letterSpacing: '0.03em' }}>
            Parent Dashboard
          </h1>
          <Button variant="ghost" accent="#fff" onClick={onBack} style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
            ← Back
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Card style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: '1.6rem' }}>{totals.total}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>questions answered</div>
          </Card>
          <Card style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: '1.6rem' }}>🏆 {hof.length}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>championships won</div>
          </Card>
        </div>

        {STADIUM_DATA.map(s => (
          <SubjectCard
            key={s.subject}
            subject={s.subject}
            accent={s.accent}
            emoji={s.emoji}
            stats={progress.subjects[s.subject] || { correct: 0, incorrect: 0, missed: {} }}
          />
        ))}
      </div>
    </div>
  )
}
