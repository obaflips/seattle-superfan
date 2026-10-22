// Parent-dashboard data. Deliberately a small aggregate, not an unbounded
// log -- per-subject running totals plus a capped recent-activity list, so
// this can't grow localStorage without bound across months of play.
const KEY = 'superfan_progress'
const RECENT_LIMIT = 50

function emptyProgress() {
  return {
    subjects: {}, // { [subject]: { correct: 0, incorrect: 0, missed: { [itemKey]: count } } }
    recent: [],   // [{ subject, itemKey, correct, date }], newest last, capped at RECENT_LIMIT
  }
}

export function getProgress() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    if (!raw || typeof raw !== 'object') return emptyProgress()
    return { subjects: raw.subjects || {}, recent: raw.recent || [] }
  } catch {
    return emptyProgress()
  }
}

// itemKey identifies WHAT was attempted (the question text, word, or
// Spanish term) -- used only to tally what he misses most, not to prevent
// repeats (that's each content module's own job).
export function recordAttempt(subject, correct, itemKey) {
  const progress = getProgress()
  const bucket = progress.subjects[subject] || { correct: 0, incorrect: 0, missed: {} }

  if (correct) {
    bucket.correct += 1
  } else {
    bucket.incorrect += 1
    bucket.missed[itemKey] = (bucket.missed[itemKey] || 0) + 1
  }
  progress.subjects[subject] = bucket

  progress.recent.push({ subject, itemKey, correct, date: new Date().toISOString() })
  if (progress.recent.length > RECENT_LIMIT) {
    progress.recent = progress.recent.slice(-RECENT_LIMIT)
  }

  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch {
    // Storage full/unavailable -- non-fatal, gameplay doesn't depend on this.
  }
}
