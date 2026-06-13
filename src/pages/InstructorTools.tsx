import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  FileText,
  Save,
  Star,
  Upload,
  Wrench,
} from 'lucide-react'

type TabKey = 'calendario' | 'solicitudes' | 'pagos' | 'materiales' | 'resenas'

type SessionStatus = 'Confirmada' | 'Pendiente' | 'Reprogramar'
type PaymentStatus = 'Pagado' | 'Pendiente'
type ReviewStatus = 'Publicada' | 'Pendiente de respuesta'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const summaryCards: { label: string; value: string; icon: LucideIcon; tone: string }[] = [
  { label: 'Sesiones esta semana', value: '6', icon: CalendarDays, tone: 'bg-primary-50 text-primary-600' },
  { label: 'Solicitudes pendientes', value: '3', icon: ClipboardList, tone: 'bg-amber-50 text-amber-600' },
  { label: 'Pagos recibidos', value: '$240', icon: DollarSign, tone: 'bg-emerald-50 text-emerald-600' },
  { label: 'Recursos publicados', value: '8', icon: FileText, tone: 'bg-blue-50 text-blue-600' },
  { label: 'Calificación instructor', value: '4.8', icon: Star, tone: 'bg-violet-50 text-violet-600' },
]

const tabs: { id: TabKey; label: string; icon: LucideIcon }[] = [
  { id: 'calendario', label: 'Calendario', icon: CalendarDays },
  { id: 'solicitudes', label: 'Solicitudes', icon: ClipboardList },
  { id: 'pagos', label: 'Pagos', icon: DollarSign },
  { id: 'materiales', label: 'Materiales', icon: FileText },
  { id: 'resenas', label: 'Reseñas', icon: Star },
]

const weeklySessions = [
  {
    day: 'Lunes',
    sessions: [
      { time: '6:00 p.m.', subject: 'Cálculo I', student: 'Sofía Martínez', status: 'Confirmada' as SessionStatus },
      { time: '7:30 p.m.', subject: 'Programación', student: 'Diego Pérez', status: 'Pendiente' as SessionStatus },
    ],
  },
  {
    day: 'Miércoles',
    sessions: [
      { time: '5:00 p.m.', subject: 'Estadística', student: 'Andrea López', status: 'Confirmada' as SessionStatus },
    ],
  },
  {
    day: 'Sábado',
    sessions: [
      { time: '10:00 a.m.', subject: 'Estructuras de Datos', student: 'Carlos Ruiz', status: 'Reprogramar' as SessionStatus },
    ],
  },
]

const requests = [
  {
    student: 'Sofía Martínez',
    subject: 'Cálculo I',
    note: 'Necesito repasar derivadas antes del parcial.',
    schedule: 'Miércoles 6:00 p.m.',
    status: 'Pendiente',
  },
  {
    student: 'Carlos Ruiz',
    subject: 'Programación I',
    note: 'Quiero apoyo con ciclos y funciones.',
    schedule: 'Sábado 11:00 a.m.',
    status: 'Pendiente',
  },
]

const payments = [
  { student: 'Sofía Martínez', subject: 'Cálculo I', amount: '$30', date: '12 Jun', status: 'Pagado' as PaymentStatus },
  { student: 'Diego Pérez', subject: 'Programación', amount: '$45', date: '10 Jun', status: 'Pagado' as PaymentStatus },
  { student: 'Andrea López', subject: 'Estadística', amount: '$20', date: '08 Jun', status: 'Pendiente' as PaymentStatus },
]

const resources = [
  {
    title: 'Guía de derivadas para parcial',
    type: 'PDF',
    subject: 'Cálculo I',
    access: 'Estudiantes suscritos',
  },
  {
    title: 'Ejercicios de ciclos en JavaScript',
    type: 'Guía',
    subject: 'Programación I',
    access: 'Estudiantes suscritos',
  },
  {
    title: 'Resumen de probabilidad',
    type: 'PDF',
    subject: 'Estadística',
    access: 'Estudiantes suscritos',
  },
]

const reviews = [
  {
    student: 'Sofía Martínez',
    rating: '5.0',
    subject: 'Cálculo I',
    text: 'Me ayudó a entender los ejercicios paso a paso antes del parcial.',
    status: 'Publicada' as ReviewStatus,
  },
  {
    student: 'Carlos Ruiz',
    rating: '4.5',
    subject: 'Programación I',
    text: 'Explica claro y tuvo mucha paciencia con los ejemplos.',
    status: 'Publicada' as ReviewStatus,
  },
  {
    student: 'Andrea López',
    rating: '4.0',
    subject: 'Estadística',
    text: 'Buena sesión, me gustaría más material de práctica.',
    status: 'Pendiente de respuesta' as ReviewStatus,
  },
]

function statusClasses(status: SessionStatus | PaymentStatus | ReviewStatus | string) {
  if (status === 'Confirmada' || status === 'Pagado' || status === 'Publicada') return 'bg-green-100 text-green-700'
  if (status === 'Pendiente' || status === 'Pendiente de respuesta') return 'bg-amber-100 text-amber-700'
  if (status === 'Reprogramar') return 'bg-blue-100 text-blue-700'
  return 'bg-gray-100 text-gray-600'
}

function StatusBadge({ status }: { status: SessionStatus | PaymentStatus | ReviewStatus | string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses(status)}`}>
      {status}
    </span>
  )
}

function SectionLabel({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-extrabold text-gray-900">{title}</h2>
      {description && (
        <p className="text-sm text-gray-500 leading-relaxed mt-2 max-w-3xl">{description}</p>
      )}
    </div>
  )
}

function VisualActionButton({ label, onClick, tone = 'neutral' }: {
  label: string
  onClick: () => void
  tone?: 'primary' | 'neutral' | 'danger'
}) {
  const classes = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 border-primary-500',
    neutral: 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200',
    danger: 'bg-red-50 text-red-500 hover:bg-red-100 border-red-100',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${classes[tone]}`}
    >
      {label}
    </button>
  )
}

export default function InstructorTools() {
  const [activeTab, setActiveTab] = useState<TabKey>('calendario')

  useEffect(() => {
    document.title = 'Herramientas instructor | Uniference'
  }, [])

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
            <Wrench className="w-4 h-4" />
            Herramientas del instructor
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-4"
          >
            Organiza tus sesiones, recursos y estudiantes.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="text-primary-100 text-lg leading-relaxed max-w-3xl mx-auto md:mx-0"
          >
            Centraliza solicitudes, calendario, materiales, pagos y reseñas para gestionar mejor tu actividad como instructor en Uniference.
          </motion.p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-12 pb-16 relative z-20">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8" aria-label="Resumen de herramientas">
          {summaryCards.map(({ label, value, icon: Icon, tone }, i) => (
            <motion.article
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
            </motion.article>
          ))}
        </section>

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-3 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2" role="tablist" aria-label="Herramientas del instructor">
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id

              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${id}`}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-sm shadow-primary-200'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              )
            })}
          </div>
        </motion.section>

        <section id={`panel-${activeTab}`} role="tabpanel">
          {activeTab === 'calendario' && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8"
            >
              <SectionLabel
                eyebrow="Agenda"
                title="Calendario semanal"
                description="Visualiza las sesiones próximas y revisa qué encuentros necesitan confirmación o reprogramación."
              />

              {/* TODO: conectar calendario de sesiones con Firestore cuando existan reservas reales. */}
              <div className="space-y-4">
                {weeklySessions.map((day) => (
                  <article key={day.day} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                    <h3 className="font-extrabold text-gray-900 mb-3">{day.day}</h3>
                    <div className="space-y-3">
                      {day.sessions.map((session) => (
                        <div
                          key={`${day.day}-${session.time}-${session.student}`}
                          className="grid grid-cols-1 lg:grid-cols-[120px_1fr_auto] gap-3 rounded-2xl bg-white border border-gray-100 p-4"
                        >
                          <div className="flex items-center gap-2 text-sm font-bold text-primary-700">
                            <CalendarDays className="w-4 h-4" />
                            {session.time}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{session.subject} con {session.student}</p>
                            <div className="mt-2">
                              <StatusBadge status={session.status} />
                            </div>
                          </div>
                          <VisualActionButton
                            label="Ver detalle"
                            onClick={() => console.log('Session detail placeholder', session)}
                          />
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'solicitudes' && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8"
            >
              <SectionLabel
                eyebrow="Solicitudes"
                title="Solicitudes pendientes"
                description="Evalúa solicitudes de estudiantes y decide si aceptar, rechazar o proponer otro horario."
              />

              {/* TODO: conectar solicitudes reales y acciones con Firestore cuando exista el flujo de reservas. */}
              <div className="space-y-4">
                {requests.map((request) => (
                  <article key={`${request.student}-${request.subject}`} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-extrabold text-gray-900">{request.student}</h3>
                          <StatusBadge status={request.status} />
                        </div>
                        <p className="text-sm font-semibold text-primary-700 mb-2">{request.subject} · {request.schedule}</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{request.note}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
                        <VisualActionButton
                          label="Aceptar"
                          tone="primary"
                          onClick={() => console.log('Accept request placeholder', request)}
                        />
                        <VisualActionButton
                          label="Rechazar"
                          tone="danger"
                          onClick={() => console.log('Reject request placeholder', request)}
                        />
                        <VisualActionButton
                          label="Proponer otro horario"
                          onClick={() => console.log('Suggest schedule placeholder', request)}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'pagos' && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5 items-start">
                <SectionLabel
                  eyebrow="Pagos"
                  title="Historial de pagos"
                  description="Los montos mostrados son datos de ejemplo. El historial real se conectará cuando la pasarela de pago esté disponible."
                />
                <div className="rounded-3xl bg-emerald-50 border border-emerald-100 p-5">
                  <p className="text-sm font-semibold text-emerald-700">Total del mes</p>
                  <p className="text-4xl font-extrabold text-emerald-900 mt-1">$95</p>
                  <p className="text-xs text-emerald-700/70 mt-2">Datos mock para la vista del instructor.</p>
                </div>
              </div>

              {/* TODO: conectar pagos reales con Stripe o pasarela definida y suscripciones activas. */}
              <div className="space-y-3 mt-2">
                {payments.map((payment) => (
                  <article
                    key={`${payment.student}-${payment.date}`}
                    className="grid grid-cols-1 md:grid-cols-[1fr_100px_90px_auto] gap-3 items-center rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div>
                      <h3 className="font-extrabold text-gray-900">{payment.student}</h3>
                      <p className="text-sm text-gray-500">{payment.subject}</p>
                    </div>
                    <p className="text-lg font-extrabold text-gray-900">{payment.amount}</p>
                    <p className="text-sm font-semibold text-gray-500">{payment.date}</p>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={payment.status} />
                      <VisualActionButton
                        label="Ver detalle"
                        onClick={() => console.log('Payment detail placeholder', payment)}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'materiales' && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="space-y-5 mb-8"
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <SectionLabel
                  eyebrow="Materiales"
                  title="Recursos para estudiantes"
                  description="Prepara guías, enlaces o ejercicios para compartir con estudiantes suscritos cuando la integración esté disponible."
                />

                {/* TODO: conectar subida de recursos con Firebase Storage o proveedor definido. */}
                {/* TODO: restringir acceso a recursos solo para estudiantes suscritos. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ['Título del recurso', 'Guía de derivadas para parcial'],
                    ['Materia', 'Cálculo I'],
                    ['Tipo', 'PDF / Enlace / Guía / Ejercicio'],
                  ].map(([label, value]) => (
                    <label key={label} className="block">
                      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                        {label}
                      </span>
                      <input
                        value={value}
                        readOnly
                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700"
                      />
                    </label>
                  ))}
                  <label className="block md:col-span-2">
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Descripción corta
                    </span>
                    <textarea
                      value="Material de práctica para reforzar conceptos antes de la sesión."
                      readOnly
                      rows={3}
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 resize-none"
                    />
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => console.log('Upload resource placeholder')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Subir recurso
                  </button>
                  <button
                    type="button"
                    onClick={() => console.log('Save resource template placeholder')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Guardar plantilla
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {resources.map((resource, i) => (
                  <motion.article
                    key={resource.title}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-500">{resource.type} · {resource.subject}</p>
                    <p className="text-xs font-semibold text-primary-700 mt-3">{resource.access}</p>
                    <div className="grid grid-cols-3 gap-2 mt-5">
                      <button
                        type="button"
                        onClick={() => console.log('Edit resource placeholder', resource)}
                        className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-2 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => console.log('Delete resource placeholder', resource)}
                        className="inline-flex items-center justify-center rounded-xl border border-red-100 bg-red-50 px-2 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors"
                      >
                        Eliminar
                      </button>
                      <button
                        type="button"
                        onClick={() => console.log('View resource placeholder', resource)}
                        className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-2 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Ver
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'resenas' && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-5">
                <SectionLabel
                  eyebrow="Reseñas de tutorías"
                  title="Opiniones sobre tu apoyo como instructor"
                  description="Esta sección muestra reseñas de sesiones de tutoría entre estudiantes. Es independiente de las reseñas públicas de profesores."
                />
                <div className="rounded-3xl bg-amber-50 border border-amber-100 p-5">
                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-4xl font-extrabold text-amber-900">4.8</p>
                  <p className="text-sm font-semibold text-amber-700">18 reseñas de tutorías</p>
                </div>
              </div>

              {/* TODO: conectar reseñas reales de instructores y separarlas del modelo de reseñas de profesores. */}
              <div className="space-y-4 mt-2">
                {reviews.map((review) => (
                  <article key={`${review.student}-${review.subject}`} className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-extrabold text-gray-900">{review.student}</h3>
                          <StatusBadge status={review.status} />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            {review.rating}
                          </span>
                          <span className="text-sm text-gray-400">·</span>
                          <span className="text-sm font-semibold text-primary-700">{review.subject}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                      </div>
                      <VisualActionButton
                        label={review.status === 'Pendiente de respuesta' ? 'Responder' : 'Agradecer'}
                        onClick={() => console.log('Review action placeholder', review)}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          )}
        </section>

        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-3">Base visual lista para integración</h2>
              <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
                Esta pantalla reúne las herramientas que un instructor necesitará para organizar sesiones, estudiantes, materiales, pagos y reseñas. Por ahora usa datos de ejemplo y quedará lista para conexión con servicios reales en próximas fases.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-56">
              <Link
                to="/instructor"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <BookOpenCheck className="w-4 h-4" />
                Ir al portal instructor
              </Link>
              <Link
                to="/instructor/anuncios"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
              >
                Ver mis anuncios
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
