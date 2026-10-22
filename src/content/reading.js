// 3rd-grade level: tier 1 keeps the original set (still solid, simple
// past-tense cloze sentences) as the review tier; tiers 2-3 are new, with
// progressively richer vocabulary and sentence complexity, keyed off
// touchdown count the same way math.js/spelling.js scale difficulty.

// Tier 1: review (TD 1)
const tier1 = [
  { sentence: 'She ______ to the library after school.', answer: 'walked', choices: ['walked', 'talked', 'water'] },
  { sentence: 'The dog was ______ because it was raining.', answer: 'inside', choices: ['inside', 'insect', 'into'] },
  { sentence: 'He ______ his homework before dinner.', answer: 'finished', choices: ['finished', 'fished', 'pushed'] },
  { sentence: 'The children ______ on the playground.', answer: 'played', choices: ['played', 'placed', 'plane'] },
  { sentence: 'She ______ a book about animals.', answer: 'read', choices: ['read', 'red', 'rid'] },
  { sentence: 'The cat ______ on the warm blanket.', answer: 'slept', choices: ['slept', 'swept', 'kept'] },
  { sentence: 'He ______ his lunch in his backpack.', answer: 'packed', choices: ['packed', 'picked', 'poked'] },
  { sentence: 'The birds ______ south for the winter.', answer: 'flew', choices: ['flew', 'flow', 'flue'] },
  { sentence: 'She ______ her teeth before bed.', answer: 'brushed', choices: ['brushed', 'rushed', 'hushed'] },
  { sentence: 'They ______ a new game at recess.', answer: 'learned', choices: ['learned', 'leaned', 'earned'] },
  { sentence: 'The sun ______ brightly in the sky.', answer: 'shone', choices: ['shone', 'shown', 'stone'] },
  { sentence: 'He ______ his friend a letter.', answer: 'wrote', choices: ['wrote', 'woke', 'rode'] },
  { sentence: 'The teacher ______ a story to the class.', answer: 'told', choices: ['told', 'toll', 'cold'] },
  { sentence: 'She ______ her coat on the hook.', answer: 'hung', choices: ['hung', 'rang', 'sang'] },
  { sentence: 'The baby ______ when it was hungry.', answer: 'cried', choices: ['cried', 'tried', 'dried'] },
  { sentence: 'He ______ the ball over the fence.', answer: 'kicked', choices: ['kicked', 'licked', 'picked'] },
  { sentence: 'They ______ the flowers in the garden.', answer: 'watered', choices: ['watered', 'waited', 'wanted'] },
  { sentence: 'She ______ a picture of her family.', answer: 'drew', choices: ['drew', 'grew', 'knew'] },
  { sentence: 'The leaves ______ off the tree.', answer: 'fell', choices: ['fell', 'felt', 'bell'] },
  { sentence: 'He ______ the door for his grandmother.', answer: 'opened', choices: ['opened', 'hoped', 'opined'] },
  { sentence: 'The class ______ on a field trip.', answer: 'went', choices: ['went', 'bent', 'lent'] },
  { sentence: 'She ______ the answer on the board.', answer: 'wrote', choices: ['wrote', 'woke', 'vote'] },
  { sentence: 'He ______ his bike to school.', answer: 'rode', choices: ['rode', 'road', 'code'] },
  { sentence: 'The puppy ______ its tail when happy.', answer: 'wagged', choices: ['wagged', 'tagged', 'bagged'] },
  { sentence: 'They ______ sandwiches for the picnic.', answer: 'made', choices: ['made', 'wade', 'fade'] },
  { sentence: 'She ______ a thank-you card for her gift.', answer: 'wrote', choices: ['wrote', 'note', 'vote'] },
  { sentence: 'He ______ the heavy box up the stairs.', answer: 'carried', choices: ['carried', 'worried', 'married'] },
  { sentence: 'The fish ______ around in the bowl.', answer: 'swam', choices: ['swam', 'slammed', 'clam'] },
  { sentence: 'She ______ the answer right away.', answer: 'knew', choices: ['knew', 'new', 'dew'] },
  { sentence: 'They ______ to the park on Saturday.', answer: 'walked', choices: ['walked', 'talked', 'chalked'] },
  { sentence: 'He ______ his best friend on the phone.', answer: 'called', choices: ['called', 'crawled', 'stalled'] },
  { sentence: 'The butterfly ______ from flower to flower.', answer: 'flew', choices: ['flew', 'blew', 'grew'] },
  { sentence: 'She ______ the whole pizza by herself.', answer: 'ate', choices: ['ate', 'late', 'hate'] },
  { sentence: 'He ______ a funny joke at lunch.', answer: 'told', choices: ['told', 'bold', 'fold'] },
  { sentence: 'The rain ______ all morning long.', answer: 'fell', choices: ['fell', 'tell', 'yell'] },
  { sentence: 'She ______ her room before dinner.', answer: 'cleaned', choices: ['cleaned', 'leaned', 'gleaned'] },
  { sentence: 'They ______ their hands before eating.', answer: 'washed', choices: ['washed', 'wished', 'watched'] },
  { sentence: 'He ______ the answer in his notebook.', answer: 'wrote', choices: ['wrote', 'note', 'quote'] },
  { sentence: 'The snow ______ all night.', answer: 'fell', choices: ['fell', 'tell', 'bell'] },
  { sentence: 'She ______ first place in the spelling bee.', answer: 'won', choices: ['won', 'run', 'fun'] },
]

// Tier 2: richer vocabulary (TD 2)
const tier2 = [
  { sentence: 'The scientist ______ the mixture carefully before the experiment.', answer: 'examined', choices: ['examined', 'exclaimed', 'exchanged'] },
  { sentence: 'Our class ______ a fascinating documentary about the ocean.', answer: 'watched', choices: ['watched', 'wanted', 'waited'] },
  { sentence: 'The explorer ______ the ancient map to find the treasure.', answer: 'studied', choices: ['studied', 'started', 'stayed'] },
  { sentence: 'She ______ her project with colorful pictures and diagrams.', answer: 'decorated', choices: ['decorated', 'donated', 'dedicated'] },
  { sentence: 'The firefighters ______ quickly to reach the burning building.', answer: 'hurried', choices: ['hurried', 'worried', 'married'] },
  { sentence: 'He ______ the difficult puzzle after several attempts.', answer: 'solved', choices: ['solved', 'saved', 'served'] },
  { sentence: 'The librarian ______ us to the section about dinosaurs.', answer: 'directed', choices: ['directed', 'detected', 'defended'] },
  { sentence: 'My grandmother ______ delicious cookies every Sunday afternoon.', answer: 'bakes', choices: ['bakes', 'breaks', 'brakes'] },
  { sentence: 'The astronaut ______ about her journey to the space station.', answer: 'described', choices: ['described', 'decided', 'disturbed'] },
  { sentence: 'They ______ the trail carefully to avoid getting lost.', answer: 'followed', choices: ['followed', 'founded', 'folded'] },
  { sentence: 'The teacher ______ the students for their excellent behavior.', answer: 'praised', choices: ['praised', 'pleased', 'paused'] },
  { sentence: 'He ______ his mistake and apologized right away.', answer: 'admitted', choices: ['admitted', 'avoided', 'applied'] },
  { sentence: 'The magician ______ the audience with an amazing trick.', answer: 'amazed', choices: ['amazed', 'amused', 'aimed'] },
  { sentence: 'She ______ every question during the spelling contest.', answer: 'answered', choices: ['answered', 'ordered', 'offered'] },
  { sentence: 'The mountain climbers ______ toward the summit despite the storm.', answer: 'continued', choices: ['continued', 'contained', 'connected'] },
  { sentence: 'My brother ______ his room before our guests arrived.', answer: 'organized', choices: ['organized', 'oriented', 'originated'] },
  { sentence: 'The puppy ______ excitedly when it saw its owner.', answer: 'barked', choices: ['barked', 'blinked', 'backed'] },
  { sentence: 'We ______ the museum exhibit about ancient Egypt.', answer: 'explored', choices: ['explored', 'exploded', 'exposed'] },
  { sentence: 'The chef ______ a wonderful meal for the celebration.', answer: 'prepared', choices: ['prepared', 'protected', 'presented'] },
  { sentence: 'She ______ the violin beautifully during the concert.', answer: 'played', choices: ['played', 'prayed', 'planned'] },
  { sentence: 'The students ______ their hands to answer the question.', answer: 'raised', choices: ['raised', 'raced', 'rained'] },
  { sentence: 'He ______ the heavy boxes into the moving truck.', answer: 'loaded', choices: ['loaded', 'located', 'learned'] },
  { sentence: 'The gardener ______ fresh vegetables from the backyard garden.', answer: 'harvested', choices: ['harvested', 'hesitated', 'hovered'] },
  { sentence: 'My friend ______ me a wonderful birthday surprise.', answer: 'planned', choices: ['planned', 'praised', 'placed'] },
  { sentence: 'The dolphins ______ gracefully through the sparkling water.', answer: 'glided', choices: ['glided', 'glanced', 'glowed'] },
]

// Tier 3: most advanced vocabulary/sentence complexity (TD 3, the capstone)
const tier3 = [
  { sentence: 'The scientists ______ a groundbreaking discovery about distant galaxies.', answer: 'announced', choices: ['announced', 'arranged', 'absorbed'] },
  { sentence: 'Despite the heavy rain, the team ______ to finish the race.', answer: 'managed', choices: ['managed', 'mattered', 'measured'] },
  { sentence: 'The ancient castle ______ mysterious secrets for centuries.', answer: 'concealed', choices: ['concealed', 'canceled', 'collected'] },
  { sentence: 'Her courage during the emergency ______ everyone in town.', answer: 'inspired', choices: ['inspired', 'informed', 'insisted'] },
  { sentence: 'The committee ______ a new plan to protect the wetlands.', answer: 'proposed', choices: ['proposed', 'prevented', 'promoted'] },
  { sentence: 'The archaeologists ______ pottery fragments beneath the desert sand.', answer: 'discovered', choices: ['discovered', 'disappeared', 'described'] },
  { sentence: 'The stubborn mule ______ to cross the rickety bridge.', answer: 'refused', choices: ['refused', 'reduced', 'required'] },
  { sentence: 'Their friendship ______ stronger after they worked together on the project.', answer: 'grew', choices: ['grew', 'grabbed', 'greeted'] },
  { sentence: 'The engineers ______ a clever solution to the flooding problem.', answer: 'designed', choices: ['designed', 'desired', 'detected'] },
  { sentence: 'The crowd ______ with excitement as the rocket launched.', answer: 'erupted', choices: ['erupted', 'escaped', 'erased'] },
  { sentence: 'She ______ the fragile vase carefully across the room.', answer: 'carried', choices: ['carried', 'collided', 'calculated'] },
  { sentence: 'The wise old owl ______ silently before answering the riddle.', answer: 'paused', choices: ['paused', 'passed', 'praised'] },
  { sentence: 'Years of practice finally ______ into a championship victory.', answer: 'transformed', choices: ['transformed', 'translated', 'transported'] },
  { sentence: 'The stranded sailors ______ a signal fire on the tiny island.', answer: 'constructed', choices: ['constructed', 'corrected', 'collected'] },
  { sentence: "Her kindness ______ a lasting impression on everyone she met.", answer: 'left', choices: ['left', 'lifted', 'lasted'] },
  { sentence: 'The negotiators ______ an agreement after hours of discussion.', answer: 'reached', choices: ['reached', 'reduced', 'repaired'] },
  { sentence: "The volcano's eruption ______ the nearby villages in ash.", answer: 'covered', choices: ['covered', 'collected', 'corrected'] },
  { sentence: 'His fascinating story ______ the entire classroom in silence.', answer: 'captivated', choices: ['captivated', 'calculated', 'celebrated'] },
  { sentence: 'The determined athlete ______ every obstacle in her path.', answer: 'overcame', choices: ['overcame', 'overlooked', 'overheard'] },
  { sentence: 'The ancient manuscript ______ knowledge lost for a thousand years.', answer: 'preserved', choices: ['preserved', 'prevented', 'presented'] },
  { sentence: 'A sudden gust of wind ______ the papers across the yard.', answer: 'scattered', choices: ['scattered', 'shattered', 'startled'] },
  { sentence: 'The young inventor ______ a device to help people recycle.', answer: 'created', choices: ['created', 'credited', 'corrected'] },
  { sentence: "The exhausted hikers finally ______ the mountain's rocky peak.", answer: 'reached', choices: ['reached', 'reacted', 'released'] },
  { sentence: "The judge's decision ______ everyone in the crowded courtroom.", answer: 'surprised', choices: ['surprised', 'supported', 'surrounded'] },
  { sentence: 'The tiny seed eventually ______ into a towering oak tree.', answer: 'grew', choices: ['grew', 'glowed', 'gripped'] },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const TIERS = { 1: tier1, 2: tier2, 3: tier3 }
const pools = { 1: shuffle(tier1), 2: shuffle(tier2), 3: shuffle(tier3) }

// tdCount-scaled, same deck-pop pattern as math.js/spelling.js -- was a
// flat single pool with no difficulty progression before.
export function getQuestion(tdCount = 0) {
  const tier = tdCount < 1 ? 1 : tdCount < 2 ? 2 : 3
  if (pools[tier].length === 0) pools[tier] = shuffle(TIERS[tier])
  const q = pools[tier].pop()
  return { ...q, choices: shuffle(q.choices) }
}
