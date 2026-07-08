import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowRight, BadgeCheck, BookOpen, Loader2, MessageCircle, Sparkles } from 'lucide-react'
import { getPublicInstructor } from '../lib/instructors'
import type { PublicInstructor } from '../lib/instructors'
import { createSubscription } from '../lib/subscriptions'
import { createChat } from '../lib/chat'
import { useAuth } from '../context/AuthContext'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

export default function InstructorPerfil() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [instructor, setInstructor] = useState<PublicInstructor | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribingId, setSubscribingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => { document.title = 'Perfil de instructor | Uniference' }, [])

  useEffect(() => {
    if (!id) return
    getPublicInstructor(id).then(setInstructor).finally(() => setLoading(false))
  }, [id])

  const isSelf = !!user && user.uid === id
  const activeSubjects = (instructor?.subjects ?? []).filter(s => s.status === 'active')

  async function handleSubscribe(subject: NonNullable<PublicInstructor['subjects']>[number]) {
    if (!user || !id || !instructor) return
    setError('')
    setSubscribingId(subject.id)
    try {
      const studentName = user.displayName || user.email || 'Estudiante'
      const instructorName = instructor.displayName || 'Instructor Uniference'
      const price = `${subject.price}/${subject.unit}`

      const subscriptionId = await createSubscription({
        studentId: user.uid,
        studentName,
        instructorId: id,
        instructorName,
        subject: subject.name,
        price,
        status: 'active',
      })

      const chatId = await createChat({
        subscriptionId,
        studentId: user.uid,
        instructorId: id,
        studentName,
        instructorName,
        subject: subject.name,
        price,
        status: 'active',
      })

      navigate(`/chat/${chatId}`)
    } catch {
      setError('No pudimos completar la suscripción. Intenta de nuevo.')
    } finally {
      setSubscribingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  if (!instructor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg font-bold text-gray-900 mb-2">Instructor no encontrado</p>
        <Link to="/instructores" className="text-primary-600 font-semibold hover:underline">Ver todos los instructores</Link>
      </div>
    )
  }

  const name = instructor.displayName?.trim() || 'Instructor Uniference'
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-primary-500 to-primary-700 px-4 pt-14 pb-24 overflow-hidden">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, i) => <li key={i} />)}
        </ul>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/15 text-white border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] mb-5"
              >
                <Sparkles className="w-4 h-4" />
                Perfil de instructor
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.55 }}
                className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-3 flex items-center gap-2 justify-center md:justify-start"
              >
                {name}
                {instructor.isPremium && <BadgeCheck className="w-8 h-8 text-amber-300 flex-shrink-0" />}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.5 }}
                className="text-primary-100 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0"
              >
                {instructor.universities || 'Universidad no especificada'}
                {instructor.specialty ? ` · ${instructor.specialty}` : ''}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.22, duration: 0.5 }}
              className="mx-auto md:mx-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/15 border border-white/25 p-2 shadow-2xl"
            >
              <div className="w-full h-full rounded-full bg-white text-primary-600 flex items-center justify-center text-4xl font-extrabold">
                {initial}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-12 pb-16 relative z-20">
        {isSelf && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible"
            className="bg-white rounded-3xl border border-primary-100 shadow-sm p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">Esta es tu vista pública. Los estudiantes verán esta información para decidir si suscribirse.</p>
            <Link to="/instructor" className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors flex-shrink-0">
              Editar mi perfil
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        {instructor.bio && (
          <motion.section variants={fadeUp} initial="hidden" animate="visible"
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-2">Sobre mí</p>
            <p className="text-gray-600 leading-relaxed">{instructor.bio}</p>
          </motion.section>
        )}

        <section>
          <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">Oferta</p>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Materias disponibles</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-5">
              {error}
            </div>
          )}

          {activeSubjects.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
              <p className="text-gray-400 text-sm">Este instructor no tiene materias activas todavía.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeSubjects.map((subject, i) => (
                <motion.article
                  key={subject.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{subject.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{subject.description}</p>
                  <p className="text-sm font-extrabold text-gray-900 mb-4">{subject.price}/{subject.unit}</p>

                  {isSelf ? (
                    <p className="text-xs text-gray-400 text-center">No puedes suscribirte a tu propio perfil.</p>
                  ) : !user ? (
                    <Link to="/login"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors w-full">
                      Inicia sesión para suscribirte
                    </Link>
                  ) : user.role === 'instructor' ? (
                    <p className="text-xs text-gray-400 text-center">Solo estudiantes pueden suscribirse.</p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSubscribe(subject)}
                      disabled={subscribingId === subject.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors w-full disabled:opacity-60"
                    >
                      {subscribingId === subject.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <MessageCircle className="w-4 h-4" />
                      }
                      Suscribirse
                    </button>
                  )}
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
