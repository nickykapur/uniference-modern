import { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Home, Search, Star, Users, LogOut, LogIn, ShieldCheck, ChevronDown, GraduationCap, BriefcaseBusiness, Settings, MessageCircle, Crown, Megaphone, Wrench, BookOpen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { isAdminEmail } from '../lib/admins'

const NAV_LINKS = [
  { to: '/buscar', label: 'Buscar Profesor' },
  { to: '/tutores', label: 'Tutores' },
  { to: '/futuro', label: 'Visión' },
]

const TABS = [
  { to: '/', label: 'Inicio', icon: Home, exact: true },
  { to: '/buscar', label: 'Buscar', icon: Search, exact: false },
  { to: '/evaluar', label: 'Evaluar', icon: Star, exact: false },
  { to: '/tutores', label: 'Tutores', icon: Users, exact: false },
]

function AccountMenu() {
  const { user, logout } = useAuth()
  const isAdmin = isAdminEmail(user?.email)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) {
    return (
      <Link to="/login"
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors px-3 py-2 rounded-xl hover:bg-gray-50">
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">Iniciar sesión</span>
      </Link>
    )
  }

  const initial = (user.displayName ?? user.email ?? '?').charAt(0).toUpperCase()

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 rounded-full hover:bg-gray-50 transition-colors p-1 pr-2">
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white text-sm font-bold flex items-center justify-center shadow-sm">
          {initial}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.displayName ?? 'Estudiante'}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <Link to="/estudiante" onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <GraduationCap className="w-4 h-4" />
            Portal estudiante
          </Link>
          <Link to="/estudiante/vida-universitaria" onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <BookOpen className="w-4 h-4" />
            Vida universitaria
          </Link>
          <Link to="/instructor" onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <BriefcaseBusiness className="w-4 h-4" />
            Portal instructor
          </Link>
          <Link to="/perfil" onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4" />
            Perfil y configuración
          </Link>
          <Link to="/suscripciones" onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <MessageCircle className="w-4 h-4" />
            Suscripciones y chat
          </Link>
          <Link to="/instructor/premium" onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Crown className="w-4 h-4" />
            Instructor Premium
          </Link>
          <Link to="/instructor/anuncios" onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Megaphone className="w-4 h-4" />
            Mis anuncios
          </Link>
          <Link to="/instructor/herramientas" onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Wrench className="w-4 h-4" />
            Herramientas instructor
          </Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors">
              <ShieldCheck className="w-4 h-4" />
              Panel de moderación
            </Link>
          )}
          <button onClick={() => { setOpen(false); logout() }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { user } = useAuth()
  const isAdmin = isAdminEmail(user?.email)

  return (
    <>
      {/* Top bar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="/logo.png" alt="Uniference" className="w-9 h-9 group-hover:scale-105 transition-transform" />
              <span className="font-extrabold text-xl text-gray-900 tracking-tight">
                Uni<span className="text-primary-500">ference</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(l => (
                <NavLink key={l.to} to={l.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }>
                  {l.label}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }>
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </NavLink>
              )}
              <Link to="/evaluar"
                className="ml-2 inline-flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-all hover:scale-105 active:scale-95 shadow-sm shadow-primary-200">
                <Star className="w-4 h-4" />
                Evaluar
              </Link>
            </div>

            <div className="flex items-center gap-1">
              <AccountMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4">
          {TABS.map(({ to, label, icon: Icon, exact }) => (
            <NavLink key={to} to={to} end={exact}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
                }`
              }>
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'fill-primary-100' : ''}`} strokeWidth={isActive ? 2.4 : 2} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
