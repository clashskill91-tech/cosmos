export default function About() {
  const src = [['NASA Solar System Exploration', 'https://science.nasa.gov/solar-system/'], ['NASA APOD API', 'https://api.nasa.gov/'], ['Planeta teksturalari: threex.planets (Solar System Scope / JPL asosidagi xaritalar)', 'https://github.com/jeromeetienne/threex.planets']]
  return <main className="pt-28 px-6 md:px-16 max-w-3xl pb-16"><h1 className="font-display text-6xl">Haqida</h1>
    <p className="mt-4 text-slate-300">COSMOS — ta'limiy astronomiya sayti. Quyosh tizimi vizualizatsiyasi ko'rgazmali: o'lchamlar kattalashtirilgan, masofalar siqilgan, orbital tezliklar tezlashtirilgan. Galaktika sahnasi sxematik, simulyatsiya emas.</p>
    <h2 className="mt-8 font-display text-3xl">Manbalar</h2><ul className="mt-2 list-disc pl-5 text-slate-300">{src.map(([t, u]) => <li key={u}><a className="underline" href={u} target="_blank" rel="noreferrer">{t}</a></li>)}</ul>
    <p className="mt-4 text-xs text-slate-500">Tijoriy foydalanishdan oldin teksturalar litsenziyasini tekshiring.</p></main>
}
