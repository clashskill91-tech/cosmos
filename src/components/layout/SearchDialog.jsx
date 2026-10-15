import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { planets } from '../../data/planets'
import { objects } from '../../data/galaxies'
import { missions } from '../../data/missions'
const all = [...planets.map(p => ({ k: p.id === 'sun' ? 'Yulduz' : 'Sayyora', n: p.name, to: `/planets/${p.id}`, t: p.type })), ...objects.map(o => ({ k: o.cat, n: o.name, to: `/galaxies?o=${o.id}`, t: o.cls })), ...missions.map(m => ({ k: 'Missiya', n: m.name, to: '/missions', t: m.agency }))]
const cats = ['Hammasi', 'Sayyora', 'Yulduz', 'Galaktika', 'Tumanlik', 'Missiya']
export default function SearchDialog({ onClose }) {
  const [raw, setRaw] = useState(''), [q, setQ] = useState(''), [cat, setCat] = useState('Hammasi'), [i, setI] = useState(0), nav = useNavigate(), ref = useRef()
  useEffect(() => { ref.current?.focus() }, [])
  useEffect(() => { const t = setTimeout(() => { setQ(raw.trim().toLowerCase()); setI(0) }, 200); return () => clearTimeout(t) }, [raw])
  const res = useMemo(() => all.filter(o => (cat === 'Hammasi' || o.k === cat) && (!q || (o.n + ' ' + o.t).toLowerCase().includes(q))).slice(0, 8), [q, cat])
  const go = o => { nav(o.to); onClose() }
  const key = e => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowDown') { e.preventDefault(); setI(x => Math.min(x + 1, res.length - 1)) } if (e.key === 'ArrowUp') { e.preventDefault(); setI(x => Math.max(x - 1, 0)) } if (e.key === 'Enter' && res[i]) go(res[i]) }
  return <div role="dialog" aria-modal="true" aria-label="Qidiruv" className="fixed inset-0 z-[70] bg-black/70 p-4 pt-24" onClick={onClose} onKeyDown={key}>
    <div className="glass mx-auto max-w-xl p-4" onClick={e => e.stopPropagation()}>
      <label className="flex items-center gap-2"><Search size={18}/><input ref={ref} value={raw} onChange={e => setRaw(e.target.value)} placeholder="Sayyora, galaktika, missiya…" className="w-full bg-transparent outline-none"/></label>
      <div className="mt-3 flex flex-wrap gap-2">{cats.map(c => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`rounded-full border border-white/15 px-3 py-1 text-xs ${cat === c ? 'text-cyan-300' : ''}`}>{c}</button>)}</div>
      <ul role="listbox" className="mt-3">{res.map((o, j) => <li key={o.to + o.n} role="option" aria-selected={j === i}><button onClick={() => go(o)} onMouseEnter={() => setI(j)} className={`flex w-full justify-between rounded px-3 py-2 text-left ${j === i ? 'bg-white/10' : ''}`}><span>{o.n}</span><span className="text-xs text-slate-400">{o.k}</span></button></li>)}</ul>
      {res.length === 0 && <p className="py-4 text-center text-slate-400">Hech narsa topilmadi.</p>}
    </div></div>
}
