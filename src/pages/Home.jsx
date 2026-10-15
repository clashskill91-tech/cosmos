import { Canvas, useFrame } from '@react-three/fiber'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Planet3D from '../components/three/Planet3D'
import Starfield from '../components/three/Starfield'
import SceneFrame from '../components/layout/SceneFrame'
import { byId } from '../data/planets'
const FEATURES = [['/solar-system', 'Quyosh tizimi', 'Sakkizta sayyorani 3D da aylantiring, tezlikni boshqaring va bosib ma\'lumot oling.'], ['/planets', 'Sayyoralar', 'Har bir sayyora va Oy uchun alohida sahifa, vazn kalkulyatori bilan.'], ['/galaxies', 'Galaktikalar', 'Somon Yo\'li, Andromeda va mashhur tumanliklar.'], ['/learn', 'O\'quv markazi', 'Maqolalar, lug\'at va viktorina.']]
function Rig() { useFrame(({ camera, pointer }) => { camera.position.x += (pointer.x * 1.2 - camera.position.x) * .04; camera.position.y += (pointer.y * .8 - camera.position.y) * .04; camera.lookAt(0, 0, 0) }); return null }
export default function Home() {
  return (<>
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0"><SceneFrame fallback="COSMOS">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.75]}>
          <ambientLight intensity={.15}/><directionalLight position={[5, 2, 4]} intensity={3}/><Starfield/>
          <group position={[3.2, -.6, 0]}><Planet3D planet={byId('earth')} radius={2.4}/></group><Rig/>
        </Canvas></SceneFrame></div>
      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-16 max-w-3xl pointer-events-none">
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="font-display text-6xl md:text-8xl leading-[.95]">Koinotni kashf eting</motion.h1>
        <p className="mt-5 max-w-md text-lg text-slate-300">Sayyoralar, yulduzlar, galaktikalar va yerimizdan tashqaridagi sirlarni kashf eting.</p>
        <div className="mt-8 flex flex-wrap gap-3 pointer-events-auto">
          <Link to="/planets" className="rounded-full bg-ion px-6 py-3 font-medium hover:bg-blue-500">Kashfni boshlash</Link>
          <Link to="/solar-system" className="rounded-full glass px-6 py-3 hover:bg-white/10">Quyosh tizimini kashf eting</Link></div>
      </div>
    </section>
    <section className="px-6 md:px-16 py-20"><h2 className="font-display text-5xl">Nimalarni o'rganasiz</h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{FEATURES.map(([to, t, d]) => <li key={to}><Link to={to} className="glass block h-full p-5 transition-colors hover:bg-white/10"><h3 className="font-display text-3xl">{t}</h3><p className="mt-2 text-sm text-slate-300">{d}</p></Link></li>)}</ul></section>
  </>)
}
