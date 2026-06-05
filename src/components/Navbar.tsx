import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-700 font-bold text-xl">
            <GraduationCap className="w-7 h-7" />
            <span>Uniference</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/buscar" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Buscar Profesor
            </Link>
            <Link to="/evaluar" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Evaluar
            </Link>
            <Link to="/tutores" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Tutores
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {user.displayName ?? user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-100 pt-4">
            <Link to="/buscar" className="block text-gray-700 py-2 font-medium" onClick={() => setMenuOpen(false)}>Buscar Profesor</Link>
            <Link to="/evaluar" className="block text-gray-700 py-2 font-medium" onClick={() => setMenuOpen(false)}>Evaluar</Link>
            <Link to="/tutores" className="block text-gray-700 py-2 font-medium" onClick={() => setMenuOpen(false)}>Tutores</Link>
            {user ? (
              <button onClick={handleLogout} className="block text-red-500 py-2 font-medium">Cerrar sesión</button>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 py-2 font-medium" onClick={() => setMenuOpen(false)}>Iniciar sesión</Link>
                <Link to="/registro" className="block text-primary-600 py-2 font-medium" onClick={() => setMenuOpen(false)}>Registrarse</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
