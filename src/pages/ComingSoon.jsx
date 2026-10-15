export default function ComingSoon({ title, children }) {
  return <main className="pt-28 px-6 md:px-16 max-w-3xl"><h1 className="font-display text-6xl">{title}</h1>
    <p className="mt-4 text-slate-300">{children || 'This section is not built yet.'}</p></main>
}
