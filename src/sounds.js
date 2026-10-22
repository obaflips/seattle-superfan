let ctx = null

export function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function resume() {
  const c = getCtx()
  if (c.state === 'suspended') c.resume()
  return c
}

// --- Shared ---

export function playWrong() {
  const c = resume()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(220, c.currentTime)
  osc.frequency.linearRampToValueAtTime(110, c.currentTime + 0.3)
  gain.gain.setValueAtTime(0.3, c.currentTime)
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.3)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.3)
}

export function playCrowd() {
  const c = resume()
  const bufferSize = c.sampleRate * 1.5
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.15
  const source = c.createBufferSource()
  source.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 1200
  filter.Q.value = 0.5
  const gain = c.createGain()
  gain.gain.setValueAtTime(0, c.currentTime)
  gain.gain.linearRampToValueAtTime(0.6, c.currentTime + 0.2)
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 1.5)
  source.connect(filter)
  filter.connect(gain)
  gain.connect(c.destination)
  source.start(c.currentTime)
}

// --- Baseball ---

export function playSwingWhoosh() {
  const c = resume()
  const osc = c.createOscillator()
  const gain = c.createGain()
  const filter = c.createBiquadFilter()
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(c.destination)
  filter.type = 'bandpass'
  filter.Q.value = 0.8
  filter.frequency.setValueAtTime(500, c.currentTime)
  filter.frequency.linearRampToValueAtTime(2400, c.currentTime + 0.16)
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(90, c.currentTime)
  gain.gain.setValueAtTime(0.18, c.currentTime)
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.18)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.18)
}

export function playBatCrack() {
  const c = resume()
  const bufferSize = Math.floor(c.sampleRate * 0.1)
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1))
  }
  const source = c.createBufferSource()
  source.buffer = buffer
  const gain = c.createGain()
  gain.gain.setValueAtTime(1.0, c.currentTime)
  source.connect(gain)
  gain.connect(c.destination)
  source.start(c.currentTime)
}

export function playFireworks() {
  const c = resume()
  for (let i = 0; i < 6; i++) {
    const t = c.currentTime + i * 0.18
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.frequency.value = 880 + Math.random() * 880
    gain.gain.setValueAtTime(0.2, t)
    gain.gain.linearRampToValueAtTime(0, t + 0.12)
    osc.start(t)
    osc.stop(t + 0.12)
  }
}

export function playSideRetired() {
  const c = resume()
  // low descending horn -- the "that one cost you" beat
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(220, c.currentTime)
  osc.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.7)
  gain.gain.setValueAtTime(0.35, c.currentTime)
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.8)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.8)
  // disappointed crowd murmur underneath
  const bufferSize = Math.floor(c.sampleRate * 1.0)
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.12
  const source = c.createBufferSource()
  source.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 500
  const gain2 = c.createGain()
  gain2.gain.setValueAtTime(0, c.currentTime)
  gain2.gain.linearRampToValueAtTime(0.5, c.currentTime + 0.15)
  gain2.gain.linearRampToValueAtTime(0, c.currentTime + 1.0)
  source.connect(filter)
  filter.connect(gain2)
  gain2.connect(c.destination)
  source.start(c.currentTime)
}

// --- Football ---

export function playGroan() {
  const c = resume()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(300, c.currentTime)
  osc.frequency.linearRampToValueAtTime(180, c.currentTime + 0.6)
  gain.gain.setValueAtTime(0.25, c.currentTime)
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.6)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.6)
}

export function playTouchdown() {
  const c = resume()
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    const t = c.currentTime + i * 0.12
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.3, t)
    gain.gain.linearRampToValueAtTime(0, t + 0.25)
    osc.start(t)
    osc.stop(t + 0.25)
  })
}

// --- Soccer ---

export function playGoal() {
  const c = resume()
  playCrowd()
  // Net thwack
  const bufferSize = Math.floor(c.sampleRate * 0.15)
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2))
  }
  const source = c.createBufferSource()
  source.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 400
  const gain = c.createGain()
  gain.gain.setValueAtTime(0.8, c.currentTime)
  source.connect(filter)
  filter.connect(gain)
  gain.connect(c.destination)
  source.start(c.currentTime)
}

export function playNearMiss() {
  const c = resume()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(400, c.currentTime)
  osc.frequency.linearRampToValueAtTime(250, c.currentTime + 0.8)
  gain.gain.setValueAtTime(0.2, c.currentTime)
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.8)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.8)
}

export function playWhistle() {
  const c = resume()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(2000, c.currentTime)
  osc.frequency.setValueAtTime(2200, c.currentTime + 0.1)
  osc.frequency.setValueAtTime(2000, c.currentTime + 0.2)
  gain.gain.setValueAtTime(0.3, c.currentTime)
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.35)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.35)
}

// --- Basketball ---

export function playSwish() {
  const c = resume()
  // Clean descending tone + light noise burst
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1200, c.currentTime)
  osc.frequency.linearRampToValueAtTime(600, c.currentTime + 0.25)
  gain.gain.setValueAtTime(0.25, c.currentTime)
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.25)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.25)
}

export function playRimClang() {
  const c = resume()
  // Metallic bounce: two oscillators detuned, rapid decay
  [220, 233].forEach(freq => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.type = 'square'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.2, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + 0.5)
  })
}

export function playHorn() {
  const c = resume()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.type = 'sawtooth'
  osc.frequency.value = 440
  gain.gain.setValueAtTime(0.4, c.currentTime)
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.8)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.8)
  playCrowd()
}
