import { RADIUS } from '../theme'

// The translucent panel pattern already used (near-identically) for the
// problem card in every level and the Hall of Fame panel on NameEntry --
// pulled out once instead of re-declared per screen.
export default function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)',
      borderRadius: RADIUS.lg,
      padding: '1rem 1.25rem',
      border: '1px solid rgba(255,255,255,0.15)',
      ...style,
    }}>
      {children}
    </div>
  )
}
