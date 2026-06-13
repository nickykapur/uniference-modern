import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ArrowRight,
  BookOpenCheck,
  GraduationCap,
  Pencil,
  Search,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const menuItems = [
  { href: '#perfil', label: 'Perfil', icon: UserRound },
  { href: '#instructores', label: 'Mis instructores', icon: GraduationCap },
  { href: '#resenas', label: 'Mis reseñas', icon: Star },
  { href: '#accesos', label: 'Accesos rápidos', icon: ArrowRight },
]

const subscribedInstructors = [
  {
    name: 'Ana Rodríguez',
    subject: 'Cálculo I',
    university: 'UTP',
    status: 'Activo',
  },
  {
    name: 'Carlos Méndez',
    subject: 'Programación',
    university: 'Universidad de Panamá',
    status: 'Activo',
  },
  {
    name: 'Mariana Torres',
    subject: 'Estadística',
    university: 'USMA',
    status: 'Pendiente',
  },
]

const studentReviews = [
  {
    professor: 'Roberto García',
    subject: 'Física I',
    rating: 4.5,
    comment: 'Explica con claridad y suele dar buenos ejemplos para los parciales.',
  },
  {
    professor: 'Elena Vargas',
    subject: 'Matemáticas Discretas',
    rating: 5,
    comment: 'Muy buena metodología y bastante organizada con el contenido.',
  },
]

const quickLinks = [
  {
    to: '/buscar',
    title: 'Buscar Profesor',
    text: 'Encuentra reseñas antes de inscribirte.',
    icon: Search,
  },
  {
    to: '/tutores',
    title: 'Buscar Tutores',
    text: 'Conecta con estudiantes que pueden ayudarte.',
    icon: Users,
  },
  {
    to: '/evaluar',
    title: 'Evaluar',
    text: 'Comparte tu experiencia con la comunidad.',
    icon: Star,
  },
  {
    to: '/estudiante/vida-universitaria',
    title: 'Vida universitaria',
    text: 'Organiza tu semestre con GPA, grupos, apuntes y fechas clave.',
    icon: BookOpenCheck,
  },
]

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
        />
      ))}
      <span className="ml-1 text-xs font-bold text-gray-500">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function Estudiante() {
  const { user } = useAuth()
  const displayName = user?.displayName?.trim() || 'Estudiante Uniference'
  const email = user?.email ?? 'Correo pendiente'
  const initialSource = user?.displayName?.trim() || user?.email || 'E'
  const initial = initialSource.charAt(0).toUpperCase()

  useEffect(() => {
    document.title = 'Portal del estudiante | Uniference'
  }, [])

  // TODO: conectar perfil del estudiante con Firestore cuando esté disponible.
  const profile = {
    name: displayName,
    email,
    university: 'Universidad Tecnológica de Panamá',
    career: 'Ingeniería de Software',
    semester: '3er año / 2do semestre',
    status: 'Perfil en construcción',
  }

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
                Portal del estudiante
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.55 }}
                className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-4"
              >
                Hola, {displayName}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.5 }}
                className="text-primary-100 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0"
              >
                Organiza tus instructores, revisa tus aportes y accede rápido a las herramientas principales de Uniference.
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
        <motion.nav
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-3 grid grid-cols-2 lg:grid-cols-4 gap-2 mb-8"
          aria-label="Secciones del portal"
        >
          {menuItems.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </a>
          ))}
        </motion.nav>

        <section id="perfil" className="scroll-mt-24 mb-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex md:flex-col items-center md:items-start gap-4 md:w-52 flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-md">
                  {initial}
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
                    Perfil
                  </p>
                  <h2 className="text-2xl font-extrabold text-gray-900">Perfil del estudiante</h2>
                </div>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ['Nombre', profile.name],
                    ['Correo', profile.email],
                    ['Universidad', profile.university],
                    ['Carrera', profile.career],
                    ['Año/Semestre', profile.semester],
                    ['Estado', profile.status],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Estos datos serán editables cuando la configuración de cuenta esté disponible.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="instructores" className="scroll-mt-24 mb-8">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
                Seguimiento
              </p>
              <h2 className="text-2xl font-extrabold text-gray-900">Mis instructores</h2>
            </div>
            <Link to="/tutores" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700">
              Ver tutores
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* TODO: reemplazar instructores mock por suscripciones reales del estudiante. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscribedInstructors.map((instructor, i) => (
              <motion.article
                key={instructor.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center font-extrabold flex-shrink-0">
                    {instructor.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{instructor.name}</h3>
                    <p className="text-sm text-gray-500">{instructor.subject}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-4">{instructor.university}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    instructor.status === 'Activo'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {instructor.status}
                  </span>
                  <Link
                    to="/tutores"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Ver perfil
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="resenas" className="scroll-mt-24 mb-8">
          <div className="mb-4">
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
              Aportes
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900">Mis reseñas</h2>
          </div>

          {/* TODO: conectar reseñas reales del usuario y acciones de editar/eliminar. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentReviews.map((review, i) => (
              <motion.article
                key={review.professor}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{review.professor}</h3>
                    <p className="text-sm text-gray-400">{review.subject}</p>
                  </div>
                  <RatingStars rating={review.rating} />
                </div>
                <blockquote className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-2xl px-4 py-3 border-l-4 border-primary-400 mb-4">
                  "{review.comment}"
                </blockquote>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-400 bg-gray-50 cursor-not-allowed"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-3 py-2 text-sm font-semibold text-red-300 bg-red-50 cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-3">Acciones próximamente.</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="accesos" className="scroll-mt-24">
          <div className="mb-4">
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
              Herramientas
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900">Accesos rápidos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map(({ to, title, text, icon: Icon }, i) => (
              <motion.div
                key={to}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link
                  to={to}
                  className="group h-full bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{text}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:text-primary-700">
                    Abrir
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
