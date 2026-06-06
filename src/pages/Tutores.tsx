import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { BookOpen, Phone, Clock, Search, UserPlus, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { Tutor } from '../types'
import { UNIVERSIDADES } from '../types'

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const UNI_COLORS: Record<string, string> = {
  utp:      'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
  latina:   'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
  nacional: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
  usma:     'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
  isae:     'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
  umecit:   'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100',
}
const UNI_ACTIVE: Record<string, string> = {
  utp:      'bg-blue-500 border-blue-500 text-white',
  latina:   'bg-orange-500 border-orange-500 text-white',
  nacional: 'bg-red-500 border-red-500 text-white',
  usma:     'bg-purple-500 border-purple-500 text-white',
  isae:     'bg-green-500 border-green-500 text-white',
  umecit:   'bg-teal-500 border-teal-500 text-white',
}

function TutorCard({ tutor, index }: { tutor: Tutor; index: number }) {
  const univName = UNIVERSIDADES[tutor.universidad as keyof typeof UNIVERSIDADES] ?? tutor.universidad
  const initial = tutor.nombre.charAt(0).toUpperCase()

  return (
    <motion.div custom={index} variants={cardVariants} initial="hidden" animate="visible"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
      <div className="h-1.5 bg-gradient-to-r from-primary-400 to-primary-600" />
      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-sm">
            {tutor.fotoUrl
              ? <img src={tutor.fotoUrl} alt={tutor.nombre} className="w-full h-full object-cover" />
              : initial
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{tutor.nombre}</h3>
            <p className="text-xs text-gray-400 truncate">{tutor.carrera}</p>
            <span className="inline-block mt-1 text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">
              {univName}
            </span>
          </div>
        </div>

        {/* Materia */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 bg-gray-50 rounded-lg px-3 py-2">
          <BookOpen className="w-4 h-4 text-primary-400 flex-shrink-0" />
          <span className="font-medium">{tutor.materia}</span>
        </div>

        {/* Disponibilidad */}
        {tutor.disponibilidad?.length > 0 && (
          <div className="flex items-start gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {tutor.disponibilidad.map(d => (
                <span key={d} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  {d.split('(')[0].trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tarifa */}
        <div className="mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            tutor.tarifa === 'gratis'
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {tutor.tarifa === 'gratis' ? '🎁 Gratis' : `💰 ${tutor.precio || 'De pago'}`}
          </span>
        </div>

        {/* Why good tutor */}
        <blockquote className="text-xs text-gray-500 italic bg-gray-50 rounded-lg px-3 py-2 border-l-4 border-primary-300 mb-4 line-clamp-2 flex-1">
          "{tutor.porQueGoodTutor}"
        </blockquote>

        {/* Contact button */}
        <a
          href={`https://wa.me/${tutor.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors shadow-sm"
        >
          <Phone className="w-4 h-4" />
          Contactar por WhatsApp
        </a>
      </div>
    </motion.div>
  )
}

export default function Tutores() {
  const [tutores, setTutores] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(true)
  const [universidad, setUniversidad] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => { document.title = 'Tutores Universitarios en Panamá | Uniference' }, [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const q = universidad
          ? query(collection(db, 'tutors'), where('universidad', '==', universidad), where('aceptado', '==', true))
          : query(collection(db, 'tutors'), where('aceptado', '==', true))
        const snap = await getDocs(q)
        setTutores(snap.docs.map(d => ({ id: d.id, ...d.data() } as Tutor)))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [universidad])

  const filtered = search.trim()
    ? tutores.filter(t =>
        t.materia.toLowerCase().includes(search.toLowerCase()) ||
        t.nombre.toLowerCase().includes(search.toLowerCase())
      )
    : tutores

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Teal header */}
      <div className="relative bg-primary-500 pt-12 pb-24 px-4 overflow-hidden">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, i) => <li key={i} />)}
        </ul>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Tutores Disponibles
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-primary-100">
            Encuentra estudiantes avanzados que pueden ayudarte con tus materias
          </motion.p>
        </div>
      </div>

      {/* Filter card */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
          {/* University pills */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Filtrar por universidad</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <button type="button" onClick={() => setUniversidad('')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                !universidad ? 'bg-gray-800 border-gray-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}>
              Todos
            </button>
            {Object.entries(UNIVERSIDADES).map(([key]) => (
              <button key={key} type="button" onClick={() => setUniversidad(universidad === key ? '' : key)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  universidad === key ? UNI_ACTIVE[key] : UNI_COLORS[key]
                }`}>
                {key.toUpperCase()}
              </button>
            ))}
          </div>
          {/* Search by materia */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por materia o nombre..."
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
            />
          </div>
        </motion.div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-400">
            <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-600">No hay tutores disponibles aún</p>
            <p className="text-sm mt-1 mb-6">¡Sé el primero en postularte!</p>
            <Link to="/tutores/postular"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-md">
              <UserPlus className="w-4 h-4" />
              Postularse como tutor
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((t, i) => <TutorCard key={t.id} tutor={t} index={i} />)}
            </div>
          </AnimatePresence>
        )}

        {/* CTA banner */}
        {!loading && filtered.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-center shadow-lg">
            <h2 className="text-xl font-bold text-white mb-2">¿Eres bueno en tu materia?</h2>
            <p className="text-primary-100 text-sm mb-5">
              Postúlate como tutor y ayuda a otros estudiantes mientras ganas experiencia.
            </p>
            <Link to="/tutores/postular"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-sm">
              <UserPlus className="w-4 h-4" />
              Postularse como tutor
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
