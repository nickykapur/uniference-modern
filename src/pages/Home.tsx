import { Link } from 'react-router-dom'
import { Search, Star, Users, ArrowRight, BookOpen, TrendingUp } from 'lucide-react'
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

const features = [
  {
    icon: <Star className="w-7 h-7 text-primary-500" />,
    title: 'Evalúa a tu profesor',
    desc: 'Califica con estrellas y deja un comentario detallado sobre tu experiencia en clase.',
  },
  {
    icon: <Search className="w-7 h-7 text-primary-500" />,
    title: 'Busca antes de inscribirte',
    desc: 'Revisa las opiniones de otros estudiantes antes de elegir a tu profesor este semestre.',
  },
  {
    icon: <Users className="w-7 h-7 text-primary-500" />,
    title: 'Encuentra tutores',
    desc: 'Conecta con tutores disponibles en tu universidad para reforzar lo aprendido.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative bg-primary-500 overflow-hidden min-h-[560px] flex items-center">
        {/* Animated circles */}
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
            <img src="/logo.jpg" alt="Uniference" className="w-24 h-24 rounded-2xl object-cover shadow-2xl ring-4 ring-white/30" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-primary-100 text-xs font-semibold uppercase tracking-[0.2em] mb-4"
          >
            La mejor referencia de tu profesor
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
            className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-5"
          >
            Busca. Comenta.{' '}
            <span className="text-primary-100 underline decoration-wavy decoration-white/40">Apoya.</span>
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

      {/* ── STATS STRIP ── */}
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

      {/* ── FEATURES ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">¿Cómo funciona?</h2>
          <p className="text-gray-500 max-w-lg mx-auto">Todo lo que necesitas para tomar mejores decisiones académicas en un solo lugar.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW TO USE CTA ── */}
      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Eres estudiante en Panamá?</h2>
              <p className="text-gray-500 mb-6">
                Uniference te ayuda a conocer a tus profesores antes de inscribirte. Lee lo que otros estudiantes dicen y toma decisiones más inteligentes.
              </p>
              <div className="space-y-3">
                {[
                  { icon: <BookOpen className="w-5 h-5 text-primary-500" />, text: 'Busca el nombre de tu profesor' },
                  { icon: <Star className="w-5 h-5 text-primary-500" />, text: 'Lee las calificaciones y comentarios' },
                  { icon: <TrendingUp className="w-5 h-5 text-primary-500" />, text: 'Elige mejor y apoya a tu comunidad' },
                ].map((step) => (
                  <div key={step.text} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">{step.icon}</div>
                    <span className="text-gray-700 font-medium">{step.text}</span>
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
              className="grid grid-cols-2 gap-4"
            >
              {[
                { uni: 'UTP', color: 'bg-blue-50 border-blue-100', text: 'text-blue-700' },
                { uni: 'USMA', color: 'bg-purple-50 border-purple-100', text: 'text-purple-700' },
                { uni: 'U. de Panamá', color: 'bg-green-50 border-green-100', text: 'text-green-700' },
                { uni: 'U. Latina', color: 'bg-amber-50 border-amber-100', text: 'text-amber-700' },
                { uni: 'ISAE', color: 'bg-red-50 border-red-100', text: 'text-red-700' },
                { uni: 'UMECIT', color: 'bg-teal-50 border-teal-100', text: 'text-teal-700' },
              ].map((u) => (
                <div key={u.uni} className={`${u.color} border rounded-xl p-4 text-center`}>
                  <p className={`${u.text} font-semibold text-sm`}>{u.uni}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-primary-500 py-8 text-center text-sm text-primary-100">
        © {new Date().getFullYear()} Uniference · Hecho para estudiantes panameños
      </footer>
    </div>
  )
}
