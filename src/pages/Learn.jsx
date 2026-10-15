import { useState } from 'react'
import { articles, glossary, quiz } from '../data/learn'
const tone = { 'Tasdiqlangan ilm': 'text-emerald-300', 'Gipoteza': 'text-amber-300', 'Hali noaniq': 'text-rose-300' }
function Quiz() {
  const [i, setI] = useState(0), [score, setScore] = useState(0), [pick, setPick] = useState(null)
  if (i >= quiz.length) return <div className="glass p-5"><p className="font-display text-3xl">Natija: {score} / {quiz.length}</p><button className="mt-3 underline" onClick={() => { setI(0); setScore(0); setPick(null) }}>Qayta boshlash</button></div>
  const q = quiz[i]
  return <div className="glass p-5"><p className="text-xs text-slate-400">Savol {i + 1} / {quiz.length}</p><p className="mt-1 text-lg">{q.q}</p>
    <div className="mt-3 grid gap-2">{q.o.map((o, j) => <button key={o} disabled={pick !== null} onClick={() => { setPick(j); if (j === q.a) setScore(s => s + 1) }}
      className={`rounded border px-3 py-2 text-left ${pick === null ? 'border-white/15 hover:bg-white/10' : j === q.a ? 'border-emerald-400' : j === pick ? 'border-rose-400' : 'border-white/10'}`}>{o}</button>)}</div>
    {pick !== null && <button className="mt-3 text-cyan-300 underline" onClick={() => { setI(i + 1); setPick(null) }}>Keyingisi</button>}</div>
}
export default function Learn() {
  const [q, setQ] = useState('')
  const list = articles.filter(a => (a.title + a.body).toLowerCase().includes(q.toLowerCase()))
  return (
    <main className="pt-24 px-6 md:px-16 pb-16"><h1 className="font-display text-6xl">O'quv markazi</h1>
      <input aria-label="Maqolalarni qidirish" value={q} onChange={e => setQ(e.target.value)} placeholder="Maqolalarni qidirish…" className="glass mt-4 w-full max-w-md bg-transparent px-4 py-2 outline-none"/>
      {list.length === 0 && <p className="mt-6 text-slate-400">Hech narsa topilmadi.</p>}
      <ul className="mt-6 grid gap-4 md:grid-cols-2">{list.map(a => <li key={a.id} className="glass p-5"><h2 className="font-display text-3xl">{a.title}</h2><p className={`text-xs ${tone[a.status]}`}>{a.status}</p><p className="mt-2 text-sm text-slate-300">{a.body}</p></li>)}</ul>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section><h2 className="font-display text-4xl">Lug'at</h2><dl className="mt-3 space-y-2 text-sm">{glossary.map(([t, d]) => <div key={t}><dt className="text-cyan-300">{t}</dt><dd className="text-slate-300">{d}</dd></div>)}</dl></section>
        <section><h2 className="font-display text-4xl">Qisqa viktorina</h2><div className="mt-3"><Quiz/></div></section></div>
    </main>
  )
}
