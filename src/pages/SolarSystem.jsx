import { lazy, useEffect, useState } from 'react'
import { ArrowLeft, Pause, Play, RotateCcw } from 'lucide-react'
import SceneFrame from '../components/layout/SceneFrame'
import PlanetPanel from '../components/layout/PlanetPanel'
import { byId, orbiting } from '../data/planets'
const Scene = lazy(() => import('../components/three/SolarSystemScene'))
export default function SolarSystem() {
  const [sel, setSel] = useState(null), [paused, setPaused] = useState(false), [speed, setSpeed] = useState(1)
  const [labels, setLabels] = useState(true), [orbits, setOrbits] = useState(false), [reset, setReset] = useState(0)
  const back = () => { setSel(null); setReset(r => r + 1) } // umumiy ko'rinishga qaytish
  useEffect(() => { const h = e => { if (e.key === 'Escape') back() }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [])
  const btn = 'glass px-3 py-2 text-sm flex items-center gap-2 hover:bg-white/10'
  return (
    <section className="relative h-screen pt-14">
      <div className="absolute inset-0 top-14"><SceneFrame><Scene {...{ speed, paused, labels, orbits, selected: sel, resetKey: reset }} onSelect={setSel}/></SceneFrame></div>
      <div className="absolute left-4 top-20 z-10 flex flex-col gap-2 w-56">
        <div className="glass p-3 text-sm space-y-3">
          <div className="flex gap-2"><button className={btn} onClick={() => setPaused(!paused)}>{paused ? <Play size={14}/> : <Pause size={14}/>}{paused ? 'Davom ettirish' : 'To\'xtatish'}</button>
            <button className={btn} onClick={() => { setSel(null); setReset(r => r + 1) }}><RotateCcw size={14}/>Tiklash</button></div>
          <label className="block">Tezlik ×{speed.toFixed(1)}<input type="range" min="0" max="10" step=".5" value={speed} onChange={e => setSpeed(+e.target.value)} className="w-full"/></label>
          <label className="flex gap-2"><input type="checkbox" checked={labels} onChange={e => setLabels(e.target.checked)}/>Nomlar</label>
          <label className="flex gap-2"><input type="checkbox" checked={orbits} onChange={e => setOrbits(e.target.checked)}/>Orbita yo'llari</label>
          <select aria-label="Sayyorani tanlang" className="w-full bg-midnight rounded p-2" value={sel || ''} onChange={e => setSel(e.target.value || null)}>
            <option value="">Sayyorani tanlang…</option>{[byId('sun'), ...orbiting].map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        </div>
        <p className="glass p-3 text-xs text-slate-300">Ko'rgazmali masshtab: sayyoralar o'lchami kattalashtirilgan, orbita masofalari siqilgan. Orbitalar haqiqiy ekssentrisitetli ellipslar (Quyosh fokusda), tezlik Kepler qonuniga ko'ra o'zgaradi, lekin real vaqtdan ancha tez. Asteroid kamari sxematik.</p>
      </div>
      {sel && <button onClick={back} className="glass absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 px-4 py-2 text-sm hover:bg-white/10"><ArrowLeft size={16}/>Orqaga: umumiy ko'rinish (Esc)</button>}
      {sel && <div className="absolute right-4 top-20 z-10 w-80 max-w-[calc(100vw-2rem)]"><PlanetPanel p={byId(sel)} onClose={back}/></div>}
    </section>
  )
}
