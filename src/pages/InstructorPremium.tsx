import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  CheckCircle2,
  Crown,
  Eye,
  Loader2,
  Megaphone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { getUserProfile, saveUserProfile } from '../lib/profile'
import { useAuth } from '../context/AuthContext'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const plans = [
  {
    name: 'Plan Básico',
    price: 'Gratis',
    description: 'Para instructores que quieren empezar a mostrar su perfil.',
    items: ['Perfil de instructor.', 'Materias publicadas.', 'Vista pública.', 'Disponibilidad básica.'],
    cta: 'Plan actual',
    highlighted: false,
  },
  {
    name: 'Instructor Premium',
    price: '$9.99/mes',
    description: 'Para destacar materias, anuncios y confianza dentro de Uniference.',
    items: [
      'Badge Premium/Verificado.',
      'Anuncios promocionales en Buscar y Tutores.',
      'Mayor visibilidad del perfil.',
      'Sección Mis anuncios.',
      'Estadísticas destacadas.',
    ],
    cta: 'Activar Premium',
    highlighted: true,
  },
]

const steps = [
  'Activas tu plan premium.',
  'Creas un anuncio promocional.',
  'Tu anuncio aparece en Buscar y Tutores.',
  'Los estudiantes pueden descubrir tu perfil con mayor facilidad.',
]

const benefits: { title: string; text: string; icon: LucideIcon; tone: string }[] = [
  {
    title: 'Más visibilidad',
    text: 'Tu perfil puede aparecer en espacios destacados donde los estudiantes ya están buscando apoyo.',
    icon: Eye,
    tone: 'bg-primary-50 text-primary-600',
  },
  {
    title: 'Perfil con badge verificado',
    text: 'Un sello visual ayuda a que tu perfil se sienta más confiable desde el primer vistazo.',
    icon: BadgeCheck,
    tone: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Anuncios promocionales',
    text: 'Destaca materias, horarios o campañas antes de parciales y semanas importantes.',
    icon: Megaphone,
    tone: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'Mejor presentación',
    text: 'Organiza tus materias y métricas con una presencia más completa para estudiantes.',
    icon: BarChart3,
    tone: 'bg-blue-50 text-blue-600',
  },
]

export default function InstructorPremium() {
  const { user } = useAuth()
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState(false)
  const [activated, setActivated] = useState(false)

  useEffect(() => {
    document.title = 'Instructor Premium | Uniference'
  }, [])

  useEffect(() => {
    if (!user) return
    getUserProfile(user.uid).then(p => {
      setIsPremium(p.isPremium ?? false)
    }).finally(() => setLoading(false))
  }, [user])

  async function handleActivate() {
    if (!user) return
    setActivating(true)
    try {
      const now = new Date()
      const renewal = new Date(now.setMonth(now.getMonth() + 1))
        .toLocaleDateString('es-PA', { day: 'numeric', month: 'long' })
      await saveUserProfile(user.uid, { isPremium: true, premiumRenewal: renewal })
      setIsPremium(true)
      setActivated(true)
      setTimeout(() => setActivated(false), 3000)
    } finally {
      setActivating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-primary-500 to-primary-700 px-4 pt-14 pb-24 overflow-hidden">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, i) => <li key={i} />)}
        </ul>

        <div className="relative z-10 max-w-5xl mx-auto text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/15 text-white border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] mb-5"
          >
            <Crown className="w-4 h-4" />
            Instructor Premium
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-4"
          >
            Haz que más estudiantes descubran tu perfil.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="text-primary-100 text-lg leading-relaxed max-w-3xl mx-auto md:mx-0"
          >
            Premium está pensado para instructores que quieren destacar sus materias, mostrar anuncios promocionales y construir mayor confianza dentro de Uniference.
          </motion.p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-12 pb-16 relative z-20">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10" aria-label="Planes para instructores">
          {plans.map((plan, i) => (
            <motion.article
              key={plan.name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className={`rounded-3xl border p-6 shadow-xl bg-white relative overflow-hidden ${
                plan.highlighted ? 'border-amber-200' : 'border-gray-100'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-300 via-primary-400 to-primary-600" />
              )}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-2xl font-extrabold text-gray-900">{plan.name}</h2>
                    {plan.highlighted && (
                      <span className="text-xs font-bold rounded-full bg-amber-100 text-amber-700 px-2.5 py-1">
                        Recomendado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{plan.description}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  plan.highlighted ? 'bg-amber-50 text-amber-600' : 'bg-primary-50 text-primary-600'
                }`}>
                  {plan.highlighted ? <Crown className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                </div>
              </div>

              <p className="text-4xl font-extrabold text-gray-900 mb-5">{plan.price}</p>
              <ul className="space-y-3 mb-6">
                {plan.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              {plan.highlighted ? (
                loading ? (
                  <div className="w-full flex justify-center py-3"><Loader2 className="w-5 h-5 animate-spin text-primary-500" /></div>
                ) : isPremium ? (
                  <div className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-100 px-5 py-3 text-sm font-semibold text-amber-700">
                    <BadgeCheck className="w-4 h-4" />
                    Premium activo
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleActivate}
                    disabled={activating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors disabled:opacity-70"
                  >
                    {activating ? <Loader2 className="w-4 h-4 animate-spin" /> : activated ? <Check className="w-4 h-4" /> : null}
                    {activated ? '¡Activado!' : plan.cta}
                    {!activating && !activated && <ArrowRight className="w-4 h-4" />}
                  </button>
                )
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed"
                >
                  {plan.cta}
                </button>
              )}
              {plan.highlighted && (
                <p className="text-xs text-gray-400 mt-3">
                  El pago recurrente se conectará cuando la integración de suscripciones esté disponible.
                </p>
              )}
            </motion.article>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 mb-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
          >
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
              Flujo
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Cómo funciona Premium</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {steps.map((step, i) => (
                <div key={step} className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                  <span className="w-8 h-8 rounded-xl bg-primary-500 text-white flex items-center justify-center text-sm font-extrabold mb-3">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gray-900 rounded-3xl p-6 shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-3">Listo para destacar</h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-5">
              Usa Premium como una vitrina visual para tus materias principales mientras la integración de pagos se conecta en una fase posterior.
            </p>
            <Link
              to="/instructor/anuncios"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Ver Mis anuncios
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>

        <section>
          <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
            Beneficios
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Beneficios para instructores</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {benefits.map(({ title, text, icon: Icon, tone }, i) => (
              <motion.article
                key={title}
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
                <h3 className="font-extrabold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
