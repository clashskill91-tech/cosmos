import { ExternalLink } from 'lucide-react'
import { missions } from '../data/missions'
export default function Missions() {
  return (
    <main className="pt-24 px-6 md:px-16 pb-16"><h1 className="font-display text-6xl">Kosmik missiyalar</h1>
      <p className="mt-2 max-w-xl text-slate-300">Holat yozuvlari statik va eskirgan bo'lishi mumkin. Yangi ma'lumot uchun missiya sahifasini oching.</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{missions.map(m => (
        <li key={m.name} className="glass p-5 flex flex-col"><h2 className="font-display text-3xl">{m.name}</h2>
          <p className="text-sm text-slate-400">{m.agency} · ishga tushgan: {m.launch}</p><p className="mt-3 text-sm text-slate-300 flex-1">{m.goal}</p>
          <p className="mt-3 text-sm text-cyan-300">{m.status}</p>
          <a href={m.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm underline">Rasmiy manba <ExternalLink size={12}/></a></li>))}</ul></main>
  )
}
