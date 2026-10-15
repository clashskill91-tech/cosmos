import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import SolarSystem from './pages/SolarSystem'
import Planets from './pages/Planets'
import PlanetPage from './pages/PlanetPage'
import ComingSoon from './pages/ComingSoon'
import Galaxies from './pages/Galaxies'
import Missions from './pages/Missions'
import News from './pages/News'
import About from './pages/About'
import Learn from './pages/Learn'
function Footer() {
  if (useLocation().pathname === '/solar-system') return null
  return <footer className="border-t border-white/10 px-6 md:px-16 py-6 text-xs text-slate-500">COSMOS · Ma'lumotlar: NASA Solar System Exploration, NASA APOD · Vizualizatsiya ko'rgazmali, masshtabga mos emas · <a className="underline" href="/about">Manbalar</a></footer>
}
export default function App() {
  return <><Navbar/><Routes>
    <Route path="/" element={<Home/>}/><Route path="/solar-system" element={<SolarSystem/>}/>
    <Route path="/planets" element={<Planets/>}/><Route path="/planets/:id" element={<PlanetPage/>}/>
    <Route path="/galaxies" element={<Galaxies/>}/>
    <Route path="/missions" element={<Missions/>}/>
    <Route path="/news" element={<News/>}/>
    <Route path="/learn" element={<Learn/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="*" element={<ComingSoon title="Koinotda adashdingiz">Bunday sahifa yo'q.</ComingSoon>}/>
  </Routes><Footer/></>
}
