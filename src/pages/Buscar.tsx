import { useState, useEffect, useRef } from 'react'
import { Search, Loader2, Star, BookOpen, Building2 } from 'lucide-react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useReviews } from '../hooks/useReviews'
import type { Review } from '../types'
import { UNIVERSIDADES } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }
  }),
}

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-4 h-4 ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  )
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const univName = UNIVERSIDADES[review.universidad as keyof typeof UNIVERSIDADES] ?? review.universidad
  return (
    <motion.div
      custom={index} variants={cardVariants} initial="hidden" animate="visible"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-6"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {review.profesor.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{review.profesor}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <BookOpen className="w-3 h-3" />
              <span>{review.materia}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StarDisplay value={review.rating} />
          <span className="text-xs font-semibold text-amber-500">{review.rating}.0 / 5</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed border-l-2 border-primary-200 pl-3 my-3">
        "{review.comentario}"
      </p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
        <span className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-medium">
          <Building2 className="w-3 h-3" />
          {univName}
        </span>
        <span className="text-xs text-gray-400">{review.userEmail?.split('@')[0] ?? 'Anónimo'}</span>
      </div>
    </motion.div>
  )
}

export default function Buscar() {
  const [universidad, setUniversidad] = useState('')
  const [profesor, setProfesor] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [results, setResults] = useState<Review[] | null>(null)
  const { searchReviews, loading, error } = useReviews()
  const suggestRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!universidad || profesor.trim().length < 2) { setSuggestions([]); return }
    const timer = setTimeout(async () => {
      try {
        const q = query(collection(db, 'reviews'), where('universidad', '==', universidad))
        const snap = await getDocs(q)
        const names = Array.from(new Set(
          snap.docs.map(d => d.data().profesor as string)
            .filter(n => n.toLowerCase().includes(profesor.toLowerCase()))
        )).slice(0, 6)
        setSuggestions(names)
        setShowSuggestions(names.length > 0)
      } catch { setSuggestions([]) }
    }, 300)
    return () => clearTimeout(timer)
  }, [universidad, profesor])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!universidad || !profesor.trim()) return
    setShowSuggestions(false)
    const data = await searchReviews(universidad, profesor)
    setResults(data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-500 pt-12 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold text-white mb-2"
          >
            Buscar Profesor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-primary-100"
          >
            Encuentra reseñas y calificaciones de profesores en tu universidad
          </motion.p>
        </div>
      </div>

      {/* Search card — overlaps the teal header */}
      <div className="max-w-2xl mx-auto px-4 -mt-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Universidad</label>
            <select
              value={universidad}
              onChange={(e) => { setUniversidad(e.target.value); setProfesor(''); setSuggestions([]) }}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-colors"
            >
              <option value="">Selecciona tu universidad…</option>
              {Object.entries(UNIVERSIDADES).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          <div className="relative" ref={suggestRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del profesor</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={profesor}
                onChange={(e) => { setProfesor(e.target.value); setShowSuggestions(true) }}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                required
                placeholder="Ej. Juan García"
                autoComplete="off"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-colors"
              />
            </div>
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                >
                  {suggestions.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => { setProfesor(name); setShowSuggestions(false) }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-gray-50 last:border-0 flex items-center gap-2"
                    >
                      <Search className="w-3.5 h-3.5 text-gray-400" />
                      {name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white py-3.5 rounded-xl font-semibold hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary-200"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Buscar
          </button>
        </motion.form>
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && <p className="text-red-500 text-sm text-center mb-6">{error}</p>}

        {results !== null && (
          <div>
            <p className="text-sm text-gray-500 mb-5 font-medium">
              {results.length === 0
                ? '😕 No se encontraron reseñas para este profesor.'
                : `${results.length} reseña${results.length !== 1 ? 's' : ''} encontrada${results.length !== 1 ? 's' : ''}`}
            </p>
            <div className="space-y-4">
              {results.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
