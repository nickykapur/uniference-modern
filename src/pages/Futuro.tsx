import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Users,
} from 'lucide-react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const visionCards = [
  {
    title: 'Cuentas con propósito',
    text: 'La experiencia podrá adaptarse según cómo cada persona use Uniference: para aprender, para orientar o para hacer ambas cosas.',
    icon: UserRoundCheck,
    tone: 'bg-primary-50 text-primary-600',
  },
  {
    title: 'Estudiantes que también enseñan',
    text: 'Muchos estudiantes dominan temas que otros están empezando a aprender. Queremos facilitar esa conexión de forma clara, útil y confiable.',
    icon: GraduationCap,
    tone: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Más control sobre tu perfil',
    text: 'La cuenta será el punto de partida para gestionar identidad, preferencias y participación dentro de la comunidad.',
    icon: ShieldCheck,
    tone: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Una comunidad académica más útil',
    text: 'El objetivo es que cada interacción ayude a otros a tomar mejores decisiones, mejorar su aprendizaje y sentirse acompañados.',
    icon: HeartHandshake,
    tone: 'bg-amber-50 text-amber-600',
  },
]

export default function Futuro() {
  useEffect(() => {
    document.title = 'Visión futura de Uniference | Comunidad académica'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-primary-500 px-4 pt-16 pb-24 overflow-hidden">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, i) => <li key={i} />)}
        </ul>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/15 text-white border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] mb-5"
              >
                <Sparkles className="w-4 h-4" />
                Nuestra visión
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-5"
              >
                Uniference está evolucionando para conectar aprendizaje, experiencia y comunidad.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-primary-100 text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                Queremos que los estudiantes no solo encuentren referencias útiles, sino que también puedan compartir lo que saben, apoyar a otros compañeros y construir una comunidad académica más colaborativa.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="hidden lg:block bg-white/15 border border-white/20 rounded-3xl p-6 shadow-2xl backdrop-blur-sm"
            >
              <div className="bg-white rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Aprender y orientar</p>
                    <p className="text-xs text-gray-400">Una misma comunidad</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {['Referencias útiles', 'Apoyo entre estudiantes', 'Participación con propósito'].map((item) => (
                    <div key={item} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                      <span className="w-2 h-2 rounded-full bg-primary-500" />
                      <span className="text-sm font-medium text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main>
        <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-14 relative z-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8"
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.18em] mb-2">Próximo capítulo</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Lo que queremos construir</h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                Una experiencia más personal, más útil y más conectada con la forma real en que los estudiantes se ayudan entre sí.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visionCards.map(({ title, text, icon: Icon, tone }, i) => (
                <motion.article
                  key={title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="group rounded-2xl border border-gray-100 bg-gray-50/70 p-5 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${tone}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center bg-gray-900 rounded-3xl p-7 sm:p-10 shadow-xl overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                La meta no es solo buscar información. Es ayudarnos a crecer.
              </h2>
              <p className="text-gray-300 leading-relaxed max-w-2xl">
                Uniference quiere convertirse en un espacio donde la experiencia de un estudiante pueda convertirse en apoyo real para otro.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <Link
                to="/buscar"
                className="inline-flex items-center justify-center gap-2 bg-primary-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-900/20"
              >
                Explorar profesores
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/evaluar"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Dejar una reseña
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}
