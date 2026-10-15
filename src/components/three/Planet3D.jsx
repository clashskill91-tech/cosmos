import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { TEX } from '../../data/textures'
import SunBody from './SunBody'
const T = '/textures/'
const GLOW = { venus:'#e8c98a', earth:'#5aa8ff', mars:'#d98a5b', uranus:'#9fe3e6', neptune:'#4a76f0', jupiter:'#d8b890', saturn:'#e8d9a8' }
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const glowMat = c => new THREE.ShaderMaterial({ transparent:true, side:THREE.BackSide, blending:THREE.AdditiveBlending, depthWrite:false, uniforms:{ c:{ value:new THREE.Color(c) } },
  vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'varying vec3 n;uniform vec3 c;void main(){float i=pow(.7+dot(n,vec3(0,0,1)),3.);gl_FragColor=vec4(c,1.)*i*.6;}' })

const earthVS = 'varying vec2 vUv;varying vec3 vN;varying vec3 vW;void main(){vUv=uv;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}'
const earthFS = `uniform sampler2D dayMap,nightMap,specMap;uniform vec3 sunDir;varying vec2 vUv;varying vec3 vN;varying vec3 vW;
void main(){vec3 N=normalize(vN);float d=dot(N,sunDir);float day=smoothstep(-.08,.22,d);
vec3 dc=texture2D(dayMap,vUv).rgb,nc=texture2D(nightMap,vUv).rgb;vec3 V=normalize(cameraPosition-vW),H=normalize(sunDir+V);
float sp=pow(max(dot(N,H),0.),60.)*texture2D(specMap,vUv).r*.8;
vec3 col=dc*(max(d,0.)*1.15+.02)+sp*day*vec3(1.,.95,.85)+nc*vec3(1.,.78,.45)*(1.-day)*1.4;
float rim=pow(1.-max(dot(N,V),0.),3.);col+=vec3(.25,.5,1.)*rim*day*.5;gl_FragColor=vec4(col,1.);
#include <colorspace_fragment>
}`

function Ring() {
  const [color, alpha] = useTexture([T + 'saturnringcolor.jpg', T + 'saturnringpattern.gif'])
  const geo = useMemo(() => {
    const g = new THREE.RingGeometry(1.3, 2.4, 160, 1), p = g.attributes.position, uv = g.attributes.uv, v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); uv.setXY(i, (v.length() - 1.3) / 1.1, .5) }
    return g
  }, [])
  useEffect(() => () => geo.dispose(), [geo])
  return <mesh geometry={geo} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial map={color} alphaMap={alpha} side={THREE.DoubleSide} transparent roughness={1}/></mesh>
}
// Real day/night terminator: city lights on the dark side, ocean sun-glint, atmospheric rim.
function Earth({ sunAtOrigin }) {
  const [day, night, spec, cloud] = useTexture([T + TEX.earth, T + 'earth_lights_2048.png', T + 'earth_specular_2048.jpg', T + 'earth_clouds_1024.png'])
  day.colorSpace = THREE.SRGBColorSpace; night.colorSpace = THREE.SRGBColorSpace; [day, night, spec].forEach(t => { t.anisotropy = 8 })
  const mat = useMemo(() => new THREE.ShaderMaterial({ vertexShader: earthVS, fragmentShader: earthFS, uniforms: { dayMap: { value: day }, nightMap: { value: night }, specMap: { value: spec }, sunDir: { value: new THREE.Vector3(5, 2, 4).normalize() } } }), [day, night, spec])
  const holder = useRef(), clouds = useRef(), tmp = useMemo(() => new THREE.Vector3(), [])
  useEffect(() => () => mat.dispose(), [mat])
  useFrame((_, d) => {
    if (clouds.current && !reduce) clouds.current.rotation.y += d * .02
    if (sunAtOrigin && holder.current) { holder.current.getWorldPosition(tmp); mat.uniforms.sunDir.value.copy(tmp).negate().normalize() }
  })
  return <group ref={holder}><mesh material={mat}><sphereGeometry args={[1, 128, 128]}/></mesh>
    <mesh ref={clouds} scale={1.01}><sphereGeometry args={[1, 96, 96]}/><meshStandardMaterial map={cloud} transparent opacity={.85} depthWrite={false} roughness={1}/></mesh></group>
}
function Surface({ id }) {
  const map = useTexture(T + TEX[id])
  const rocky = ['mercury', 'moon', 'mars'].includes(id)
  return <mesh><sphereGeometry args={[1, 128, 128]}/><meshStandardMaterial map={map} roughness={.95} bumpMap={rocky ? map : null} bumpScale={rocky ? .6 : 0}/></mesh>
}
function MoonOrbit() {
  const map = useTexture(T + TEX.moon), g = useRef()
  useFrame((_, d) => { if (g.current && !reduce) g.current.rotation.y += d * .15 })
  return <group ref={g}><mesh position={[2.9, 0, 0]} scale={.27}><sphereGeometry args={[1, 48, 48]}/><meshStandardMaterial map={map} bumpMap={map} bumpScale={.5} roughness={1}/></mesh></group>
}
export default function Planet3D({ planet, radius, spin = true, moon, sunAtOrigin, onClick, onPointerOver, onPointerOut }) {
  const r = radius ?? planet.size, spinner = useRef()
  const glow = useMemo(() => GLOW[planet.id] && planet.id !== 'earth' ? glowMat(GLOW[planet.id]) : null, [planet.id])
  const earthGlow = useMemo(() => planet.id === 'earth' ? glowMat('#4f9bff') : null, [planet.id])
  useEffect(() => () => { glow?.dispose(); earthGlow?.dispose() }, [glow, earthGlow])
  useFrame((_, d) => { if (spin && !reduce && spinner.current) spinner.current.rotation.y += d * .2 })
  const gm = glow || earthGlow
  if (planet.id === 'sun') return <group scale={r}><SunBody radius={1} onClick={onClick}/></group>
  return (
    <group scale={r} rotation={[0, 0, planet.tilt]} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <group ref={spinner}>{planet.id === 'earth' ? <Earth sunAtOrigin={sunAtOrigin}/> : <Surface id={planet.id}/>}</group>
      {gm && <mesh scale={planet.id === 'earth' ? 1.065 : 1.05}><sphereGeometry args={[1, 48, 48]}/><primitive object={gm} attach="material"/></mesh>}
      {planet.rings && <Ring/>}
      {moon && <MoonOrbit/>}
    </group>
  )
}
