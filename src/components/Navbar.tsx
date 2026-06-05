import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-primary-500 shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <img src="/logo.jpg" alt="Uniference" className="w-8 h-8 rounded-lg object-cover" />
            <span>Uniference</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/buscar" className="text-primary-100 hover:text-white font-medium transition-colors">
              Buscar Profesor
            </Link>
            <Link to="/evaluar" className="text-primary-100 hover:text-white font-medium transition-colors">
              Evaluar
            </Link>
            <Link to="/tutores" className="text-primary-100 hover:text-white font-medium transition-colors">
              Tutores
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-primary-400 pt-4">
            <Link to="/buscar" className="block text-white py-2 font-medium" onClick={() => setMenuOpen(false)}>Buscar Profesor</Link>
            <Link to="/evaluar" className="block text-white py-2 font-medium" onClick={() => setMenuOpen(false)}>Evaluar</Link>
            <Link to="/tutores" className="block text-white py-2 font-medium" onClick={() => setMenuOpen(false)}>Tutores</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
