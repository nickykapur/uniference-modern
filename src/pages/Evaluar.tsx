import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useReviews } from '../hooks/useReviews'
import StarRating from '../components/StarRating'
import { UNIVERSIDADES } from '../types'

export default function Evaluar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { submitReview, loading, error } = useReviews()
  const [done, setDone] = useState(false)

  const [form, setForm] = useState({
    universidad: '',
    profesor: '',
    materia: '',
    comentario: '',
    rating: 0,
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center max-w-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Inicia sesión para evaluar</h2>
          <p className="text-gray-500 text-sm mb-6">Debes estar registrado para dejar una reseña.</p>
          <Link
            to="/login"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center max-w-sm">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">¡Reseña enviada!</h2>
          <p className="text-gray-500 text-sm mb-6">Tu reseña está en revisión y será publicada pronto.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setDone(false); setForm({ universidad: '', profesor: '', materia: '', comentario: '', rating: 0 }) }}
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Nueva reseña
            </button>
            <button onClick={() => navigate('/buscar')} className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Buscar
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.rating === 0) return alert('Por favor selecciona un rating.')
    await submitReview({
      ...form,
      aceptado: false,
      userId: user.uid,
      userEmail: user.email ?? undefined,
    })
    setDone(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Evaluar Profesor</h1>
          <p className="text-gray-500">Comparte tu experiencia con otros estudiantes</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Universidad</label>
            <select
              value={form.universidad}
              onChange={(e) => setForm({ ...form, universidad: e.target.value })}
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
              value={form.profesor}
              onChange={(e) => setForm({ ...form, profesor: e.target.value })}
              required
              placeholder="Ej. Juan García"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
            <input
              type="text"
              value={form.materia}
              onChange={(e) => setForm({ ...form, materia: e.target.value })}
              required
              placeholder="Ej. Cálculo I"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} size="lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
            <textarea
              value={form.comentario}
              onChange={(e) => setForm({ ...form, comentario: e.target.value })}
              required
              rows={5}
              placeholder="Describe tu experiencia con este profesor…"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Enviar Reseña
          </button>
        </form>
      </div>
    </div>
  )
}
