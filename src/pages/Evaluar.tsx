import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle, Star, BookOpen, Building2, MessageSquare, Eye, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useReviews } from '../hooks/useReviews'
import { UNIVERSIDADES } from '../types'

const titleCase = (s: string) =>
  s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())

const UNI_COLORS: Record<string, string> = {
  utp:      'border-blue-200 hover:bg-blue-50 hover:border-blue-400',
  latina:   'border-orange-200 hover:bg-orange-50 hover:border-orange-400',
  nacional: 'border-red-200 hover:bg-red-50 hover:border-red-400',
  usma:     'border-purple-200 hover:bg-purple-50 hover:border-purple-400',
  isae:     'border-green-200 hover:bg-green-50 hover:border-green-400',
  umecit:   'border-teal-200 hover:bg-teal-50 hover:border-teal-400',
}

const UNI_ACTIVE: Record<string, string> = {
  utp:      'border-blue-500 bg-blue-50 text-blue-700',
  latina:   'border-orange-500 bg-orange-50 text-orange-700',
  nacional: 'border-red-500 bg-red-50 text-red-700',
  usma:     'border-purple-500 bg-purple-50 text-purple-700',
  isae:     'border-green-500 bg-green-50 text-green-700',
  umecit:   'border-teal-500 bg-teal-50 text-teal-700',
}

const slideVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40, transition: { duration: 0.2 } }),
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value
  const labels = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente']
  const colors = ['', 'text-red-400', 'text-orange-400', 'text-amber-400', 'text-yellow-400', 'text-green-500']
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="flex gap-3">
        {[1,2,3,4,5].map(s => (
          <button key={s} type="button"
            onClick={() => onChange(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-125 active:scale-110 focus:outline-none">
            <Star className={`w-12 h-12 transition-all duration-150 ${s <= active ? 'fill-amber-400 text-amber-400 drop-shadow-sm' : 'text-gray-200'}`} />
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {active > 0 && (
          <motion.span key={active}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className={`text-base font-bold ${colors[active]}`}>
            {labels[active]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

const STEP_LABELS = ['Universidad', 'Profesor', 'Calificación', 'Comentario', 'Confirmar']

export default function Evaluar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { submitReview, loading, error } = useReviews()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ universidad: '', profesor: '', materia: '', comentario: '', rating: 0 })
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestRef = useRef<HTMLDivElement>(null)

  // Fetch professor suggestions from existing reviews
  useEffect(() => {
    if (!form.universidad || form.profesor.trim().length < 2) { setSuggestions([]); return }
    const timer = setTimeout(async () => {
      try {
        const q = query(collection(db, 'reviews'), where('universidad', '==', form.universidad))
        const snap = await getDocs(q)
        const names = Array.from(new Set(
          snap.docs.map(d => d.data().profesor as string)
            .filter(n => n.toLowerCase().includes(form.profesor.toLowerCase()))
        )).slice(0, 6)
        setSuggestions(names)
        setShowSuggestions(names.length > 0)
      } catch { setSuggestions([]) }
    }, 300)
    return () => clearTimeout(timer)
  }, [form.universidad, form.profesor])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const goTo = (next: number) => { setDir(next > step ? 1 : -1); setStep(next) }

  const canNext = [
    !!form.universidad,
    !!form.profesor.trim() && !!form.materia.trim(),
    form.rating > 0,
    form.comentario.trim().length >= 10,
    true,
  ]

  const handleSubmit = async () => {
    await submitReview({
      ...form,
      profesor: titleCase(form.profesor.trim()),
      materia: titleCase(form.materia.trim()),
      userId: user?.uid ?? 'anon',
      userEmail: user?.email ?? undefined,
      aceptado: false,
    })
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center max-w-sm">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">¡Reseña enviada!</h2>
          <p className="text-gray-500 text-sm mb-6">Tu reseña está en revisión y será publicada pronto. ¡Gracias!</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setDone(false); setStep(0); setForm({ universidad: '', profesor: '', materia: '', comentario: '', rating: 0 }) }}
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              Nueva reseña
            </button>
            <button onClick={() => navigate('/buscar')}
              className="bg-primary-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors">
              Buscar
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Teal header with animated circles */}
      <div className="relative bg-primary-500 pt-12 pb-24 px-4 text-center overflow-hidden">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, i) => <li key={i} />)}
        </ul>
        <div className="relative z-10">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Evaluar Profesor
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-primary-100">
            Comparte tu experiencia y ayuda a otros estudiantes
          </motion.p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 -mt-16 pb-12 relative z-10">
        {/* Step progress */}
        <div className="flex items-center justify-center mb-5">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? 'bg-green-500 text-white shadow-sm' :
                  i === step ? 'bg-white text-primary-600 shadow-md ring-2 ring-primary-500' :
                  'bg-white/40 text-white/70'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] font-medium hidden sm:block ${i === step ? 'text-white' : 'text-primary-200'}`}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 mb-4 rounded-full ${i < step ? 'bg-green-400' : 'bg-white/30'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="h-1 bg-gray-100">
            <motion.div
              animate={{ width: `${((step) / (STEP_LABELS.length - 1)) * 100}%` }}
              className="h-full bg-primary-500 rounded-full"
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="p-7 min-h-[320px] flex flex-col">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={step} custom={dir} variants={slideVariants}
                initial="enter" animate="center" exit="exit" className="flex-1">

                {/* Step 0 — University */}
                {step === 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">¿En qué universidad estudias?</h2>
                    <div className="grid grid-cols-1 gap-2.5">
                      {Object.entries(UNIVERSIDADES).map(([key, name]) => (
                        <button key={key} type="button"
                          onClick={() => { setForm({ ...form, universidad: key }); setTimeout(() => goTo(1), 180) }}
                          className={`text-left px-4 py-3.5 rounded-xl border-2 font-medium text-sm transition-all ${
                            form.universidad === key ? UNI_ACTIVE[key] : `border-gray-100 text-gray-700 ${UNI_COLORS[key]}`
                          }`}>
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 1 — Professor + Subject */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">¿A quién vas a evaluar?</h2>
                    <div className="relative" ref={suggestRef}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del profesor</label>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" value={form.profesor}
                          onChange={e => { setForm({ ...form, profesor: e.target.value }); setShowSuggestions(true) }}
                          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                          autoFocus autoComplete="off" placeholder="Ej. Juan García"
                          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors" />
                      </div>
                      <AnimatePresence>
                        {showSuggestions && suggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                          >
                            <p className="text-xs text-gray-400 px-4 py-2 border-b border-gray-50">Profesores existentes — selecciona para evitar errores</p>
                            {suggestions.map(name => (
                              <button key={name} type="button"
                                onClick={() => { setForm({ ...form, profesor: name }); setShowSuggestions(false) }}
                                className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-gray-50 last:border-0 flex items-center gap-2">
                                <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                {name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <p className="text-xs text-gray-400 mt-1.5">Si el profesor ya existe, aparecerá como sugerencia</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Materia</label>
                      <input type="text" value={form.materia}
                        onChange={e => setForm({ ...form, materia: e.target.value })}
                        placeholder="Ej. Cálculo I"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors" />
                    </div>
                  </div>
                )}

                {/* Step 2 — Rating */}
                {step === 2 && (
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-gray-900">¿Cómo calificarías a <span className="text-primary-600">{form.profesor}</span>?</h2>
                    <p className="text-sm text-gray-500">Selecciona del 1 (muy malo) al 5 (excelente)</p>
                    <StarPicker value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
                  </div>
                )}

                {/* Step 3 — Comment */}
                {step === 3 && (
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-gray-900">Cuéntanos tu experiencia</h2>
                    <textarea value={form.comentario}
                      onChange={e => setForm({ ...form, comentario: e.target.value })}
                      autoFocus rows={6}
                      placeholder="¿Cómo era su metodología? ¿Es justo en los exámenes? ¿Lo recomendarías?…"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors resize-none text-sm" />
                    <div className="flex justify-between text-xs">
                      <span className={form.comentario.length >= 10 ? 'text-green-500' : 'text-gray-400'}>
                        {form.comentario.length} caracteres {form.comentario.length >= 10 ? '✓' : '(mín. 10)'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Step 4 — Preview & confirm */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-5 h-5 text-primary-500" />
                      <h2 className="text-lg font-bold text-gray-900">Confirma tu reseña</h2>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-500">Universidad:</span>
                        <span className="font-semibold text-gray-800">{UNIVERSIDADES[form.universidad as keyof typeof UNIVERSIDADES]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-500">Profesor / Materia:</span>
                        <span className="font-semibold text-gray-800">{form.profesor} · {form.materia}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-500">Calificación:</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-4 h-4 ${s <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-gray-500">Comentario:</span>
                          <p className="text-gray-800 mt-0.5 italic">"{form.comentario}"</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Tu reseña estará en revisión antes de publicarse.</p>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-50">
              {step > 0 ? (
                <button type="button" onClick={() => goTo(step - 1)}
                  className="text-gray-500 font-medium hover:text-gray-700 transition-colors text-sm flex items-center gap-1">
                  ← Atrás
                </button>
              ) : <div />}

              {step < 4 ? (
                <button type="button" onClick={() => goTo(step + 1)} disabled={!canNext[step]}
                  className="bg-primary-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-600 transition-all disabled:opacity-40 hover:scale-105 active:scale-95 text-sm">
                  Continuar →
                </button>
              ) : (
                <button type="button" onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 text-sm shadow-md shadow-green-200">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Publicar reseña
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
