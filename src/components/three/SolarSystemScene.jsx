import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import Planet3D from './Planet3D'
import SunBody from './SunBody'
import Starfield from './Starfield'
import { orbiting, byId } from '../../data/planets'
import { isMobile } from '../../hooks/useWebGL'
// Haqiqiy orbital ekssentrisitetlar (NASA). Orbitalar ellips, Quyosh fokusda; tezlik Kepler qonuniga ko'ra o'zgaradi.
const ECC = { mercury: .206, venus: .007, earth: .017, mars: .093, jupiter: .048, saturn: .056, uranus: .046, neptune: .009 }

const pvs = 'attribute float ang;varying float vA;void main(){vA=ang;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'
const pfs = 'uniform float pE;uniform vec3 col;varying float vA;void main(){float t=mod(pE-vA,6.2831853)/6.2831853;gl_FragColor=vec4(col,.05+.5*pow(1.-t,4.));}'
// Orbita: juda yupqa (1 px) chiziq, sayyora ortida xiralashib boradi. Yaqinlashtirganda qalinlashmaydi.
function OrbitPath({ p, phases }) {
  const e = ECC[p.id], a = p.orbitR, b = a * Math.sqrt(1 - e * e)
  const line = useMemo(() => {
    const seg = 256, pos = [], ang = []
    for (let i = 0; i <= seg; i++) { const E = i / seg * 6.2832; pos.push(a * (Math.cos(E) - e), 0, b * Math.sin(E)); ang.push(E) }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('ang', new THREE.Float32BufferAttribute(ang, 1))
    const mat = new THREE.ShaderMaterial({ vertexShader: pvs, fragmentShader: pfs, transparent: true, depthWrite: false, uniforms: { pE: { value: 0 }, col: { value: new THREE.Color('#8fb4ff') } } })
    return new THREE.Line(geo, mat)
  }, [a, e, b])
  useEffect(() => () => { line.geometry.dispose(); line.material.dispose() }, [line])
  useFrame(() => { line.material.uniforms.pE.value = phases.current[p.id] ?? 0 })
  return <primitive object={line}/>
}

function Belt() {
  const n = isMobile() ? 1200 : 3500
  const pos = useMemo(() => { const a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const t = Math.random() * 6.283, r = 22.2 + Math.random() * 3.2; a.set([Math.cos(t) * r, (Math.random() - .5) * .8, Math.sin(t) * r], i * 3) } return a }, [n])
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" array={pos} count={n} itemSize={3}/></bufferGeometry><pointsMaterial size={.09} color="#a89c8c" transparent opacity={.8} depthWrite={false}/></points>
}

function Body({ p, i, speed, paused, labels, onSelect, positions, phases }) {
  const g = useRef(), M = useRef(i * 1.3), [hover, setHover] = useState(false), e = ECC[p.id], a = p.orbitR, b = a * Math.sqrt(1 - e * e)
  useFrame((_, d) => {
    if (!paused) M.current += d * speed * p.speed * 0.15
    let E = M.current; for (let k = 0; k < 4; k++) E = M.current + e * Math.sin(E) // Kepler tenglamasi
    g.current.position.set(a * (Math.cos(E) - e), 0, b * Math.sin(E)); positions.current[p.id] = g.current.position; phases.current[p.id] = ((E % 6.2832) + 6.2832) % 6.2832
  })
  return <group ref={g}>
    <Planet3D planet={p} sunAtOrigin onClick={ev => { ev.stopPropagation(); onSelect(p.id) }} onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer' }} onPointerOut={() => { setHover(false); document.body.style.cursor = '' }}/>
    {(labels || hover) && <Html center distanceFactor={40} zIndexRange={[1, 0]} position={[0, p.size + 1.4, 0]} style={{ pointerEvents: 'none' }}><span className="text-[11px] text-cyan-200 whitespace-nowrap">{p.name}</span></Html>}
  </group>
}

function Rig({ selected, positions, controls, resetKey }) {
  const { camera } = useThree(), home = useMemo(() => new THREE.Vector3(0, 45, 75), []), origin = useMemo(() => new THREE.Vector3(), [])
  const mode = useRef('idle'), last = useRef(new THREE.Vector3()), first = useRef(true)
  useEffect(() => { if (first.current) { first.current = false; return } mode.current = selected ? 'fly' : 'idle' }, [selected])
  useEffect(() => { if (resetKey) mode.current = 'home' }, [resetKey])
  useEffect(() => {
    const c = controls.current; if (!c) return
    const stop = () => { if (mode.current === 'fly') mode.current = 'follow'; else if (mode.current === 'home') mode.current = 'idle' }
    c.addEventListener('start', stop); return () => c.removeEventListener('start', stop)
  }, [selected, controls])
  useFrame(() => {
    const c = controls.current; if (!c) return
    const pos = selected && positions.current[selected], p = byId(selected)
    if (mode.current === 'fly' && pos) {
      const camTo = pos.clone().add(new THREE.Vector3(0, p.size * 1.2 + 2, p.size * 3 + 7))
      c.target.lerp(pos, .07); camera.position.lerp(camTo, .07); last.current.copy(pos)
      if (camera.position.distanceTo(camTo) < .25) mode.current = 'follow'
    } else if (mode.current === 'home') {
      c.target.lerp(origin, .07); camera.position.lerp(home, .07)
      if (camera.position.distanceTo(home) < .3) mode.current = 'idle'
    } else if (mode.current === 'follow' && pos) {
      const d = pos.clone().sub(last.current); camera.position.add(d); c.target.add(d); last.current.copy(pos)
    }
  })
  return null
}

export default function SolarSystemScene({ speed = 1, paused, labels, orbits, selected, onSelect, resetKey }) {
  const positions = useRef({ sun: new THREE.Vector3() }), phases = useRef({}), controls = useRef()
  return (
    <Canvas camera={{ position: [0, 45, 75], fov: 50, far: 2000 }} dpr={[1, 1.75]} onPointerMissed={() => onSelect(null)}>
      <color attach="background" args={['#02030a']}/>
      <ambientLight intensity={.35}/><pointLight position={[0, 0, 0]} intensity={4000} decay={1.6} distance={0}/>
      <Starfield/>
      <SunBody radius={4.5} onClick={e => { e.stopPropagation(); onSelect('sun') }}/><Belt/>
      {orbits && orbiting.map(p => <OrbitPath key={p.id} p={p} phases={phases}/>)}
      {orbiting.map((p, i) => <Body key={p.id} {...{ p, i, speed, paused, labels, onSelect, positions, phases }}/>)}
      <Rig selected={selected} positions={positions} controls={controls} resetKey={resetKey}/>
      <OrbitControls ref={controls} enablePan={false} minDistance={4} maxDistance={160} makeDefault/>
    </Canvas>
  )
}
