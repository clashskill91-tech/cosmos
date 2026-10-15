import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GRAV } from '../../data/textures'
import { X } from 'lucide-react'
import { SOURCE } from '../../data/planets'
export const rows = p => [['Turi', p.type], ['Diametri', p.diameter], ['Massasi', p.mass], ['Quyoshdan masofa', p.distance], ['Orbital davri', p.orbit], ['Aylanish davri', p.rotation], ['O\'rtacha harorat', p.temp], ['Ma\'lum yo\'ldoshlar', p.moons], ['Atmosfera', p.atmosphere]]
function WeightCalc({ p }) {
  const [kg, setKg] = useState(70), g = GRAV[p.id], w = (kg * g / 9.8).toFixed(1)
  return <div className="mt-4 rounded-lg border border-white/10 p-3 text-sm">
    <h3 className="text-cyan-300">Vazn kalkulyatori</h3>
    <label className="mt-2 flex items-center gap-2">Yerdagi vazningiz (kg)<input type="number" min="1" max="500" value={kg} onChange={e => setKg(Math.max(0, +e.target.value))} className="w-20 rounded bg-white/10 px-2 py-1"/></label>
    <p className="mt-2">{p.name}da tarozi <b>{w} kg</b> ko'rsatadi.</p>
    <p className="text-xs text-slate-500">Erkin tushish tezlanishi: {g} m/s² (NASA). Massangiz o'zgarmaydi, faqat og'irlik kuchi.</p></div>
}
export default function PlanetPanel({ p, onClose, full }) {
  return (
    <aside className={`glass p-5 ${full ? '' : 'max-h-[70vh] overflow-y-auto'}`} aria-live="polite">
      <div className="flex items-start justify-between"><h2 className="font-display text-4xl">{p.name}</h2>
        {onClose && <button onClick={onClose} aria-label="Panelni yopish" className="p-1"><X size={18}/></button>}</div>
      <p className="mt-2 text-sm text-slate-300">{p.intro}</p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">{rows(p).map(([k, v]) => <div key={k} className="contents"><dt className="text-slate-400">{k}</dt><dd>{v}</dd></div>)}</dl>
      <h3 className="mt-4 text-sm text-cyan-300">Qiziqarli faktlar</h3><ul className="mt-1 list-disc pl-5 text-sm text-slate-300 space-y-1">{p.facts.map(f => <li key={f}>{f}</li>)}</ul>
      {full && <><h3 className="mt-4 text-sm text-cyan-300">Missiyalar</h3><ul className="mt-1 list-disc pl-5 text-sm text-slate-300">{p.missions.map(f => <li key={f}>{f}</li>)}</ul></>}
      {full && GRAV[p.id] && <WeightCalc p={p}/>}
      <div className="mt-4 flex gap-4 text-sm">{!full && <Link className="text-cyan-300 underline" to={`/planets/${p.id}`}>{p.name}ni 3D da o'rganish</Link>}
        <a className="text-slate-400 underline" href={SOURCE} target="_blank" rel="noreferrer">Manba: NASA</a></div>
    </aside>
  )
}
