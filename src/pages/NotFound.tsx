import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-10 h-10 text-primary-500" />
        </div>
        <h1 className="text-6xl font-extrabold text-gray-900 mb-3">404</h1>
        <p className="text-xl text-gray-500 mb-8">Página no encontrada</p>
        <Link
          to="/"
          className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
