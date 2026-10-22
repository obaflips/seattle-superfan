// Single source of truth for shared design tokens -- stadium colors live in
// stadiums.jsx (paired with the silhouette art), re-exported here so every
// screen imports the SAME palette instead of re-declaring its own copy.
export { STADIUM_DATA } from './stadiums'

export const FONT_DISPLAY = "'Bebas Neue', 'Oswald', sans-serif"
export const FONT_BODY = "system-ui, Helvetica, Arial, sans-serif"

export const RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '14px',
  xl: '16px',
}

export const SPACE = {
  xs: '0.4rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
}
