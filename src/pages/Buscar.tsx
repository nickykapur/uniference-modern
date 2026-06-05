import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { useReviews } from '../hooks/useReviews'
import ReviewCard from '../components/ReviewCard'
import type { Review } from '../types'
import { UNIVERSIDADES } from '../types'

export default function Buscar() {
  const [universidad, setUniversidad] = useState('')
  const [profesor, setProfesor] = useState('')
  const [results, setResults] = useState<Review[] | null>(null)
  const { searchReviews, loading, error } = useReviews()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!universidad || !profesor.trim()) return
    const data = await searchReviews(universidad, profesor)
    setResults(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buscar Profesor</h1>
          <p className="text-gray-500">Encuentra reseñas de profesores en tu universidad</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Universidad</label>
            <select
              value={universidad}
              onChange={(e) => setUniversidad(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Selecciona tu universidad…</option>
              {Object.entries(UNIVERSIDADES).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del profesor</label>
            <input
              type="text"
              value={profesor}
              onChange={(e) => setProfesor(e.target.value)}
              required
              placeholder="Ej. Juan García"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Buscar
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm text-center mb-6">{error}</p>
        )}

        {results !== null && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              {results.length === 0
                ? 'No se encontraron reseñas para este profesor.'
                : `${results.length} reseña${results.length !== 1 ? 's' : ''} encontrada${results.length !== 1 ? 's' : ''}`}
            </p>
            <div className="space-y-4">
              {results.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
