import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Starfield from './Starfield'
import { isMobile } from '../../hooks/useWebGL'
// SXEMATIK, badiiy tasvir: zarralar tasodifiy hosil qilinadi, ilmiy simulyatsiya emas.
// twist = spiral qo'llarining markazdan chekkagacha burilishi (radian), tilt = qiyalik.
const SHAPES = {
  'milky-way': { arms: 2, twist: 4.5, bar: 1, bulge: .2, tilt: 1.0 },
  andromeda: { arms: 2, twist: 5.5, bulge: .28, tilt: 1.3, R: 9.5 },
  triangulum: { arms: 2, twist: 3, bulge: .05, tilt: .75, fluffy: 1, R: 8 },
  lmc: { arms: 1, twist: 2, bar: 1, bulge: .05, tilt: .7, irregular: 1, R: 6 },
  whirlpool: { arms: 2, twist: 4, bulge: .12, tilt: .45, companion: 1, R: 8 },
  sombrero: { arms: 0, bulge: .5, bs: 2.2, tilt: 1.5, ring: 1 },
}
const DEF = { arms: 2, twist: 4, bulge: .15, R: 9, tilt: 1, bs: 1, dust: 1 }
const gs = () => (Math.random() + Math.random() + Math.random() + Math.random() - 2) / .577
const soft = () => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.3, 'rgba(255,255,255,.45)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c) }

function build(s, n, tint) {
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), c = new THREE.Color()
  const warm = new THREE.Color(1, .86, .62), cool = new THREE.Color(.55, .72, 1), pink = new THREE.Color(1, .45, .65), tn = new THREE.Color(tint), arms = Math.max(s.arms, 1)
  const armTheta = (k, r) => k * 6.2832 / arms + s.twist * Math.log(1 + r) / Math.log(1 + s.R)
  for (let i = 0; i < n; i++) {
    let x, y, z, t, arm = false, r, th; const u = Math.random()
    if (u < s.bulge) { x = gs() * 1.5 * s.bs; y = gs() * .9 * s.bs; z = gs() * 1.5 * s.bs; t = 0 }
    else if (u < s.bulge + .1) { r = s.R * Math.sqrt(Math.random()); th = Math.random() * 6.2832; x = r * Math.cos(th); z = r * Math.sin(th); y = gs() * .22; t = r / s.R }
    else if (s.ring) { r = s.R * (.55 + .4 * Math.random()); th = Math.random() * 6.2832; x = r * Math.cos(th); z = r * Math.sin(th); y = gs() * .09; t = r / s.R }
    else {
      r = Math.min(-s.R * .3 * Math.log(1 - Math.random() * .97), s.R * 1.05)
      if (s.bar && r < s.R * .28) th = (Math.random() < .5 ? 0 : Math.PI) + gs() * .1
      else { arm = true; th = armTheta(Math.floor(Math.random() * arms), r) + gs() * (s.fluffy ? .55 : .2) }
      r += gs() * .2; x = r * Math.cos(th); z = r * Math.sin(th); y = gs() * (.1 + .015 * r) * (1 - .5 * r / s.R); t = r / s.R
    }
    if (s.irregular) { x += gs() * 1.1; z += gs() * 1.1 }
    if (s.companion && i % 16 === 0) { x = s.R * 1.1 + gs() * .9; z = s.R * .5 + gs() * .9; y = gs() * .5; t = .2 }
    c.copy(warm).lerp(cool, Math.min(1, t * 1.4)).lerp(tn, .15).multiplyScalar((.55 + Math.random() * .6) * (1 - t * .3))
    if (arm && t > .25 && Math.random() < .05) c.copy(pink).multiplyScalar(.9 + Math.random() * .4)
    pos.set([x, y, z], i * 3); col.set([c.r, c.g, c.b], i * 3)
  }
  // Chang yo'laklari: spiral qo'llarining ichki chetida qoraytiruvchi zarralar
  const m = s.dust ? Math.floor(n / 7) : 0, dust = new Float32Array(m * 3)
  for (let i = 0; i < m; i++) {
    let x, y, z
    if (s.ring) { const r = s.R * (.5 + .45 * Math.random()), th = Math.random() * 6.2832; x = r * Math.cos(th); z = r * Math.sin(th); y = gs() * .04 }
    else { const r = s.R * (.15 + .7 * Math.random()), th = armTheta(Math.floor(Math.random() * arms), r) - .22 + gs() * .1; x = r * Math.cos(th); z = r * Math.sin(th); y = gs() * .06 }
    dust.set([x, y, z], i * 3)
  }
  return { pos, col, dust }
}
function Galaxy({ obj, paused, tex }) {
  const s = useMemo(() => ({ ...DEF, ...SHAPES[obj.id] }), [obj.id]), spin = useRef()
  const d = useMemo(() => build(s, isMobile() ? 25000 : 70000, obj.hue), [s, obj.hue])
  useFrame((_, dt) => { if (!paused && spin.current) spin.current.rotation.y += dt * .04 })
  return <group rotation={[s.tilt, 0, .15]}><group ref={spin}>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" array={d.pos} count={d.pos.length / 3} itemSize={3}/><bufferAttribute attach="attributes-color" array={d.col} count={d.col.length / 3} itemSize={3}/></bufferGeometry>
      <pointsMaterial map={tex} size={.13} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false}/></points>
    {d.dust.length > 0 && <points renderOrder={2}><bufferGeometry><bufferAttribute attach="attributes-position" array={d.dust} count={d.dust.length / 3} itemSize={3}/></bufferGeometry>
      <pointsMaterial map={tex} size={.55} color="#0a0503" transparent opacity={.22} depthWrite={false}/></points>}
    <sprite scale={[s.R * .9, s.R * .9, 1]}><spriteMaterial map={tex} color="#ffd9a0" blending={THREE.AdditiveBlending} transparent opacity={.8} depthWrite={false}/></sprite>
    <sprite scale={[s.R * 2.6, s.R * 2.6, 1]}><spriteMaterial map={tex} color={obj.hue} blending={THREE.AdditiveBlending} transparent opacity={.1} depthWrite={false}/></sprite>
  </group></group>
}
// Tumanlik: katta yumshoq gaz bulutlari + yulduzlar + qorong'u chang
function Nebula({ obj, paused, tex }) {
  const ref = useRef()
  const d = useMemo(() => {
    const base = new THREE.Color(obj.hue), alt = base.clone().offsetHSL(.4, 0, -.05), c = new THREE.Color()
    const mk = (n, sx, sy, sz, f) => { const p = new Float32Array(n * 3), k = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const a = gs() * 1.2, x = gs() * sx, z = gs() * sz; p.set([x * Math.cos(a * .2) - z * Math.sin(a * .2), gs() * sy, x * Math.sin(a * .2) + z * Math.cos(a * .2)], i * 3); f(c, Math.random()); k.set([c.r, c.g, c.b], i * 3) } return { p, k } }
    return { gas: mk(320, 3.2, 2.2, 2.2, (c, r) => c.copy(base).lerp(alt, r * .8).multiplyScalar(.7 + r * .5)), mid: mk(1800, 2.6, 1.8, 1.8, (c, r) => c.copy(base).lerp(alt, r).lerp(new THREE.Color(1, 1, 1), .25)), stars: mk(700, 1.3, 1.3, 1.3, (c, r) => c.setRGB(.8 + r * .2, .85 + r * .15, 1)), dark: mk(70, 3, 1.8, 1.8, c => c.setRGB(.02, .01, .01)) }
  }, [obj.id, obj.hue])
  useFrame((_, dt) => { if (!paused && ref.current) ref.current.rotation.y += dt * .03 })
  const P = ({ q, size, op, add = true }) => <points renderOrder={add ? 0 : 2}><bufferGeometry><bufferAttribute attach="attributes-position" array={q.p} count={q.p.length / 3} itemSize={3}/><bufferAttribute attach="attributes-color" array={q.k} count={q.k.length / 3} itemSize={3}/></bufferGeometry>
    <pointsMaterial map={tex} size={size} vertexColors transparent opacity={op} blending={add ? THREE.AdditiveBlending : THREE.NormalBlending} depthWrite={false}/></points>
  return <group ref={ref}><P q={d.gas} size={3.6} op={.14}/><P q={d.mid} size={1.1} op={.2}/><P q={d.stars} size={.14} op={1}/><P q={d.dark} size={3} op={.22} add={false}/></group>
}
export default function GalaxyScene({ obj, paused }) {
  const tex = useMemo(soft, []); useEffect(() => () => tex.dispose(), [tex])
  return <Canvas camera={{ position: [0, 4, 14], fov: 50 }} dpr={[1, 1.5]}><color attach="background" args={['#02030a']}/><Starfield count={isMobile() ? 800 : 2500}/>
    {obj.cat === 'Tumanlik' ? <Nebula obj={obj} paused={paused} tex={tex}/> : <Galaxy obj={obj} paused={paused} tex={tex}/>}
    <OrbitControls enablePan={false} minDistance={4} maxDistance={28}/></Canvas>
}
