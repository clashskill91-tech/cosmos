import { Link } from 'react-router-dom'
import { planets } from '../data/planets'
import { TEX } from '../data/textures'
export default function Planets() {
  return (
    <main className="pt-24 px-6 md:px-16 pb-16"><h1 className="font-display text-6xl">Sayyoralar</h1>
      <p className="mt-2 text-slate-300 max-w-xl">3D da ko'rish uchun dunyoni tanlang. Ma'lumotlar: NASA Solar System Exploration.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{planets.map(p => (
        <li key={p.id}><Link to={`/planets/${p.id}`} className="glass block p-5 hover:bg-white/10 transition-colors">
          <div className="h-14 w-14 rounded-full" style={{ backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,.25), transparent 45%, rgba(0,0,0,.7)), url(/textures/${TEX[p.id]})`, backgroundSize: 'cover' }}/>
          <h2 className="mt-3 font-display text-3xl">{p.name}</h2><p className="text-sm text-slate-400">{p.type} · {p.diameter}</p></Link></li>))}
      </ul></main>
  )
}
