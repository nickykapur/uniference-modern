import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Loader2, CheckCircle, Star, BookOpen, Building2, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useReviews } from '../hooks/useReviews'
import { UNIVERSIDADES } from '../types'

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value
  const labels = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente']
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex gap-2">
        {[1,2,3,4,5].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-125 active:scale-110"
          >
            <Star className={`w-9 h-9 transition-colors ${s <= active ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {active > 0 && (
          <motion.span
            key={active}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-sm font-medium text-amber-500"
          >
            {labels[active]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

const steps = [
  { icon: <Building2 className="w-5 h-5" />, label: 'Universidad' },
  { icon: <BookOpen className="w-5 h-5" />, label: 'Datos' },
  { icon: <Star className="w-5 h-5" />, label: 'Calificación' },
  { icon: <MessageSquare className="w-5 h-5" />, label: 'Comentario' },
]

export default function Evaluar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { submitReview, loading, error } = useReviews()
  const [step, setStep] = useState(0)
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center max-w-sm"
        >
          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-7 h-7 text-primary-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Inicia sesión para evaluar</h2>
          <p className="text-gray-500 text-sm mb-6">Debes estar registrado para dejar una reseña.</p>
          <Link to="/login" className="inline-block bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors">
            Iniciar sesión
          </Link>
        </motion.div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center max-w-sm"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">¡Reseña publicada!</h2>
          <p className="text-gray-500 text-sm mb-6">Gracias por ayudar a otros estudiantes con tu opinión.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setDone(false); setStep(0); setForm({ universidad: '', profesor: '', materia: '', comentario: '', rating: 0 }) }}
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Nueva reseña
            </button>
            <button onClick={() => navigate('/buscar')} className="bg-primary-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors">
              Buscar
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.rating === 0) return
    await submitReview({ ...form, userId: user.uid, userEmail: user.email ?? undefined, aceptado: true })
    setDone(true)
  }

  const canNext = [
    !!form.universidad,
    !!form.profesor && !!form.materia,
    form.rating > 0,
    !!form.comentario.trim(),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-500 pt-12 pb-20 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-extrabold text-white mb-2"
        >
          Evaluar Profesor
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-primary-100"
        >
          Comparte tu experiencia y ayuda a otros estudiantes
        </motion.p>
      </div>

      <div className="max-w-xl mx-auto px-4 -mt-12 pb-12">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-green-500 text-white' :
                i === step ? 'bg-white text-primary-600 shadow-md ring-2 ring-primary-500' :
                'bg-primary-400/40 text-white'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-green-400' : 'bg-primary-300/50'}`} />}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-7"
        >
          <form onSubmit={handleSubmit}>
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">¿En qué universidad estudias?</h2>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(UNIVERSIDADES).map(([key, name]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setForm({ ...form, universidad: key }); setTimeout(() => setStep(1), 200) }}
                      className={`text-left px-4 py-3.5 rounded-xl border-2 font-medium text-sm transition-all ${
                        form.universidad === key
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-100 hover:border-primary-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">¿A quién vas a evaluar?</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del profesor</label>
                  <input
                    type="text"
                    value={form.profesor}
                    onChange={e => setForm({ ...form, profesor: e.target.value })}
                    required
                    placeholder="Ej. Juan García"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Materia</label>
                  <input
                    type="text"
                    value={form.materia}
                    onChange={e => setForm({ ...form, materia: e.target.value })}
                    required
                    placeholder="Ej. Cálculo I"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">¿Cómo calificarías a {form.profesor}?</h2>
                <p className="text-sm text-gray-500">Selecciona una calificación del 1 al 5</p>
                <StarPicker value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Cuéntanos tu experiencia</h2>
                <textarea
                  value={form.comentario}
                  onChange={e => setForm({ ...form, comentario: e.target.value })}
                  required
                  rows={5}
                  placeholder="¿Cómo era su metodología? ¿Es justo en los exámenes? ¿Lo recomendarías?…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors resize-none text-sm"
                />
                <p className="text-xs text-gray-400">{form.comentario.length} / 500 caracteres mínimo recomendado: 50</p>
              </div>
            )}

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-50">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(s => s - 1)} className="text-gray-500 font-medium hover:text-gray-700 transition-colors">
                  ← Atrás
                </button>
              ) : <div />}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canNext[step]}
                  className="bg-primary-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-600 transition-all disabled:opacity-40 hover:scale-105 active:scale-95"
                >
                  Continuar →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || form.rating === 0 || !form.comentario.trim()}
                  className="bg-primary-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-600 transition-all disabled:opacity-40 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Publicar reseña
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
