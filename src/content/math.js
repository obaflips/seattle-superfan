// 3rd-grade level: tiers 1-2 review 2-3 digit addition/subtraction with
// regrouping, tiers 3-4 introduce multiplication/division facts (the core
// new 3rd-grade skill) -- capped off with division on the final home run.

// Tier 1: 2-digit addition/subtraction within 100 (HR 1 -- warm-up review)
const tier1 = [
  { problem: '45 + 23', answer: 68, choices: [68, 58, 78] },
  { problem: '67 - 24', answer: 43, choices: [43, 53, 33] },
  { problem: '38 + 41', answer: 79, choices: [79, 69, 89] },
  { problem: '92 - 37', answer: 55, choices: [55, 65, 45] },
  { problem: '26 + 58', answer: 84, choices: [84, 74, 94] },
  { problem: '71 - 19', answer: 52, choices: [52, 62, 42] },
  { problem: '33 + 49', answer: 82, choices: [82, 72, 92] },
  { problem: '85 - 28', answer: 57, choices: [57, 67, 47] },
  { problem: '19 + 64', answer: 83, choices: [83, 73, 93] },
  { problem: '90 - 45', answer: 45, choices: [45, 55, 35] },
  { problem: '27 + 36', answer: 63, choices: [63, 53, 73] },
  { problem: '58 - 19', answer: 39, choices: [39, 49, 29] },
  { problem: '44 + 39', answer: 83, choices: [83, 73, 93] },
  { problem: '76 - 38', answer: 38, choices: [38, 48, 28] },
  { problem: '52 + 29', answer: 81, choices: [81, 71, 91] },
  { problem: '63 - 27', answer: 36, choices: [36, 46, 26] },
]

// Tier 2: 3-digit addition/subtraction with regrouping (HR 2)
const tier2 = [
  { problem: '356 + 247', answer: 603, choices: [603, 593, 613] },
  { problem: '482 - 195', answer: 287, choices: [287, 297, 277] },
  { problem: '619 + 274', answer: 893, choices: [893, 883, 903] },
  { problem: '734 - 358', answer: 376, choices: [376, 386, 366] },
  { problem: '458 + 366', answer: 824, choices: [824, 814, 834] },
  { problem: '803 - 456', answer: 347, choices: [347, 357, 337] },
  { problem: '275 + 548', answer: 823, choices: [823, 813, 833] },
  { problem: '921 - 384', answer: 537, choices: [537, 547, 527] },
  { problem: '396 + 227', answer: 623, choices: [623, 613, 633] },
  { problem: '645 - 278', answer: 367, choices: [367, 377, 357] },
  { problem: '512 + 289', answer: 801, choices: [801, 791, 811] },
  { problem: '750 - 463', answer: 287, choices: [287, 297, 277] },
  { problem: '168 + 457', answer: 625, choices: [625, 615, 635] },
  { problem: '900 - 342', answer: 558, choices: [558, 568, 548] },
  { problem: '349 + 276', answer: 625, choices: [625, 615, 635] },
  { problem: '811 - 529', answer: 282, choices: [282, 292, 272] },
]

// Tier 3: multiplication facts (HR 3-4)
const tier3 = [
  { problem: '6 × 7', answer: 42, choices: [42, 36, 48] },
  { problem: '8 × 4', answer: 32, choices: [32, 28, 36] },
  { problem: '9 × 3', answer: 27, choices: [27, 24, 30] },
  { problem: '7 × 5', answer: 35, choices: [35, 30, 40] },
  { problem: '6 × 6', answer: 36, choices: [36, 30, 42] },
  { problem: '8 × 7', answer: 56, choices: [56, 48, 63] },
  { problem: '9 × 4', answer: 36, choices: [36, 32, 40] },
  { problem: '7 × 7', answer: 49, choices: [49, 42, 56] },
  { problem: '8 × 9', answer: 72, choices: [72, 64, 81] },
  { problem: '6 × 9', answer: 54, choices: [54, 48, 63] },
  { problem: '9 × 6', answer: 54, choices: [54, 48, 63] },
  { problem: '7 × 8', answer: 56, choices: [56, 49, 64] },
  { problem: '5 × 9', answer: 45, choices: [45, 40, 50] },
  { problem: '8 × 6', answer: 48, choices: [48, 42, 54] },
  { problem: '9 × 9', answer: 81, choices: [81, 72, 90] },
  { problem: '7 × 6', answer: 42, choices: [42, 36, 48] },
  { problem: '8 × 8', answer: 64, choices: [64, 56, 72] },
  { problem: '9 × 7', answer: 63, choices: [63, 54, 72] },
]

// Tier 4: division facts (HR 5 -- the capstone, hardest/newest skill last)
const tier4 = [
  { problem: '42 ÷ 6', answer: 7, choices: [7, 6, 8] },
  { problem: '56 ÷ 8', answer: 7, choices: [7, 8, 6] },
  { problem: '63 ÷ 9', answer: 7, choices: [7, 9, 8] },
  { problem: '45 ÷ 5', answer: 9, choices: [9, 8, 10] },
  { problem: '36 ÷ 6', answer: 6, choices: [6, 5, 7] },
  { problem: '72 ÷ 8', answer: 9, choices: [9, 8, 10] },
  { problem: '54 ÷ 9', answer: 6, choices: [6, 5, 7] },
  { problem: '48 ÷ 6', answer: 8, choices: [8, 7, 9] },
  { problem: '64 ÷ 8', answer: 8, choices: [8, 7, 9] },
  { problem: '35 ÷ 7', answer: 5, choices: [5, 6, 4] },
  { problem: '81 ÷ 9', answer: 9, choices: [9, 8, 10] },
  { problem: '49 ÷ 7', answer: 7, choices: [7, 6, 8] },
  { problem: '40 ÷ 5', answer: 8, choices: [8, 7, 9] },
  { problem: '27 ÷ 3', answer: 9, choices: [9, 8, 10] },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const TIERS = { 1: tier1, 2: tier2, 3: tier3, 4: tier4 }
const pools = { 1: shuffle(tier1), 2: shuffle(tier2), 3: shuffle(tier3), 4: shuffle(tier4) }

// Same deck-pop pattern as content/spelling.js -- no repeat until a tier's
// pool is fully exhausted, unlike the old version, which reshuffled and
// took [0] every call with no memory of what was just asked.
export function getQuestion(hrCount) {
  let tier
  if (hrCount < 1) tier = 1
  else if (hrCount < 2) tier = 2
  else if (hrCount < 4) tier = 3
  else tier = 4

  if (pools[tier].length === 0) pools[tier] = shuffle(TIERS[tier])
  const q = pools[tier].pop()
  return { ...q, choices: shuffle(q.choices) }
}
