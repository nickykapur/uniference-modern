import { useState, useEffect, useRef, useMemo } from 'react'
import { Search, Loader2, Star, BookOpen, Building2, MessageSquarePlus, Mail, X, ExternalLink } from 'lucide-react'
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useReviews } from '../hooks/useReviews'
import type { Review } from '../types'
import { UNIVERSIDADES } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import PremiumInstructorAd from '../components/PremiumInstructorAd'
import { getActiveAnnouncements } from '../lib/announcements'
import type { Announcement } from '../lib/announcements'

const PAGE_TITLE = 'Buscar Profesor – Reseñas de Universidades en Panamá | Uniference'

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  }),
}

const UNI_CHIP = 'bg-white border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-primary-50/60'
const UNI_CHIP_ACTIVE = 'bg-primary-500 border-primary-500 text-white shadow-sm'

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-4 h-4 ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  )
}

function RatingBadge({ value }: { value: number }) {
  const color = value >= 4 ? 'bg-green-100 text-green-700' : value >= 3 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
  return (
    <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${color}`}>
      {value.toFixed(1)}
    </span>
  )
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const univName = UNIVERSIDADES[review.universidad as keyof typeof UNIVERSIDADES] ?? review.universidad
  const profesor = review.profesor ?? '—'
  const materia = review.materia ?? '—'
  const comentario = typeof review.comentario === 'string' ? review.comentario : ''
  const rating = Number(review.rating) || 0
  return (
    <motion.div
      custom={index} variants={cardVariants} initial="hidden" animate="visible"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
    >
      <div className="h-1.5 bg-gradient-to-r from-primary-400 to-primary-600" />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-sm">
              {profesor.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{profesor}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <BookOpen className="w-3 h-3" />
                <span>{materia}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <StarDisplay value={rating} />
            <RatingBadge value={rating} />
          </div>
        </div>

        <blockquote className="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border-l-4 border-primary-400 italic">
          "{comentario}"
        </blockquote>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <span className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-medium">
            <Building2 className="w-3 h-3" />
            {univName}
          </span>
          <span className="text-xs text-gray-400">@{review.userEmail?.split('@')[0] ?? 'anónimo'}</span>
        </div>
      </div>
    </motion.div>
  )
}

function AggregateBar({ profesor, reviews }: { profesor?: string; reviews: Review[] }) {
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
  const dist = [5,4,3,2,1].map(n => ({ star: n, count: reviews.filter(r => r.rating === n).length }))
  const materias = Array.from(new Set(reviews.map(r => r.materia).filter(Boolean))).slice(0, 3)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4 overflow-hidden"
    >
      {profesor && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
            {profesor.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 text-lg truncate">{profesor}</h2>
            {materias.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {materias.map(m => (
                  <span key={m} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">{m}</span>
                ))}
              </div>
            )}
          </div>
          <RatingBadge value={avg} />
        </div>
      )}
      <div className="flex items-center gap-6">
        <div className="text-center flex-shrink-0">
          <p className="text-4xl font-extrabold text-gray-900">{avg.toFixed(1)}</p>
          <StarDisplay value={Math.round(avg)} />
          <p className="text-xs text-gray-400 mt-1">{reviews.length} reseña{reviews.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {dist.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-3 text-right">{star}</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
              <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="h-full bg-amber-400 rounded-full"
                />
              </div>
              <span className="w-4">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── PREMIUM INSTRUCTOR AD ────────────────────────────────────────────────────
function PremiumAdSlot({ universidad }: { universidad: string }) {
  const [ad, setAd] = useState<Announcement | null>(null)
  const uniName = UNIVERSIDADES[universidad as keyof typeof UNIVERSIDADES] ?? universidad

  useEffect(() => {
    let active = true
    getActiveAnnouncements()
      .then(ads => {
        if (!active) return
        setAd(ads.find(a => a.university === uniName) ?? ads[0] ?? null)
      })
      .catch(() => setAd(null))
    return () => { active = false }
  }, [uniName])

  if (!ad) return null

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <PremiumInstructorAd
        instructorName={ad.instructorName}
        subject={ad.subject}
        description={ad.description}
        priceLabel={ad.price}
        university={ad.university ?? uniName}
        ctaLabel={ad.cta}
        ctaHref="/instructor"
      />
    </motion.div>
  )
}

// ── AFFILIATE LINKS ───────────────────────────────────────────────────────────
// Sign up at coursera.org/affiliate and udemy.com/affiliate, then replace the IDs.
const COURSERA_AFFILIATE = 'YOUR_COURSERA_AFFILIATE_ID'  // replace after signing up
const UDEMY_AFFILIATE    = 'YOUR_UDEMY_AFFILIATE_ID'     // replace after signing up

function AffiliateLinks({ profesor, universidad }: { profesor: string; universidad: string }) {
  const uniName = UNIVERSIDADES[universidad as keyof typeof UNIVERSIDADES] ?? universidad
  const keyword = encodeURIComponent(profesor)
  const courseraUrl = `https://www.coursera.org/search?query=${keyword}&utm_medium=uniference&utm_source=affiliate&siteID=${COURSERA_AFFILIATE}`
  const udemyUrl    = `https://www.udemy.com/courses/search/?q=${keyword}&utm_source=uniference-aff&affiliate_id=${UDEMY_AFFILIATE}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 mb-6"
    >
      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Recursos para reforzar</p>
      <p className="text-sm font-medium text-gray-700 mb-4">
        ¿Quieres reforzar lo que aprendes en {uniName}? Encuentra cursos online relacionados:
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={courseraUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-between gap-2 bg-white border border-indigo-100 rounded-xl px-4 py-3 hover:border-indigo-300 hover:shadow-sm transition-all group"
        >
          <div>
            <p className="font-semibold text-gray-900 text-sm">Coursera</p>
            <p className="text-gray-400 text-xs">Cursos universitarios certificados</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
        </a>
        <a
          href={udemyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-between gap-2 bg-white border border-purple-100 rounded-xl px-4 py-3 hover:border-purple-300 hover:shadow-sm transition-all group"
        >
          <div>
            <p className="font-semibold text-gray-900 text-sm">Udemy</p>
            <p className="text-gray-400 text-xs">Miles de cursos en español</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors flex-shrink-0" />
        </a>
      </div>
    </motion.div>
  )
}

// ── EMAIL CAPTURE ─────────────────────────────────────────────────────────────
function EmailCapture({ universidad }: { universidad: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('email_capture_done') === '1')
  const uniName = UNIVERSIDADES[universidad as keyof typeof UNIVERSIDADES] ?? 'tu universidad'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      await addDoc(collection(db, 'emailList'), {
        email: email.trim().toLowerCase(),
        universidad,
        source: 'buscar',
        createdAt: serverTimestamp(),
      })
      setStatus('done')
      sessionStorage.setItem('email_capture_done', '1')
    } catch {
      setStatus('error')
    }
  }

  if (dismissed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm relative"
    >
      <button
        onClick={() => { setDismissed(true); sessionStorage.setItem('email_capture_done', '1') }}
        className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {status === 'done' ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-2">
          <p className="font-semibold text-gray-900 text-sm">Listo. Te avisaremos antes del próximo semestre.</p>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-primary-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Recibe alertas de reseñas</p>
              <p className="text-gray-400 text-xs">Te avisamos cuando lleguen nuevas reseñas de {uniName}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Suscribir'}
            </button>
          </form>
          {status === 'error' && <p className="text-red-400 text-xs mt-2">Error al guardar. Intenta de nuevo.</p>}
          <p className="text-gray-300 text-xs mt-2">Sin spam. Solo antes de cada semestre.</p>
        </>
      )}
    </motion.div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Buscar() {
  const [universidad, setUniversidad] = useState('')
  const [profesor, setProfesor] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [results, setResults] = useState<Review[] | null>(null)
  const [highlightUnis, setHighlightUnis] = useState<string[]>([])
  const { searchReviews, loading, error, suggestions: fuzzySuggestions } = useReviews()
  const suggestRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Group results by professor so multi-professor matches each get their own
  // header card with aggregate rating (most-reviewed professor first)
  const grouped = useMemo(() => {
    if (!results) return []
    const map = new Map<string, Review[]>()
    for (const r of results) map.set(r.profesor, [...(map.get(r.profesor) ?? []), r])
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length)
  }, [results])

  useEffect(() => { document.title = PAGE_TITLE }, [])

  // Handle a professor search coming from the homepage search bar:
  // auto-select + auto-search if the professor is at one university,
  // or highlight the matching universities so the user can pick
  useEffect(() => {
    const state = location.state as
      | { profesor?: string; universidad?: string; universidades?: string[]; autoSearch?: boolean }
      | null
    if (!state?.profesor) return

    const t = setTimeout(() => {
      setProfesor(state.profesor!)

      if (state.universidad && state.autoSearch) {
        setUniversidad(state.universidad)
        searchReviews(state.universidad, state.profesor!).then(setResults)
      } else if (state.universidades?.length) {
        setHighlightUnis(state.universidades)
      }
    }, 0)

    // Clear the navigation state so a page refresh doesn't repeat this
    window.history.replaceState({}, document.title)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!universidad || profesor.trim().length < 2) {
      const timer = setTimeout(() => setSuggestions([]), 0)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(async () => {
      try {
        const q = query(collection(db, 'reviews'), where('universidad', '==', universidad))
        const snap = await getDocs(q)
        const names = Array.from(new Set(
          snap.docs
            .filter(d => d.data().aceptado === true)
            .map(d => d.data().profesor as string)
            .filter(n => n.toLowerCase().includes(profesor.toLowerCase()))
        )).slice(0, 6)
        setSuggestions(names)
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
    const data = await searchReviews(universidad, profesor.trim())
    setResults(data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-primary-500 pt-12 pb-24 px-4 overflow-hidden">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, i) => <li key={i} />)}
        </ul>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Buscar Profesor
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-primary-100">
            Encuentra reseñas y calificaciones de profesores en tu universidad
          </motion.p>
        </div>
      </div>

      {/* Search card */}
      <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100">

          <div className="p-5 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Universidad</p>
            {highlightUnis.length > 0 && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="text-xs text-primary-600 bg-primary-50 rounded-lg px-3 py-2 mb-3">
                ✨ <strong>{profesor}</strong> tiene reseñas en {highlightUnis.map(u => u.toUpperCase()).join(' y ')} — selecciona una para ver
              </motion.p>
            )}
            <div className="flex flex-wrap gap-2">
              {Object.entries(UNIVERSIDADES).map(([key]) => (
                <button
                  key={key}
                  type="button"
                  onClick={async () => {
                    setUniversidad(key)
                    setSuggestions([])
                    if (highlightUnis.includes(key) && profesor.trim()) {
                      setHighlightUnis([])
                      setResults(await searchReviews(key, profesor.trim()))
                    } else {
                      setProfesor('')
                      setResults(null)
                      setHighlightUnis([])
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    universidad === key ? UNI_CHIP_ACTIVE : UNI_CHIP
                  } ${highlightUnis.includes(key) ? 'ring-2 ring-primary-400 ring-offset-1' : ''}`}
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>
            {universidad && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-xs text-gray-400 mt-2">
                {UNIVERSIDADES[universidad as keyof typeof UNIVERSIDADES]}
              </motion.p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-3">
            <div className="relative" ref={suggestRef}>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={profesor}
                  onChange={(e) => { setProfesor(e.target.value); setShowSuggestions(true) }}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  required
                  disabled={!universidad}
                  placeholder={universidad ? 'Nombre del profesor…' : 'Selecciona primero una universidad'}
                  autoComplete="off"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                  >
                    {suggestions.map((name) => (
                      <button key={name} type="button"
                        onClick={() => { setProfesor(name); setShowSuggestions(false) }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-gray-50 last:border-0 flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        {name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button type="submit" disabled={loading || !universidad}
              className="w-full bg-primary-500 text-white py-3.5 rounded-xl font-semibold hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] shadow-md">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Buscar
            </button>
          </form>
        </motion.div>
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && <p className="text-red-500 text-sm text-center mb-6">{error}</p>}

        {results === null && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-center py-16 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Busca a tu profesor arriba</p>
            <p className="text-sm mt-1">Selecciona tu universidad y escribe el nombre</p>
          </motion.div>
        )}

        {results !== null && results.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquarePlus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700 mb-1">Sin reseñas todavía</p>
            <p className="text-sm text-gray-400 mb-5">No encontramos reseñas para ese nombre</p>

            {fuzzySuggestions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-3">¿Quisiste decir...?</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {fuzzySuggestions.map(name => (
                    <button key={name} type="button"
                      onClick={async () => {
                        setProfesor(name)
                        const data = await searchReviews(universidad, name)
                        setResults(data)
                      }}
                      className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors">
                      <Search className="w-3.5 h-3.5" />
                      {name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <Link to="/evaluar"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-600 transition-colors text-sm">
              <MessageSquarePlus className="w-4 h-4" />
              Dejar una reseña
            </Link>
          </motion.div>
        )}

        {results !== null && results.length > 0 && (
          <div>
            {/* Premium instructor ad — always shown when a university is selected */}
            {universidad && <PremiumAdSlot universidad={universidad} />}

            <div className="space-y-8 mb-6">
              {grouped.map(([name, revs]) => (
                <div key={name}>
                  <AggregateBar profesor={name} reviews={revs} />
                  <div className="space-y-4">
                    {revs.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)}
                  </div>
                </div>
              ))}
            </div>

            {/* Affiliate links — shown after results */}
            <AffiliateLinks profesor={profesor} universidad={universidad} />

            {/* Email capture — shown last, dismissible */}
            <EmailCapture universidad={universidad} />
          </div>
        )}
      </div>
    </div>
  )
}
