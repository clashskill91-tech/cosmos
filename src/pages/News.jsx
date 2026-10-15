import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { fetchApod, searchImages } from '../lib/nasaApi'
const TOPICS = [['Galaktika', 'galaxy'], ['Tumanlik', 'nebula'], ['Mars', 'mars surface'], ['Yupiter', 'jupiter'], ['Saturn', 'saturn rings'], ['Oy', 'moon'], ['Webb', 'james webb']]
function Cards({ items, onOpen }) {
  return <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map(a => (
    <li key={a.id || a.date}><button onClick={() => onOpen(a)} className="glass block w-full overflow-hidden text-left hover:bg-white/10">
      {a.media_type === 'image' ? <img src={a.url} alt="" loading="lazy" className="h-44 w-full object-cover" onError={e => { e.currentTarget.style.visibility = 'hidden' }}/> : <div className="grid h-44 place-items-center text-slate-400">Video</div>}
      <div className="p-3"><p className="text-xs text-slate-400">{a.date}</p><p className="line-clamp-2 font-medium">{a.title}</p></div></button></li>))}</ul>
}
export default function News() {
  const [apod, setApod] = useState(null), [err, setErr] = useState(null), [open, setOpen] = useState(null)
  const [topic, setTopic] = useState(TOPICS[0]), [lib, setLib] = useState(null), [libErr, setLibErr] = useState(null), [text, setText] = useState('')
  useEffect(() => { fetchApod().then(setApod).catch(e => setErr(e.message)) }, [])
  useEffect(() => { setLib(null); setLibErr(null); searchImages(topic[1]).then(setLib).catch(e => setLibErr(e.message)) }, [topic])
  // Hamma kun uchun bir xil surat/nom qaytsa, bu haqiqiy APOD emas
  const broken = apod && apod.length > 1 && new Set(apod.map(a => a.url)).size === 1
  const media = a => a.media_type === 'video' ? <iframe title={a.title} src={a.url} className="w-full aspect-video" allowFullScreen/> : <img src={a.url} alt={a.title} className="w-full"/>
  return (
    <main className="pt-24 px-6 md:px-16 pb-16"><h1 className="font-display text-6xl">Astronomiya yangiliklari</h1>
      <h2 className="mt-8 font-display text-4xl">Kunning astronomik surati (APOD)</h2>
      <p className="mt-1 text-sm text-slate-300">NASA APOD dan jonli. Suratlar mualliflik huquqi ko'rsatilgan mualliflarga tegishli. <a className="underline" href="https://apod.nasa.gov/apod/astropix.html" target="_blank" rel="noreferrer">apod.nasa.gov</a></p>
      {err && <p role="alert" className="glass mt-4 p-4 text-amber-200">NASA ma'lumotlari yuklanmadi. {err} Jonli ma'lumot o'rniga namuna ko'rsatilmaydi.</p>}
      {!apod && !err && <p className="mt-4 text-slate-400">NASA dan yuklanmoqda…</p>}
      {broken && <p role="alert" className="glass mt-4 p-4 text-amber-200">NASA APOD hozir barcha kunlar uchun bir xil element ("{apod[0].title}") qaytarmoqda. Bu NASA tomonidagi muammo bo'lishi mumkin, shuning uchun kartochkalar yashirildi. Kalitingizni tekshirish uchun brauzerda api.nasa.gov/planetary/apod?api_key=KALIT manzilini oching.</p>}
      {apod && !broken && (apod.length === 0 ? <p className="mt-4 text-slate-400">NASA hech narsa qaytarmadi.</p> : <Cards items={apod} onOpen={setOpen}/>)}

      <h2 className="mt-14 font-display text-4xl">NASA tasvir kutubxonasi</h2>
      <p className="mt-1 text-sm text-slate-300">Haqiqiy NASA suratlari, kalitsiz. Mavzu tanlang yoki inglizcha so'z bilan qidiring.</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {TOPICS.map(t => <button key={t[1]} aria-pressed={topic[1] === t[1]} onClick={() => setTopic(t)} className={`glass px-4 py-2 text-sm ${topic[1] === t[1] ? 'text-cyan-300' : ''}`}>{t[0]}</button>)}
        <input aria-label="Qidirish" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && text.trim()) setTopic([text.trim(), text.trim()]) }} placeholder="Masalan: pillars of creation" className="glass bg-transparent px-4 py-2 text-sm outline-none"/></div>
      {libErr && <p role="alert" className="glass mt-4 p-4 text-amber-200">Yuklanmadi. {libErr}</p>}
      {!lib && !libErr && <p className="mt-4 text-slate-400">Yuklanmoqda…</p>}
      {lib && (lib.length === 0 ? <p className="mt-4 text-slate-400">Hech narsa topilmadi.</p> : <Cards items={lib} onOpen={setOpen}/>)}

      {open && <div role="dialog" aria-modal="true" aria-label={open.title} className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4" onClick={() => setOpen(null)}>
        <div className="glass max-h-[90vh] max-w-3xl overflow-y-auto p-4" onClick={e => e.stopPropagation()}>
          <button aria-label="Yopish" className="float-right p-1" onClick={() => setOpen(null)}><X/></button>
          {media(open)}<h2 className="mt-3 font-display text-3xl">{open.title}</h2><p className="text-xs text-slate-400">{open.date}{open.copyright ? ` · ${open.copyright.trim()}` : ''}</p>
          <p className="mt-2 text-sm text-slate-300">{open.explanation}</p></div></div>}
    </main>
  )
}
