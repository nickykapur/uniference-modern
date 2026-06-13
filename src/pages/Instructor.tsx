import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Crown,
  DollarSign,
  Megaphone,
  Pencil,
  Plus,
  Sparkles,
  Star,
  Trash2,
  UserRoundCheck,
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
  { href: '#perfil', label: 'Perfil', icon: UserRoundCheck },
  { href: '#materias', label: 'Materias', icon: BookOpen },
  { href: '#vista-publica', label: 'Vista pública', icon: BriefcaseBusiness },
  { href: '#estadisticas', label: 'Estadísticas', icon: Star },
  { href: '#disponibilidad', label: 'Disponibilidad', icon: CalendarDays },
]

const subjects = [
  {
    name: 'Programación I',
    description: 'Fundamentos de lógica, variables, ciclos y resolución de problemas.',
    price: '$15/hora',
    status: 'Activa',
  },
  {
    name: 'Cálculo I',
    description: 'Límites, derivadas y práctica para parciales.',
    price: '$12/sesión',
    status: 'Activa',
  },
  {
    name: 'Estructuras de Datos',
    description: 'Listas, pilas, colas, árboles y análisis básico de complejidad.',
    price: '$18/hora',
    status: 'Borrador',
  },
]

const stats = [
  { label: 'Estudiantes suscritos', value: '24', icon: Users, tone: 'bg-primary-50 text-primary-600' },
  { label: 'Ingresos estimados', value: '$360', icon: DollarSign, tone: 'bg-emerald-50 text-emerald-600' },
  { label: 'Calificación promedio', value: '4.8', icon: Star, tone: 'bg-amber-50 text-amber-600' },
  { label: 'Materias activas', value: '3', icon: BookOpen, tone: 'bg-blue-50 text-blue-600' },
]

const availability = [
  { day: 'Lunes', time: '6:00 p.m. - 8:00 p.m.', available: true },
  { day: 'Martes', time: 'No disponible', available: false },
  { day: 'Miércoles', time: '5:00 p.m. - 7:00 p.m.', available: true },
  { day: 'Jueves', time: '6:00 p.m. - 8:00 p.m.', available: true },
  { day: 'Viernes', time: 'No disponible', available: false },
  { day: 'Sábado', time: '9:00 a.m. - 12:00 p.m.', available: true },
  { day: 'Domingo', time: 'No disponible', available: false },
]

// TODO: reemplazar estado premium mock por estado real del instructor desde Firestore/subscription billing.
const isPremiumInstructor = true

function DisabledActionButton({ icon: Icon, label, danger = false }: {
  icon: typeof Pencil
  label: string
  danger?: boolean
}) {
  return (
    <button
      type="button"
      disabled
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold cursor-not-allowed ${
        danger
          ? 'border-red-100 bg-red-50 text-red-300'
          : 'border-gray-200 bg-gray-50 text-gray-400'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}

export default function Instructor() {
  const { user } = useAuth()
  const displayName = user?.displayName?.trim() || 'Instructor Uniference'
  const email = user?.email ?? 'Correo pendiente'
  const initialSource = user?.displayName?.trim() || user?.email || 'I'
  const initial = initialSource.charAt(0).toUpperCase()

  useEffect(() => {
    document.title = 'Portal del instructor | Uniference'
  }, [])

  // TODO: conectar perfil del instructor con Firestore cuando esté disponible.
  const profile = {
    name: displayName,
    email,
    bio: 'Estudiante avanzado con experiencia ayudando a compañeros a comprender temas complejos de forma simple.',
    universities: 'Universidad Tecnológica de Panamá, Universidad de Panamá',
    experience: '2 años',
    specialty: 'Programación y matemáticas',
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
                Portal del instructor
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
                Administra tu perfil, organiza tus materias y muestra a los estudiantes cómo puedes ayudarlos a aprender mejor.
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
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-3 grid grid-cols-2 lg:grid-cols-5 gap-2 mb-8"
          aria-label="Secciones del portal del instructor"
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

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl border border-amber-100 shadow-sm p-5 sm:p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-center">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-2xl font-extrabold text-gray-900">Instructor Premium</h2>
                  {isPremiumInstructor && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold rounded-full bg-amber-100 text-amber-700 px-2.5 py-1">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Destaca tus materias y administra anuncios promocionales para que más estudiantes encuentren tu perfil.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-2">
              <Link
                to="/instructor/premium"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
              >
                Impulsar mi perfil con Premium
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/instructor/anuncios"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Megaphone className="w-4 h-4" />
                Gestionar mis anuncios
              </Link>
            </div>
          </div>
        </motion.section>

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
                  <h2 className="text-2xl font-extrabold text-gray-900">Perfil del instructor</h2>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ['Nombre', profile.name],
                    ['Correo', profile.email],
                    ['Universidad(es)', profile.universities],
                    ['Años de experiencia', profile.experience],
                    ['Especialidad principal', profile.specialty],
                    ['Estado', profile.status],
                  ].map(([label, value]) => (
                    <label key={label} className="block">
                      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                        {label}
                      </span>
                      <input
                        value={value}
                        disabled
                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 disabled:opacity-100"
                        readOnly
                      />
                    </label>
                  ))}
                </div>
                <label className="block">
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Bio
                  </span>
                  <textarea
                    value={profile.bio}
                    disabled
                    rows={3}
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 resize-none disabled:opacity-100"
                    readOnly
                  />
                </label>
                <p className="text-xs text-gray-400">
                  Estos datos serán editables cuando la configuración del instructor esté disponible.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="materias" className="scroll-mt-24 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
                Oferta
              </p>
              <h2 className="text-2xl font-extrabold text-gray-900">Materias que enseñas</h2>
            </div>
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-400 cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Agregar materia
            </button>
          </div>

          {/* TODO: reemplazar materias mock por CRUD real conectado a Firestore. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subjects.map((subject, i) => (
              <motion.article
                key={subject.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-gray-900">{subject.name}</h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    subject.status === 'Activa'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {subject.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{subject.description}</p>
                <p className="text-sm font-extrabold text-gray-900 mb-4">{subject.price}</p>
                <div className="grid grid-cols-2 gap-2">
                  <DisabledActionButton icon={Pencil} label="Editar" />
                  <DisabledActionButton icon={Trash2} label="Eliminar" danger />
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="vista-publica" className="scroll-mt-24 mb-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="h-2 bg-gradient-to-r from-primary-400 to-primary-600" />
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-start">
                <div>
                  <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-2">
                    Vista pública
                  </p>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
                    Cómo verán tu perfil los estudiantes
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Esta vista será la referencia pública que los estudiantes consultarán antes de solicitar apoyo.
                  </p>
                </div>

                <div className="rounded-3xl bg-gray-50 border border-gray-100 p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center text-xl font-extrabold shadow-sm">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-gray-900 truncate">{profile.name}</h3>
                        {isPremiumInstructor && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">
                            <Crown className="w-3 h-3" />
                            Verificado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">Universidad Tecnológica de Panamá</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-xs font-bold text-gray-500">4.8</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{profile.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Programación I', 'Cálculo I', 'Estructuras de Datos'].map((subject) => (
                      <span key={subject} className="text-xs font-semibold rounded-full bg-primary-50 text-primary-700 px-2.5 py-1">
                        {subject}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Desde</p>
                      <p className="font-extrabold text-gray-900">$12/sesión</p>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary-500/50 px-4 py-2 text-sm font-semibold text-white cursor-not-allowed"
                    >
                      Vista previa
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    {/* TODO: conectar botón de suscripción con checkout real cuando la pasarela de pago esté disponible. */}
                    <Link
                      to="/suscripciones"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                    >
                      Suscribirme por $15/hora
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <p className="text-xs text-gray-400 mt-2">
                      El pago y la activación de la suscripción se conectarán en una integración posterior.
                    </p>
                  </div>
                </div>
              </div>
              {/* TODO: conectar vista pública con perfil real del instructor. */}
            </div>
          </motion.div>
        </section>

        <section id="estadisticas" className="scroll-mt-24 mb-8">
          <div className="mb-4">
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
              Dashboard
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900">Estadísticas básicas</h2>
          </div>

          {/* TODO: conectar estadísticas reales cuando existan suscripciones y pagos. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, tone }, i) => (
              <motion.div
                key={label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${tone}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Estadísticas de ejemplo. Se actualizarán cuando existan suscripciones reales.
          </p>
        </section>

        <section id="disponibilidad" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
                Horario
              </p>
              <h2 className="text-2xl font-extrabold text-gray-900">Disponibilidad semanal</h2>
            </div>
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-400 cursor-not-allowed"
            >
              <Pencil className="w-4 h-4" />
              Editar disponibilidad
            </button>
          </div>

          {/* TODO: conectar disponibilidad real del instructor con Firestore. */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {availability.map((slot) => (
                <div
                  key={slot.day}
                  className={`rounded-2xl border p-4 ${
                    slot.available
                      ? 'border-primary-100 bg-primary-50/70'
                      : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <p className="font-bold text-gray-900 mb-1">{slot.day}</p>
                  <p className={`text-sm leading-relaxed ${slot.available ? 'text-primary-700' : 'text-gray-400'}`}>
                    {slot.time}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}
