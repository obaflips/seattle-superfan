// 3rd-grade level: tiers 1-2 are the original sight words (kept, still
// right for a review pace) plus a couple more; tier 3 (previously the
// thinnest at 10 words) is grown and leveled up; tier 4 is new -- genuine
// 3rd-grade-stretch spelling words as the capstone for the final basket.
const tier1 = ['that', 'with', 'they', 'this', 'when', 'from', 'what', 'know', 'have', 'were', 'said', 'your', 'first', 'again']
const tier2 = ['where', 'there', 'their', 'could', 'would', 'about', 'which', 'every', 'other', 'these', 'those', 'right', 'water', 'found']
const tier3 = ['because', 'people', 'friend', 'should', 'through', 'before', 'better', 'around', 'always', 'together', 'thought', 'enough', 'different', 'probably', 'favorite', 'remember']
const tier4 = ['beautiful', 'surprise', 'important', 'especially', 'actually', 'definitely', 'immediately', 'mountain', 'restaurant', 'vegetable', 'calendar', 'chocolate', 'dinosaur', 'television']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const TIERS = { 1: tier1, 2: tier2, 3: tier3, 4: tier4 }
const pools = { 1: shuffle([...tier1]), 2: shuffle([...tier2]), 3: shuffle([...tier3]), 4: shuffle([...tier4]) }

export function getWord(basketCount) {
  let tier
  if (basketCount < 2) tier = 1
  else if (basketCount < 4) tier = 2
  else if (basketCount < 6) tier = 3
  else tier = 4

  if (pools[tier].length === 0) pools[tier] = shuffle(TIERS[tier])
  return pools[tier].pop()
}

export function scramble(word) {
  const letters = word.toUpperCase().split('')
  // Ensure scrambled order differs from original
  let scrambled
  let attempts = 0
  do {
    scrambled = shuffle(letters)
    attempts++
  } while (scrambled.join('') === word.toUpperCase() && attempts < 20)
  return scrambled
}
