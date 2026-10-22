// Expanded from the original 4 categories/32 items to 6 categories/65 items
// for more breadth and fewer repeats across replays. Same flat-pool design
// as before -- Spanish vocab doesn't really have a "harder tier," breadth
// matters more than difficulty progression here.
const CATEGORIES = [
  {
    category: 'animals',
    items: [
      { emoji: '🐱', spanish: 'gato', choices: ['gato', 'perro', 'oso'] },
      { emoji: '🐶', spanish: 'perro', choices: ['gato', 'perro', 'vaca'] },
      { emoji: '🐟', spanish: 'pez', choices: ['pez', 'gato', 'tortuga'] },
      { emoji: '🐇', spanish: 'conejo', choices: ['conejo', 'perro', 'gato'] },
      { emoji: '🐮', spanish: 'vaca', choices: ['vaca', 'caballo', 'oveja'] },
      { emoji: '🐴', spanish: 'caballo', choices: ['caballo', 'vaca', 'perro'] },
      { emoji: '🐐', spanish: 'cabra', choices: ['cabra', 'vaca', 'oveja'] },
      { emoji: '🐑', spanish: 'oveja', choices: ['oveja', 'cabra', 'vaca'] },
      { emoji: '🐻', spanish: 'oso', choices: ['oso', 'perro', 'vaca'] },
      { emoji: '🐢', spanish: 'tortuga', choices: ['tortuga', 'pez', 'conejo'] },
    ],
  },
  {
    category: 'colors',
    items: [
      { emoji: '🔴', spanish: 'rojo', choices: ['rojo', 'azul', 'verde'] },
      { emoji: '🔵', spanish: 'azul', choices: ['rojo', 'azul', 'amarillo'] },
      { emoji: '🟢', spanish: 'verde', choices: ['verde', 'rojo', 'azul'] },
      { emoji: '🟡', spanish: 'amarillo', choices: ['amarillo', 'verde', 'naranja'] },
      { emoji: '🟠', spanish: 'naranja', choices: ['naranja', 'rojo', 'amarillo'] },
      { emoji: '🟣', spanish: 'morado', choices: ['morado', 'azul', 'negro'] },
      { emoji: '⬜', spanish: 'blanco', choices: ['blanco', 'negro', 'gris'] },
      { emoji: '⬛', spanish: 'negro', choices: ['negro', 'blanco', 'gris'] },
      { emoji: '🩷', spanish: 'rosado', choices: ['rosado', 'rojo', 'morado'] },
      { emoji: '🟤', spanish: 'café', choices: ['café', 'negro', 'naranja'] },
    ],
  },
  {
    category: 'numbers',
    items: [
      { emoji: '1️⃣', spanish: 'uno', choices: ['uno', 'dos', 'tres'] },
      { emoji: '2️⃣', spanish: 'dos', choices: ['uno', 'dos', 'tres'] },
      { emoji: '3️⃣', spanish: 'tres', choices: ['dos', 'tres', 'cuatro'] },
      { emoji: '4️⃣', spanish: 'cuatro', choices: ['tres', 'cuatro', 'cinco'] },
      { emoji: '5️⃣', spanish: 'cinco', choices: ['cuatro', 'cinco', 'seis'] },
      { emoji: '6️⃣', spanish: 'seis', choices: ['cinco', 'seis', 'siete'] },
      { emoji: '7️⃣', spanish: 'siete', choices: ['seis', 'siete', 'ocho'] },
      { emoji: '8️⃣', spanish: 'ocho', choices: ['siete', 'ocho', 'nueve'] },
      { emoji: '9️⃣', spanish: 'nueve', choices: ['ocho', 'nueve', 'diez'] },
      { emoji: '🔟', spanish: 'diez', choices: ['nueve', 'diez', 'ocho'] },
    ],
  },
  {
    category: 'objects',
    items: [
      { emoji: '🏠', spanish: 'casa', choices: ['casa', 'mesa', 'libro'] },
      { emoji: '📚', spanish: 'libro', choices: ['libro', 'casa', 'silla'] },
      { emoji: '💺', spanish: 'silla', choices: ['silla', 'mesa', 'libro'] },
      { emoji: '🚪', spanish: 'puerta', choices: ['puerta', 'ventana', 'mesa'] },
      { emoji: '💻', spanish: 'computadora', choices: ['computadora', 'libro', 'mesa'] },
      { emoji: '🍔', spanish: 'hamburguesa', choices: ['hamburguesa', 'pizza', 'taco'] },
      { emoji: '🍎', spanish: 'manzana', choices: ['manzana', 'naranja', 'pera'] },
      { emoji: '🍅', spanish: 'tomate', choices: ['tomate', 'manzana', 'limón'] },
      { emoji: '⏰', spanish: 'reloj', choices: ['reloj', 'silla', 'mesa'] },
      { emoji: '🍽️', spanish: 'mesa', choices: ['mesa', 'silla', 'casa'] },
      { emoji: '🪟', spanish: 'ventana', choices: ['ventana', 'puerta', 'casa'] },
      { emoji: '🛏️', spanish: 'cama', choices: ['cama', 'silla', 'mesa'] },
    ],
  },
  {
    category: 'family',
    items: [
      { emoji: '👩', spanish: 'mamá', choices: ['mamá', 'papá', 'abuela'] },
      { emoji: '👨', spanish: 'papá', choices: ['papá', 'mamá', 'abuelo'] },
      { emoji: '👦', spanish: 'hermano', choices: ['hermano', 'hermana', 'papá'] },
      { emoji: '👧', spanish: 'hermana', choices: ['hermana', 'hermano', 'mamá'] },
      { emoji: '👵', spanish: 'abuela', choices: ['abuela', 'abuelo', 'mamá'] },
      { emoji: '👴', spanish: 'abuelo', choices: ['abuelo', 'abuela', 'papá'] },
      { emoji: '👶', spanish: 'bebé', choices: ['bebé', 'hermano', 'hermana'] },
      { emoji: '👨‍👩‍👧‍👦', spanish: 'familia', choices: ['familia', 'mamá', 'papá'] },
    ],
  },
  {
    category: 'school',
    items: [
      { emoji: '🏫', spanish: 'escuela', choices: ['escuela', 'mochila', 'papel'] },
      { emoji: '📓', spanish: 'cuaderno', choices: ['cuaderno', 'papel', 'lápiz'] },
      { emoji: '✏️', spanish: 'lápiz', choices: ['lápiz', 'crayón', 'regla'] },
      { emoji: '🎒', spanish: 'mochila', choices: ['mochila', 'cuaderno', 'escuela'] },
      { emoji: '👩‍🏫', spanish: 'maestra', choices: ['maestra', 'escuela', 'mochila'] },
      { emoji: '📏', spanish: 'regla', choices: ['regla', 'tijeras', 'lápiz'] },
      { emoji: '✂️', spanish: 'tijeras', choices: ['tijeras', 'regla', 'crayón'] },
      { emoji: '🖍️', spanish: 'crayón', choices: ['crayón', 'lápiz', 'tijeras'] },
      { emoji: '📄', spanish: 'papel', choices: ['papel', 'cuaderno', 'lápiz'] },
    ],
  },
  {
    category: 'weather',
    items: [
      { emoji: '☀️', spanish: 'sol', choices: ['sol', 'lluvia', 'nube'] },
      { emoji: '🌧️', spanish: 'lluvia', choices: ['lluvia', 'nieve', 'sol'] },
      { emoji: '❄️', spanish: 'nieve', choices: ['nieve', 'lluvia', 'viento'] },
      { emoji: '☁️', spanish: 'nube', choices: ['nube', 'sol', 'viento'] },
      { emoji: '💨', spanish: 'viento', choices: ['viento', 'nube', 'lluvia'] },
      { emoji: '🌈', spanish: 'arcoíris', choices: ['arcoíris', 'sol', 'nube'] },
    ],
  },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

let flatPool = []

function buildPool() {
  const all = CATEGORIES.flatMap(c => c.items)
  flatPool = shuffle(all)
}

export function getQuestion() {
  if (flatPool.length === 0) buildPool()
  const q = flatPool.pop()
  return { ...q, choices: shuffle(q.choices) }
}
