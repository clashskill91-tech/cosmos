import { lazy, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import SceneFrame from '../components/layout/SceneFrame'
import { objects } from '../data/galaxies'
const Scene = lazy(() => import('../components/three/GalaxyScene'))
export default function Galaxies() {
  const [sp] = useSearchParams(), [q, setQ] = useState(''), [cat, setCat] = useState('Hammasi'), [sel, setSel] = useState(objects.find(o => o.id === sp.get('o')) || objects[0])
  useEffect(() => { const o = objects.find(o => o.id === sp.get('o')); if (o) setSel(o) }, [sp])
  const [paused, setPaused] = useState(false)
  const step = d => setSel(objects[(objects.indexOf(sel) + d + objects.length) % objects.length])
  const list = useMemo(() => objects.filter(o => (cat === 'Hammasi' || o.cat === cat) && (o.name + o.cls).toLowerCase().includes(q.toLowerCase())), [q, cat])
  return (
    <main className="pt-14">
      <div className="relative h-[45vh]"><SceneFrame><Scene obj={sel} paused={paused}/></SceneFrame>
        <div className="absolute left-4 top-4 z-10 flex gap-2"><button aria-label="Oldingi" className="glass p-2" onClick={() => step(-1)}><ChevronLeft size={16}/></button><button aria-label="Keyingi" className="glass p-2" onClick={() => step(1)}><ChevronRight size={16}/></button><button aria-label={paused ? "Aylanishni davom ettirish" : "Aylanishni to'xtatish"} className="glass p-2" onClick={() => setPaused(!paused)}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button></div>
        <p className="absolute bottom-2 left-3 text-[11px] text-slate-400">Sxematik, badiiy tasvir: {sel.name} ning ilmiy simulyatsiyasi emas. Sichqoncha bilan aylantiring.</p></div>
      <div className="px-6 md:px-16 py-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
        <section>
          <h1 className="font-display text-5xl">Galaktikalar va tumanliklar</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <label className="glass flex items-center gap-2 px-3 py-2"><Search size={16}/><input aria-label="Jismlarni qidirish" value={q} onChange={e => setQ(e.target.value)} placeholder="Qidirish…" className="bg-transparent outline-none"/></label>
            {['Hammasi', 'Galaktika', 'Tumanlik'].map(c => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`glass px-4 py-2 text-sm ${cat === c ? 'text-cyan-300' : ''}`}>{c}</button>)}</div>
          {list.length === 0 ? <p className="mt-8 text-slate-400">Hech narsa topilmadi. Qidiruvni tozalang yoki "Hammasi"ni tanlang.</p> :
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">{list.map(o => <li key={o.id}><button onClick={() => setSel(o)} className={`glass w-full p-4 text-left hover:bg-white/10 ${sel.id === o.id ? 'ring-1 ring-cyan-300' : ''}`}>
              <span className="block h-2 w-10 rounded" style={{ background: o.hue }}/><span className="mt-2 block font-display text-2xl">{o.name}</span><span className="text-sm text-slate-400">{o.cls}</span></button></li>)}</ul>}
        </section>
        <aside className="glass p-5 self-start" aria-live="polite"><h2 className="font-display text-3xl">{sel.name}</h2>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm"><dt className="text-slate-400">Sinfi</dt><dd>{sel.cls}</dd><dt className="text-slate-400">Masofa</dt><dd>{sel.dist}</dd><dt className="text-slate-400">O'lchami</dt><dd>{sel.size}</dd></dl>
          <p className="mt-3 text-sm text-slate-300">{sel.history}</p><ul className="mt-3 list-disc pl-5 text-sm text-slate-300">{sel.facts.map(f => <li key={f}>{f}</li>)}</ul>
          <p className="mt-3 text-xs text-slate-500">Qiymatlar taxminiy (NASA / ESA ochiq sahifalari).</p></aside>
      </div>
    </main>
  )
}
