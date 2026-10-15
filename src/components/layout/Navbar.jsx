import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'
import SearchDialog from './SearchDialog'
const links = [['/', 'Bosh sahifa'], ['/solar-system', 'Quyosh tizimi'], ['/planets', 'Sayyoralar'], ['/galaxies', 'Galaktikalar'], ['/missions', 'Kosmik missiyalar'], ['/learn', 'O\'quv markazi'], ['/news', 'Astronomiya yangiliklari'], ['/about', 'Haqida']]
export default function Navbar() {
  const [open, setOpen] = useState(false), [find, setFind] = useState(false)
  useEffect(() => { const h = e => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setFind(true) } }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [])
  const cls = ({ isActive }) => `px-2 py-2 text-sm transition-colors ${isActive ? 'text-cyan-300' : 'text-slate-300 hover:text-white'}`
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass !rounded-none border-x-0 border-t-0">
      <nav aria-label="Asosiy" className="mx-auto flex max-w-[90rem] items-center justify-between px-5 h-14">
        <Link to="/" className="font-display text-2xl tracking-wide">COSMOS</Link>
        <div className="hidden xl:flex">{links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}</div>
        <div className="flex items-center"><button aria-label="Qidiruv (Ctrl+K)" className="p-2" onClick={() => setFind(true)}><Search size={18}/></button>
          <button className="xl:hidden p-2" aria-label="Menyuni ochish" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div>
      </nav>
      {open && <div className="xl:hidden flex flex-col px-5 pb-3" onClick={() => setOpen(false)}>{links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}</div>}
      {find && <SearchDialog onClose={() => setFind(false)}/>}
    </header>
  )
}
