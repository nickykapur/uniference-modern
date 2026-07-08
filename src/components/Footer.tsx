import { Link } from 'react-router-dom'
import { UNIVERSIDADES } from '../types'

const LINKS = [
  { to: '/buscar', label: 'Buscar Profesor' },
  { to: '/evaluar', label: 'Evaluar' },
  { to: '/tutores', label: 'Tutores' },
  { to: '/instructores', label: 'Instructores' },
  { to: '/futuro', label: 'Visión' },
  { to: '/tutores/postular', label: 'Ser tutor' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <img src="/logo.png" alt="Uniference" className="w-8 h-8" />
            <span className="font-extrabold text-lg text-white">
              Uni<span className="text-primary-500">ference</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed">
            Reseñas honestas de profesores universitarios en Panamá, por estudiantes para estudiantes.
          </p>
        </div>

        <div>
          <p className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Explora</p>
          <ul className="space-y-2">
            {LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Universidades</p>
          <ul className="space-y-2">
            {Object.entries(UNIVERSIDADES).map(([key, name]) => (
              <li key={key}>
                <Link to="/buscar" className="text-sm hover:text-white transition-colors">{name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <p className="max-w-5xl mx-auto px-6 py-5 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Uniference · Hecho para estudiantes panameños
        </p>
      </div>
    </footer>
  )
}
