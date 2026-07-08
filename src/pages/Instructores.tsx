import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { BadgeCheck, BookOpen, Loader2, Search, Sparkles } from 'lucide-react'
import { getPublicInstructors } from '../lib/instructors'
import type { PublicInstructor } from '../lib/instructors'

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

function InstructorCard({ instructor, index }: { instructor: PublicInstructor; index: number }) {
  const name = instructor.displayName?.trim() || 'Instructor Uniference'
  const initial = name.charAt(0).toUpperCase()
  const activeSubjects = (instructor.subjects ?? []).filter(s => s.status === 'active')
  const fromPrice = activeSubjects[0]

  return (
    <motion.div custom={index} variants={cardVariants} initial="hidden" animate="visible"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
      <div className="h-1.5 bg-gradient-to-r from-primary-400 to-primary-600" />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-sm">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-gray-900 truncate">{name}</h3>
              {instructor.isPremium && <BadgeCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />}
            </div>
            <p className="text-xs text-gray-400 truncate">{instructor.universities || 'Universidad no especificada'}</p>
          </div>
        </div>

        {instructor.bio && (
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{instructor.bio}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {activeSubjects.slice(0, 3).map(s => (
            <span key={s.id} className="inline-flex items-center gap-1 text-xs font-medium bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
              <BookOpen className="w-3 h-3" />
              {s.name}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          {fromPrice && (
            <div>
              <p className="text-xs text-gray-400">Desde</p>
              <p className="font-extrabold text-gray-900">{fromPrice.price}/{fromPrice.unit}</p>
            </div>
          )}
          <Link
            to={`/instructores/${instructor.uid}`}
            className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
          >
            Ver perfil
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function Instructores() {
  const [instructors, setInstructors] = useState<PublicInstructor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { document.title = 'Instructores | Uniference' }, [])

  useEffect(() => {
    getPublicInstructors().then(setInstructors).finally(() => setLoading(false))
  }, [])

  const filtered = search.trim()
    ? instructors.filter(i =>
        (i.displayName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (i.subjects ?? []).some(s => s.name.toLowerCase().includes(search.toLowerCase()))
      )
    : instructors

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-primary-500 pt-12 pb-24 px-4 overflow-hidden">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, i) => <li key={i} />)}
        </ul>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/15 text-white border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Instructores verificados
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Instructores
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-primary-100">
            Suscríbete a un instructor y desbloquea el chat directo para tus materias
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o materia..."
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
            />
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No hay instructores disponibles todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filtered.map((instructor, i) => (
              <InstructorCard key={instructor.uid} instructor={instructor} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
