import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Planet3D from '../components/three/Planet3D'
import Starfield from '../components/three/Starfield'
import SceneFrame from '../components/layout/SceneFrame'
import PlanetPanel from '../components/layout/PlanetPanel'
import { byId, planets } from '../data/planets'
export default function PlanetPage() {
  const { id } = useParams(), p = byId(id), nav = useNavigate()
  if (!p) return <main className="pt-28 px-6 text-center"><h1 className="font-display text-4xl">Bunday jism topilmadi.</h1><Link className="text-cyan-300 underline" to="/planets">Barcha sayyoralar</Link></main>
  const k = planets.findIndex(x => x.id === id), prev = planets[(k - 1 + planets.length) % planets.length], next = planets[(k + 1) % planets.length]
  const back = () => (window.history.state?.idx > 0 ? nav(-1) : nav('/planets'))
  const rel = (p.related || []).map(byId)
  return (
    <main className="pt-14 min-h-screen lg:flex">
      <div className="relative h-[55vh] lg:h-[calc(100vh-3.5rem)] lg:flex-1"><SceneFrame>
        <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 1.75]}>
          <ambientLight intensity={.12}/><directionalLight position={[5, 2, 4]} intensity={3.2}/><Starfield/>
          <Planet3D key={p.id} planet={p} radius={1.6} moon={p.id === 'earth'}/><OrbitControls enablePan={false} minDistance={3} maxDistance={14}/>
        </Canvas></SceneFrame>
        <button onClick={back} aria-label="Orqaga qaytish" className="glass absolute left-4 top-4 z-10 flex items-center gap-1 px-3 py-2 text-sm hover:bg-white/10"><ChevronLeft size={16}/>Orqaga</button>
        <p className="absolute bottom-2 left-3 text-[11px] text-slate-400">Teksturalar: ochiq planetar xaritalar ("Haqida" sahifasiga qarang). Ko'rsatilgan yuza global rangli xarita.</p></div>
      <div className="p-4 lg:w-[26rem] lg:overflow-y-auto lg:h-[calc(100vh-3.5rem)]">
        <PlanetPanel p={p} full/>
        <nav aria-label="Qo'shni jismlar" className="mt-4 flex justify-between text-sm"><Link to={`/planets/${prev.id}`} className="flex items-center gap-1 text-cyan-300"><ChevronLeft size={14}/>{prev.name}</Link><Link to={`/planets/${next.id}`} className="flex items-center gap-1 text-cyan-300">{next.name}<ChevronRight size={14}/></Link></nav>
        {rel.length > 0 && <p className="mt-4 text-sm">Bog'liq: {rel.map(r => <Link key={r.id} to={`/planets/${r.id}`} className="text-cyan-300 underline mr-3">{r.name}</Link>)}</p>}
      </div>
    </main>
  )
}
