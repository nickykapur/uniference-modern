import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Users, ArrowRight, BookOpen, TrendingUp, MessageSquare, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }),
}

const stats = [
  { label: 'Reseñas publicadas', value: '1,200+' },
  { label: 'Profesores evaluados', value: '340+' },
  { label: 'Universidades', value: '6' },
  { label: 'Estudiantes activos', value: '800+' },
]

const UNIS = [
  { key: 'utp',      name: 'UTP',          full: 'Universidad Tecnológica de Panamá',   bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  { key: 'nacional', name: 'U. de Panamá', full: 'Universidad de Panamá',               bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    dot: 'bg-red-400' },
  { key: 'latina',   name: 'Latina',       full: 'Universidad Latina de Panamá',        bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-400' },
  { key: 'usma',     name: 'USMA',         full: 'Univ. Santa María La Antigua',        bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-400' },
  { key: 'isae',     name: 'ISAE',         full: 'ISAE Universidad',                    bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  dot: 'bg-green-400' },
  { key: 'umecit',   name: 'UMECIT',       full: 'UMECIT',                              bg: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-700',   dot: 'bg-teal-400' },
]

export default function Home() {
  useEffect(() => {
    document.title = 'Uniference – Reseñas de Profesores en Panamá | UTP, UP, Latina, USMA'
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative bg-primary-500 overflow-hidden min-h-[580px] flex items-center">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, i) => <li key={i} />)}
        </ul>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center w-full">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <img src="/logo.png" alt="Uniference" className="w-24 h-24 drop-shadow-2xl" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-primary-100 text-xs font-semibold uppercase tracking-[0.2em] mb-4"
          >
            La referencia estudiantil de Panamá
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
            className="text-5xl sm:text-6xl font-extrabold leading-tight mb-5"
          >
            <span className="text-white">Busca. Comenta.</span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-emerald-300">
              Apoya.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="text-primary-100 text-lg max-w-xl mx-auto mb-10"
          >
            Reseñas honestas de profesores en las universidades de Panamá, por estudiantes para estudiantes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/buscar"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              <Search className="w-5 h-5" />
              Buscar Profesor
            </Link>
            <Link
              to="/evaluar"
              className="inline-flex items-center gap-2 bg-primary-700 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-900 transition-all hover:scale-105 active:scale-95"
            >
              Dejar una reseña
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-primary-700">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-primary-200 text-xs mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BENTO GRID FEATURES ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">¿Cómo funciona?</h2>
          <p className="text-gray-500 max-w-lg mx-auto">Reseñas verificadas, tutores disponibles y búsqueda por universidad.</p>
        </motion.div>

        {/* Bento grid: 2 rows, asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* Large card — Search */}
          <motion.div
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="md:col-span-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 text-white flex flex-col justify-between min-h-[220px] hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Busca antes de inscribirte</h3>
              <p className="text-primary-100 text-sm leading-relaxed">Revisa opiniones reales de otros estudiantes sobre el profesor antes de elegirlo este semestre.</p>
            </div>
            <Link to="/buscar" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white transition-colors">
              Buscar ahora <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Tall card — Rate */}
          <motion.div
            variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="md:col-span-2 bg-amber-50 border border-amber-100 rounded-3xl p-8 flex flex-col justify-between min-h-[220px] hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Evalúa a tu profesor</h3>
              <p className="text-gray-500 text-sm">Califica con estrellas y deja un comentario detallado sobre tu experiencia.</p>
            </div>
            <Link to="/evaluar" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
              Evaluar <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Small card — Tutors */}
          <motion.div
            variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="md:col-span-2 bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex flex-col justify-between min-h-[200px] hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Encuentra tutores</h3>
              <p className="text-gray-500 text-sm">Conecta con estudiantes que ofrecen tutorías en tu universidad.</p>
            </div>
            <Link to="/tutores" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
              Ver tutores <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Wide card — Trusted */}
          <motion.div
            variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="md:col-span-3 bg-gray-900 rounded-3xl p-8 flex flex-col justify-between min-h-[200px] hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Reseñas moderadas y verificadas</h3>
              <p className="text-gray-400 text-sm">Cada reseña pasa por revisión antes de publicarse. Sin spam, sin falsificaciones — solo opiniones reales.</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── UNIVERSITIES ── */}
      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Universidades en Panamá</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Cubrimos las principales universidades del país. ¿Estudias en alguna de estas?</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {UNIS.map((u, i) => (
              <motion.div
                key={u.key}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              >
                <Link
                  to={`/buscar`}
                  className={`group flex items-center gap-3 ${u.bg} border ${u.border} rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${u.dot} flex-shrink-0`} />
                  <div className="min-w-0">
                    <p className={`${u.text} font-bold text-sm`}>{u.name}</p>
                    <p className="text-gray-400 text-xs truncate">{u.full}</p>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${u.text} opacity-0 group-hover:opacity-100 ml-auto transition-opacity flex-shrink-0`} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Eres estudiante en Panamá?</h2>
            <p className="text-gray-500 mb-8">
              Uniference te ayuda a conocer a tus profesores antes de inscribirte. Lee lo que otros estudiantes dicen y toma decisiones más inteligentes.
            </p>
            <div className="space-y-4">
              {[
                { icon: <BookOpen className="w-5 h-5 text-primary-500" />, text: 'Busca el nombre de tu profesor', sub: 'Por nombre o materia en tu universidad' },
                { icon: <Star className="w-5 h-5 text-primary-500" />, text: 'Lee las calificaciones y comentarios', sub: 'Reseñas verificadas de otros estudiantes' },
                { icon: <TrendingUp className="w-5 h-5 text-primary-500" />, text: 'Elige mejor y apoya tu comunidad', sub: 'Comparte tu propia experiencia' },
              ].map((step) => (
                <div key={step.text} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">{step.icon}</div>
                  <div>
                    <p className="text-gray-800 font-semibold">{step.text}</p>
                    <p className="text-gray-400 text-sm">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/buscar"
              className="inline-flex items-center gap-2 mt-8 bg-primary-500 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-primary-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-200"
            >
              <Search className="w-5 h-5" />
              Comenzar ahora
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-50 to-emerald-50 rounded-3xl p-8 border border-primary-100"
          >
            <p className="text-xs font-semibold text-primary-400 uppercase tracking-widest mb-4">Reseña de ejemplo</p>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Prof. García</p>
                    <p className="text-gray-400 text-xs">Cálculo I · UTP</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">"Excelente metodología, explica muy claro y es justo en los exámenes. Muy recomendado."</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 opacity-70">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Prof. Rodríguez</p>
                    <p className="text-gray-400 text-xs">Física II · UTP</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= 5 ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">"El mejor profesor que he tenido. Sus parciales son difíciles pero aprendes mucho."</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-primary-500 py-8 text-center text-sm text-primary-100">
        © {new Date().getFullYear()} Uniference · Hecho para estudiantes panameños
      </footer>
    </div>
  )
}
