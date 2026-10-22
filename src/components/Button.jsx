import { useState } from 'react'
import { FONT_DISPLAY, RADIUS } from '../theme'

// Two variants pulled from what the app already used inconsistently:
// 'primary' = filled CTA (LevelIntro's "Enter the Stadium"), 'ghost' =
// transparent-with-border (TrophyCollect/Championship's secondary actions).
// `accent` lets each stadium/screen theme it without a new variant.
export default function Button({
  children, onClick, variant = 'primary', accent = '#fff', disabled = false, type = 'button', style = {},
}) {
  const [hover, setHover] = useState(false)

  const base = {
    fontFamily: FONT_DISPLAY,
    fontSize: '1.2rem',
    letterSpacing: '0.06em',
    padding: '0.85rem 2.5rem',
    borderRadius: RADIUS.lg,
    border: `2px solid ${disabled ? 'rgba(255,255,255,0.2)' : accent}`,
    cursor: disabled ? 'default' : 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
  }

  const variantStyle = variant === 'primary'
    ? {
        background: disabled ? 'rgba(255,255,255,0.15)' : accent,
        color: disabled ? 'rgba(255,255,255,0.4)' : '#000',
        transform: hover && !disabled ? 'scale(1.05)' : 'scale(1)',
      }
    : {
        background: hover && !disabled ? 'rgba(255,255,255,0.15)' : 'transparent',
        color: disabled ? 'rgba(255,255,255,0.4)' : accent,
      }

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variantStyle, ...style }}
    >
      {children}
    </button>
  )
}
