import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  CreditCard,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { getStudentSubscriptions, cancelSubscription } from '../lib/subscriptions'
import type { Subscription } from '../lib/subscriptions'
import { getStudentChats } from '../lib/chat'
import { useAuth } from '../context/AuthContext'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const howItWorks = [
  'El estudiante elige un instructor.',
  'Se suscribe mediante pago seguro.',
  'Al activarse la suscripción, se habilita el chat.',
  'El estudiante puede cancelar la suscripción cuando lo necesite.',
]

function statusClasses(status: Subscription['status']) {
  if (status === 'active') return 'bg-green-100 text-green-700'
  if (status === 'pending') return 'bg-amber-100 text-amber-700'
  return 'bg-gray-100 text-gray-600'
}

function statusLabel(status: Subscription['status']) {
  if (status === 'active') return 'Activa'
  if (status === 'pending') return 'Pendiente de pago'
  return 'Cancelada'
}

export default function Suscripciones() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({})
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [totalUnread, setTotalUnread] = useState(0)

  useEffect(() => {
    document.title = 'Suscripciones y chat | Uniference'
  }, [])

  useEffect(() => {
    if (!user) return
    const uid = user.uid
    Promise.all([
      getStudentSubscriptions(uid),
      getStudentChats(uid),
    ]).then(([subs, chats]) => {
      setSubscriptions(subs)
      const umap: Record<string, number> = {}
      let total = 0
      for (const chat of chats) {
        if (chat.subscriptionId) {
          const u = chat.unreadStudent ?? 0
          umap[chat.subscriptionId] = u
          total += u
        }
      }
      setUnreadMap(umap)
      setTotalUnread(total)
    }).finally(() => setLoading(false))
  }, [user])

  async function handleCancel(subId: string) {
    setCancellingId(subId)
    try {
      await cancelSubscription(subId)
      setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, status: 'cancelled' } : s))
    } finally {
      setCancellingId(null)
    }
  }

  const activeCount = subscriptions.filter(s => s.status === 'active').length

  const summaryCards: { label: string; value: string; icon: LucideIcon; tone: string }[] = [
    { label: 'Suscripciones activas', value: String(activeCount), icon: Users, tone: 'bg-primary-50 text-primary-600' },
    { label: 'Mensajes nuevos', value: String(totalUnread), icon: MessageCircle, tone: 'bg-amber-50 text-amber-600' },
    { label: 'Chats disponibles', value: String(activeCount), icon: Bell, tone: 'bg-blue-50 text-blue-600' },
    { label: 'Pago mensual estimado', value: '—', icon: CreditCard, tone: 'bg-emerald-50 text-emerald-600' },
  ]

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
            <Sparkles className="w-4 h-4" />
            Suscripciones
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-4"
          >
            Tus suscripciones y chats
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="text-primary-100 text-lg leading-relaxed max-w-3xl mx-auto md:mx-0"
          >
            Gestiona el acceso a tus instructores, revisa el estado de tus suscripciones y continúa conversaciones activas desde un solo lugar.
          </motion.p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-12 pb-16 relative z-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" aria-label="Resumen de suscripciones">
              {summaryCards.map(({ label, value, icon: Icon, tone }, i) => (
                <motion.div
                  key={label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="bg-white rounded-3xl border border-gray-100 shadow-xl p-5"
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${tone}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </motion.div>
              ))}
            </section>

            <section className="mb-8">
              <div className="mb-4">
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">Acceso activo</p>
                <h2 className="text-2xl font-extrabold text-gray-900">Mis suscripciones</h2>
              </div>

              {subscriptions.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                  <p className="text-gray-400 text-sm">No tienes suscripciones todavía.</p>
                  <Link to="/tutores" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700">
                    Buscar tutores <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((sub, i) => (
                    <motion.article
                      key={sub.id}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5">
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center font-extrabold flex-shrink-0">
                                {sub.instructorName.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-extrabold text-gray-900">{sub.instructorName}</h3>
                                <p className="text-sm text-gray-500">{sub.subject}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${statusClasses(sub.status)}`}>
                                {statusLabel(sub.status)}
                              </span>
                              {sub.id && unreadMap[sub.id] > 0 && (
                                <span className="text-xs font-bold rounded-full bg-red-100 text-red-600 px-2.5 py-1">
                                  {unreadMap[sub.id]} mensaje{unreadMap[sub.id] === 1 ? '' : 's'} nuevo{unreadMap[sub.id] === 1 ? '' : 's'}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Precio</p>
                              <p className="text-sm font-bold text-gray-800">{sub.price}</p>
                            </div>
                            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Próxima sesión</p>
                              <p className="text-sm font-bold text-gray-800">{sub.nextSession || 'Por definir'}</p>
                            </div>
                            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Chat</p>
                              <p className="text-sm font-bold text-gray-800">{sub.status === 'active' ? 'Disponible' : 'Pendiente'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-44">
                          {sub.status === 'active' ? (
                            <Link
                              to={`/chat/${sub.id}`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                            >
                              Abrir chat
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500/50 px-4 py-2.5 text-sm font-semibold text-white cursor-not-allowed"
                            >
                              Completar pago
                            </button>
                          )}
                          {sub.status === 'active' && (
                            <button
                              type="button"
                              onClick={() => sub.id && handleCancel(sub.id)}
                              disabled={cancellingId === sub.id}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              {cancellingId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">Flujo esperado</p>
                    <h2 className="text-2xl font-extrabold text-gray-900">Cómo funcionará</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {howItWorks.map((step, i) => (
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
                <div className="w-11 h-11 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-extrabold text-white mb-3">Pagos pendientes de integración</h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Las suscripciones se gestionan en Firestore. La activación de pagos y notificaciones se conectará en una fase posterior.
                </p>
              </motion.div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
