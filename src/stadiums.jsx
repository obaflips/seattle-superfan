export const STADIUM_DATA = [
  {
    id: 0,
    name: 'T-Mobile Park',
    team: 'Seattle Mariners',
    emoji: '⚾',
    subject: 'Math',
    tagline: 'The Mariners are counting on your math skills!',
    hype: 'Step up to the plate, slugger!',
    bg: 'linear-gradient(135deg, #0C2C56, #005C5C)',
    border: '#005C5C',
    accent: '#C4CED4',
  },
  {
    id: 1,
    name: 'Husky Stadium',
    team: 'UW Huskies',
    emoji: '🏈',
    subject: 'Reading',
    tagline: 'The Dawgs need a sharp reader in the huddle!',
    hype: 'The Dawgs are counting on you!',
    bg: 'linear-gradient(135deg, #4B2E83, #2a1a50)',
    border: '#B7A57A',
    accent: '#B7A57A',
  },
  {
    id: 2,
    name: 'Lumen Field',
    team: 'Seattle Sounders',
    emoji: '⚽',
    subject: 'Spanish',
    tagline: 'The Sounders need a Spanish speaker on the pitch!',
    hype: 'The Sounders need you on the pitch!',
    bg: 'linear-gradient(135deg, #003087, #5D9732)',
    border: '#EBB400',
    accent: '#EBB400',
  },
  {
    id: 3,
    name: 'Climate Pledge Arena',
    team: 'Seattle Storm',
    emoji: '🏀',
    subject: 'Spelling',
    tagline: 'The Storm needs your spelling on the scoreboard!',
    hype: "The Storm needs a spelling champion!",
    bg: 'linear-gradient(135deg, #2C5234, #1a3020)',
    border: '#FFC200',
    accent: '#FFC200',
  },
]

// T-Mobile Park — asymmetric retractable roof, light towers
function TmobileSilhouette({ c }) {
  return (
    <svg viewBox="0 0 200 95" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* Left field section — lower angled roof */}
      <polygon points="0,95 0,52 42,42 42,95" fill={c} opacity="0.8" />
      {/* Main grandstand — tallest, center/home plate area */}
      <polygon points="42,42 42,95 155,95 155,18 120,10 80,18 42,42" fill={c} />
      {/* Right field section */}
      <polygon points="155,18 155,95 200,95 200,32 178,24 155,18" fill={c} opacity="0.85" />
      {/* Light tower left */}
      <rect x="39" y="28" width="6" height="16" rx="1" fill={c} opacity="0.7" />
      <rect x="36" y="26" width="12" height="4" rx="1" fill={c} opacity="0.6" />
      {/* Light tower center */}
      <rect x="117" y="0" width="6" height="12" rx="1" fill={c} opacity="0.7" />
      <rect x="114" y="0" width="12" height="4" rx="1" fill={c} opacity="0.6" />
      {/* Light tower right */}
      <rect x="174" y="14" width="6" height="12" rx="1" fill={c} opacity="0.7" />
      {/* Roof highlight line */}
      <polyline points="0,52 42,42 80,18 120,10 155,18 200,32"
        stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
      {/* Out-of-town scoreboard hint (left field) */}
      <rect x="2" y="55" width="22" height="12" rx="2" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </svg>
  )
}

// Husky Stadium — open bowl, double-deck cantilever, Lake Washington
function HuskySilhouette({ c }) {
  return (
    <svg viewBox="0 0 200 95" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* Lake Washington visible through open south end */}
      <rect x="48" y="55" width="104" height="40" rx="4" fill="#1a5580" opacity="0.55" />
      <rect x="48" y="55" width="104" height="6" rx="2" fill="#2a70a0" opacity="0.4" />
      {/* Left grandstand */}
      <polygon points="0,95 0,12 46,6 46,95" fill={c} />
      {/* Left upper deck cantilever overhang */}
      <polygon points="0,12 52,12 52,28 46,28 46,6 0,12" fill={c} opacity="0.65" />
      {/* Right grandstand */}
      <polygon points="200,95 200,12 154,6 154,95" fill={c} />
      {/* Right upper deck cantilever */}
      <polygon points="200,12 148,12 148,28 154,28 154,6 200,12" fill={c} opacity="0.65" />
      {/* Press box elevated above center */}
      <rect x="76" y="0" width="48" height="15" rx="3" fill={c} opacity="0.85" />
      {/* "W" hint on press box */}
      <text x="100" y="12" textAnchor="middle" fill="rgba(183,165,122,0.7)" fontSize="10" fontWeight="900">W</text>
      {/* Roof edge highlight */}
      <polyline points="0,12 46,6 154,6 200,12"
        stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

// Lumen Field — dramatic overhanging roof canopy
function LumenSilhouette({ c }) {
  return (
    <svg viewBox="0 0 200 95" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* Main walls */}
      <rect x="18" y="42" width="164" height="53" fill={c} />
      {/* Vertical structural columns on walls */}
      {[38, 68, 100, 132, 162].map(x => (
        <line key={x} x1={x} y1="42" x2={x} y2="95" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      ))}
      {/* Dramatic overhanging roof — extends beyond the walls */}
      <polygon points="0,42 200,42 194,22 178,10 22,10 6,22" fill={c} opacity="0.92" />
      {/* Roof support angled struts */}
      <line x1="22" y1="10" x2="18" y2="42" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <line x1="178" y1="10" x2="182" y2="42" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      {/* Roof edge highlight */}
      <polyline points="0,42 6,22 22,10 178,10 194,22 200,42"
        stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
      {/* Gate entrance at base */}
      <rect x="88" y="78" width="24" height="17" rx="2" fill="rgba(0,0,0,0.35)" />
    </svg>
  )
}

// Climate Pledge Arena — the famous preserved 1962 World's Fair peaked roof
function ClimateSilhouette({ c }) {
  return (
    <svg viewBox="0 0 200 95" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* Arena base walls */}
      <rect x="8" y="52" width="184" height="43" fill={c} />
      {/* The iconic peaked 1962 roof */}
      <polygon points="100,2 195,52 5,52" fill={c} opacity="0.9" />
      {/* Roof panel segment lines — the roof has distinct sections */}
      <line x1="100" y1="2" x2="5" y2="52" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      <line x1="100" y1="2" x2="195" y2="52" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      <line x1="100" y1="2" x2="50" y2="52" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <line x1="100" y1="2" x2="150" y2="52" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <line x1="100" y1="2" x2="28" y2="52" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="100" y1="2" x2="172" y2="52" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {/* Roof peak accent point */}
      <circle cx="100" cy="2" r="4" fill="rgba(255,255,255,0.5)" />
      {/* Main entry at base */}
      <rect x="84" y="52" width="32" height="14" rx="2" fill={c} opacity="0.6" />
    </svg>
  )
}

const SILHOUETTES = [TmobileSilhouette, HuskySilhouette, LumenSilhouette, ClimateSilhouette]

export function StadiumSilhouette({ id, color = 'currentColor' }) {
  const Component = SILHOUETTES[id]
  return <Component c={color} />
}
