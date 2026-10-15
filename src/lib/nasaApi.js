const KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY' // brauzerda ochiq; DEMO_KEY juda cheklangan
const iso = d => d.toISOString().slice(0, 10)
export async function fetchApod(days = 8) {
  const end = new Date(), start = new Date(Date.now() - (days - 1) * 864e5)
  const r = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${KEY}&start_date=${iso(start)}&end_date=${iso(end)}&thumbs=true`)
  if (!r.ok) throw new Error(r.status === 429 ? "NASA so'rovlar chegarasiga yetildi. .env ga o'z kalitingizni qo'shing." : `NASA API ${r.status} xatosini qaytardi.`)
  const j = await r.json()
  if (!Array.isArray(j)) throw new Error("NASA kutilmagan javob qaytardi.")
  return j.reverse()
}
// NASA Image and Video Library: kalit talab qilmaydi
export async function searchImages(q) {
  const r = await fetch(`https://images-api.nasa.gov/search?media_type=image&q=${encodeURIComponent(q)}`)
  if (!r.ok) throw new Error(`NASA tasvir kutubxonasi ${r.status} xatosini qaytardi.`)
  const j = await r.json()
  return (j.collection?.items || []).filter(i => i.links?.[0]?.href && i.data?.[0]).slice(0, 24).map(i => {
    const d = i.data[0]
    return { date: (d.date_created || '').slice(0, 10), title: d.title, media_type: 'image', url: i.links[0].href, copyright: d.photographer || d.secondary_creator || d.center || '', explanation: (d.description || '').replace(/<[^>]+>/g, ''), id: d.nasa_id }
  })
}
