import { useRef, useEffect, useLayoutEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, Trail, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// lives in public/ (not src/assets) because the glTF references its texture via a
// relative "Textures/colormap.png" URI -- public/ preserves that folder layout,
// while a bundled ?url import would flatten it and 404 the texture
const batterUrl = `${import.meta.env.BASE_URL}models/batter/model.glb`

useGLTF.preload(batterUrl)

const NAVY = '#0C2C56'
const TEAL = '#005C5C'
const SILVER = '#C4CED4'
const GRASS = '#2d6a3a'
const DIRT = '#8B6914'
const MOUND_DIRT = '#6a4f0a'
const WOOD = '#C98A3A'
const FIREWORK_COLORS = ['#FFD700', '#FF5555', '#55FFAA', '#55AAFF']

const TOWER_L = [-13, 7.5, -16]
const TOWER_R = [13, 7.5, -16]

function Stands() {
  return (
    <group position={[0, 0, -16]}>
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[30, 6, 2]} />
        <meshStandardMaterial color={NAVY} />
      </mesh>
      <mesh position={[0, 6.2, 0]}>
        <boxGeometry args={[32, 1, 3]} />
        <meshStandardMaterial color={TEAL} />
      </mesh>
      <mesh position={[-13, 7.5, 0]}>
        <boxGeometry args={[0.6, 4, 0.6]} />
        <meshStandardMaterial color={SILVER} />
      </mesh>
      <mesh position={[13, 7.5, 0]}>
        <boxGeometry args={[0.6, 4, 0.6]} />
        <meshStandardMaterial color={SILVER} />
      </mesh>
    </group>
  )
}

function StadiumLights({ lightLRef, lightRRef }) {
  return (
    <>
      <pointLight ref={lightLRef} position={TOWER_L} intensity={0.6} distance={30} color="#dfe8ff" />
      <pointLight ref={lightRRef} position={TOWER_R} intensity={0.6} distance={30} color="#dfe8ff" />
    </>
  )
}

// Kenney "Mini Characters" model (CC0, see DESIGN.md) -- a real low-poly figure
// instead of a hand-coded primitive. Its rig exposes a named 'arm-right' node we
// grab a direct reference to so ActionRig can swing just the arm, not the whole body.
function Batter({ armRef }) {
  const { scene, nodes } = useGLTF(batterUrl)
  useLayoutEffect(() => {
    if (nodes['arm-right']) armRef.current = nodes['arm-right']
  }, [nodes, armRef])
  return (
    <group position={[1.7, 0, 4.3]} rotation={[0, -2.5, 0]} scale={2.3}>
      <primitive object={scene} />
    </group>
  )
}

// A simple held bat prop. It has no static transform of its own -- ActionRig copies
// the batting arm's world transform onto it every frame, since the model isn't
// skeleton-rigged for us to parent a child mesh directly onto the hand.
function BatProp({ batRef }) {
  return (
    <group ref={batRef}>
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.17, 0.07, 2.6, 10]} />
        <meshStandardMaterial color={WOOD} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.15, 0.45, 10]} />
        <meshStandardMaterial color="#4a3015" />
      </mesh>
    </group>
  )
}

function Field() {
  return (
    <group>
      <color attach="background" args={['#071220']} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -6]}>
        <circleGeometry args={[16, 48]} />
        <meshStandardMaterial color={GRASS} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 2]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color={DIRT} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[1, 1.3, 0.3, 24]} />
        <meshStandardMaterial color={MOUND_DIRT} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 6]}>
        <circleGeometry args={[0.5, 5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <Stands />
    </group>
  )
}

const BASE_CAM = new THREE.Vector3(0, 3.2, 9.5)
const MOUND_LOOK = new THREE.Vector3(0, 1.2, -2)
const BAT_READY = -0.6
const SWING_DURATION = 0.38
const IMPACT_WINDOW = 0.14 // how long the bat takes to reach the ball once a swing starts
const HAND_OFFSET = new THREE.Vector3(0, -0.35, 0.1) // bat grip point relative to the arm node

const tmpVec = new THREE.Vector3()
const tmpQuat = new THREE.Quaternion()

function ActionRig({ result, pitchKey, armRef, batRef, lightLRef, lightRRef }) {
  const ballRef = useRef()
  const { camera } = useThree()
  const anim = useRef({ phase: 'idle', start: 0, duration: 1.5 })
  const swing = useRef({ start: -1000, active: false })
  const punch = useRef({ triggered: true, until: -1 })

  // a brand-new pitch always returns the ball to the mound and the camera home
  useEffect(() => {
    if (!result) anim.current = { phase: 'idle', start: 0, duration: 1.5 }
  }, [pitchKey, result])

  useEffect(() => {
    const now = performance.now()
    swing.current = { start: now, active: true }
    if (result === 'hr' || result === 'win') {
      anim.current = { phase: 'hr', start: now, duration: result === 'win' ? 1.85 : 1.5 }
      punch.current = { triggered: false, until: -1 }
    } else if (result === 'strike' || result === 'strikeout' || result === 'sideRetired') {
      anim.current = { phase: 'strike', start: now, duration: 0, intense: result === 'sideRetired' }
    }
  }, [result])

  useFrame((state) => {
    if (!ballRef.current) return
    const t = state.clock.elapsedTime
    const a = anim.current
    const nowMs = performance.now()

    // bat swing animates on its own clock, independent of the ball/camera phase below.
    // It's the arm node from the loaded model that actually rotates; the bat prop just
    // follows the arm's resulting world transform each frame.
    if (armRef.current && batRef.current) {
      const sw = swing.current
      if (sw.active) {
        const p = Math.min((nowMs - sw.start) / 1000 / SWING_DURATION, 1)
        armRef.current.rotation.x = BAT_READY + Math.sin(p * Math.PI) * 2.3
        if (p >= 1) sw.active = false
      } else {
        armRef.current.rotation.x = BAT_READY
      }
      armRef.current.updateWorldMatrix(true, false)
      armRef.current.getWorldPosition(tmpVec)
      armRef.current.getWorldQuaternion(tmpQuat)
      batRef.current.position.copy(tmpVec)
      batRef.current.quaternion.copy(tmpQuat)
      batRef.current.translateX(HAND_OFFSET.x)
      batRef.current.translateY(HAND_OFFSET.y)
      batRef.current.translateZ(HAND_OFFSET.z)
    }

    // stadium lights glow steady, pulse bright on a home run, dip on a side-retired gut-punch
    if (lightLRef.current && lightRRef.current) {
      let base = 0.6
      if (a.phase === 'hr') base = 1.5 + Math.sin(t * 14) * 0.5
      else if (a.phase === 'strike' && a.intense) base = 0.25
      lightLRef.current.intensity = base
      lightRRef.current.intensity = base
    }

    if (a.phase === 'hr') {
      const elapsed = (nowMs - a.start) / 1000
      if (elapsed < IMPACT_WINDOW) {
        // anticipation beat: ball waits right up until the bat arrives
        ballRef.current.position.set(0, 1, 0)
        ballRef.current.scale.set(1, 1, 1)
      } else {
        if (!punch.current.triggered) {
          punch.current.triggered = true
          punch.current.until = nowMs + 140 // sharp one-shot camera punch at contact
        }
        const flightDur = a.duration - IMPACT_WINDOW
        const fp = Math.min((elapsed - IMPACT_WINDOW) / flightDur, 1)
        ballRef.current.position.set(Math.sin(fp * 2) * 1.3, 1 + Math.sin(fp * Math.PI) * 7.5, -fp * 16)
        // squash at contact, stretch through the middle of the arc
        const stretch = 1 + Math.sin(Math.min(fp * 5, 1) * Math.PI) * 0.6
        ballRef.current.scale.set(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch))
      }

      if (nowMs < punch.current.until) {
        camera.position.set(
          BASE_CAM.x + (Math.random() - 0.5) * 0.3,
          BASE_CAM.y + (Math.random() - 0.5) * 0.2 - 0.1,
          BASE_CAM.z - 0.4
        )
      } else {
        camera.position.lerp(new THREE.Vector3(BASE_CAM.x + 0.6, BASE_CAM.y - 0.3, BASE_CAM.z - 2.2), 0.05)
      }
      camera.lookAt(ballRef.current.position)
      if (elapsed >= a.duration) a.phase = 'done'
      return
    }

    if (a.phase === 'done') return // hold the landed ball/camera until the next pitch resets us

    if (a.phase === 'strike') {
      const elapsed = (nowMs - a.start) / 1000
      const shakeDur = a.intense ? 0.5 : 0.3
      const amp = a.intense ? 0.45 : 0.2
      if (elapsed < shakeDur) {
        camera.position.set(
          BASE_CAM.x + (Math.random() - 0.5) * amp,
          BASE_CAM.y + (Math.random() - 0.5) * amp * 0.7,
          BASE_CAM.z
        )
      } else {
        a.phase = 'idle'
      }
      ballRef.current.position.set(0, 1 + Math.sin(t * 3) * 0.08, 0)
      ballRef.current.scale.set(1, 1, 1)
      camera.lookAt(MOUND_LOOK)
      return
    }

    // idle bob
    ballRef.current.position.set(0, 1 + Math.sin(t * 2.2) * 0.08, 0)
    ballRef.current.scale.set(1, 1, 1)
    camera.position.lerp(BASE_CAM, 0.08)
    camera.lookAt(MOUND_LOOK)
  })

  const ball = (
    <mesh ref={ballRef} position={[0, 1, 0]}>
      <sphereGeometry args={[0.35, 16, 16]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  )

  // only show the comet trail while the ball is actually in flight
  if (result === 'hr' || result === 'win') {
    return (
      <Trail width={3} length={5} color="#FFD700" attenuation={(w) => w * w}>
        {ball}
      </Trail>
    )
  }
  return ball
}

export default function BaseballScene({ result, pitchKey }) {
  const celebrating = result === 'hr' || result === 'win'
  const winning = result === 'win'
  const dpr = useMemo(() => [1, 1.5], [])
  const armRef = useRef()
  const batRef = useRef()
  const lightLRef = useRef()
  const lightRRef = useRef()

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: true, powerPreference: 'low-power' }}
      camera={{ position: [BASE_CAM.x, BASE_CAM.y, BASE_CAM.z], fov: 50 }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 10, 5]} intensity={1.1} color="#fff6e0" />
      <StadiumLights lightLRef={lightLRef} lightRRef={lightRRef} />
      <Field />
      <Suspense fallback={null}>
        <Batter armRef={armRef} />
      </Suspense>
      <BatProp batRef={batRef} />
      <ActionRig result={result} pitchKey={pitchKey} armRef={armRef} batRef={batRef} lightLRef={lightLRef} lightRRef={lightRRef} />
      {celebrating && FIREWORK_COLORS.map((color, i) => (
        <Sparkles
          key={color}
          count={winning ? 50 : 28}
          scale={[5 + i, 3.5 + i * 0.6, 5 + i]}
          position={[0, 2.5 + i * 0.4, -9 - i * 0.6]}
          size={4}
          speed={0.5 + i * 0.15}
          color={color}
        />
      ))}
    </Canvas>
  )
}
