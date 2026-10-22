import { useState, useCallback } from 'react'
import NameEntry from './screens/NameEntry'
import SeattleMap from './screens/SeattleMap'
import LevelIntro from './screens/LevelIntro'
import TrophyCollect from './screens/TrophyCollect'
import Championship from './screens/Championship'
import ParentDashboard from './screens/ParentDashboard'
import Baseball from './levels/Baseball'
import Football from './levels/Football'
import Soccer from './levels/Soccer'
import Basketball from './levels/Basketball'

const LEVEL_COMPONENTS = [Baseball, Football, Soccer, Basketball]
const LEVEL_NAMES = ['baseball', 'football', 'soccer', 'basketball']

function getRequestedLevel() {
  const raw = new URLSearchParams(window.location.search).get('level')
  if (raw === null) return null
  const byName = LEVEL_NAMES.indexOf(raw.toLowerCase())
  if (byName !== -1) return byName
  const byId = Number(raw)
  return Number.isInteger(byId) && byId >= 0 && byId < LEVEL_COMPONENTS.length ? byId : null
}

function loadSave() {
  try {
    const raw = localStorage.getItem('superfan_save')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeSave(save) {
  localStorage.setItem('superfan_save', JSON.stringify(save))
}

export default function App() {
  const [requestedLevel] = useState(() => getRequestedLevel())
  const [save, setSave] = useState(() => loadSave())
  // screen: 'name' | 'map' | 'intro' | 'level' | 'trophy' | 'championship' | 'parent'
  const [screen, setScreen] = useState(() => {
    if (!loadSave()) return 'name'
    return requestedLevel !== null ? 'intro' : 'map'
  })
  const [activeLevel, setActiveLevel] = useState(() => requestedLevel)
  const [travelFrom, setTravelFrom] = useState(null)

  const handleNameComplete = useCallback((name) => {
    const newSave = { playerName: name, trophiesEarned: [], currentLevel: 0 }
    setSave(newSave)
    if (requestedLevel !== null) {
      setActiveLevel(requestedLevel)
      setScreen('intro')
    } else {
      setScreen('map')
    }
  }, [requestedLevel])

  const handleSelectLevel = useCallback((levelId) => {
    setActiveLevel(levelId)
    setScreen('intro')
  }, [])

  const handleEnterStadium = useCallback(() => {
    setScreen('level')
  }, [])

  const handleLevelWin = useCallback(() => {
    const levelId = activeLevel
    const newTrophies = [...(save.trophiesEarned || []), levelId]
    const nextLevel = levelId + 1
    const newSave = { ...save, trophiesEarned: newTrophies, currentLevel: nextLevel }
    setSave(newSave)
    writeSave(newSave)
    setScreen('trophy')
  }, [activeLevel, save])

  const handleTrophyContinue = useCallback(() => {
    if (save.trophiesEarned.length >= 4) {
      setScreen('championship')
    } else {
      setTravelFrom(activeLevel)
      setScreen('map')
    }
  }, [save, activeLevel])

  const handleTravelDone = useCallback(() => {
    setTravelFrom(null)
  }, [])

  const handleStartOver = useCallback(() => {
    localStorage.removeItem('superfan_save')
    setSave(null)
    setScreen('name')
    setActiveLevel(null)
    setTravelFrom(null)
  }, [])

  const handleOpenParentDashboard = useCallback(() => {
    setScreen('parent')
  }, [])

  const handleParentDashboardBack = useCallback(() => {
    setScreen('map')
  }, [])

  if (screen === 'name') return <NameEntry onComplete={handleNameComplete} />
  if (screen === 'parent') return <ParentDashboard onBack={handleParentDashboardBack} />
  if (screen === 'championship') return <Championship playerName={save.playerName} onPlayAgain={handleStartOver} />
  if (screen === 'trophy') return <TrophyCollect levelId={activeLevel} playerName={save.playerName} onContinue={handleTrophyContinue} />
  if (screen === 'intro' && activeLevel !== null) return <LevelIntro levelId={activeLevel} playerName={save.playerName} onEnter={handleEnterStadium} />
  if (screen === 'level' && activeLevel !== null) {
    const LevelComponent = LEVEL_COMPONENTS[activeLevel]
    return <LevelComponent playerName={save.playerName} onWin={handleLevelWin} />
  }

  return (
    <SeattleMap
      save={save}
      onSelectLevel={handleSelectLevel}
      onStartOver={handleStartOver}
      onOpenParentDashboard={handleOpenParentDashboard}
      travelFrom={travelFrom}
      onTravelDone={handleTravelDone}
    />
  )
}
