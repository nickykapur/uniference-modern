import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  MessageCircle,
  Send,
  ShieldCheck,
  XCircle,
} from 'lucide-react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const chats = {
  'calculo-ana': {
    instructor: 'Ana Rodríguez',
    subject: 'Cálculo I',
    price: '$15/hora',
    status: 'Suscripción activa',
    nextSession: 'Miércoles, 6:00 p.m.',
    unread: 2,
    messages: [
      { id: 'm1', from: 'instructor', body: 'Hola, ya revisé tus dudas sobre límites laterales.', time: '5:42 p.m.' },
      { id: 'm2', from: 'student', body: 'Gracias, me cuesta saber cuándo una función no tiene límite.', time: '5:45 p.m.' },
      { id: 'm3', from: 'instructor', body: 'Lo vemos con dos ejemplos y luego hacemos práctica de parcial.', time: '5:49 p.m.' },
      { id: 'm4', from: 'student', body: 'Perfecto. También quiero repasar derivadas básicas.', time: '5:51 p.m.' },
    ],
  },
  'programacion-carlos': {
    instructor: 'Carlos Méndez',
    subject: 'Programación',
    price: '$18/hora',
    status: 'Suscripción activa',
    nextSession: 'Sábado, 10:00 a.m.',
    unread: 1,
    messages: [
      { id: 'm1', from: 'instructor', body: 'Trae el ejercicio de ciclos y lo resolvemos paso a paso.', time: '9:12 a.m.' },
      { id: 'm2', from: 'student', body: 'Lo tengo. Creo que mi error está en la condición del while.', time: '9:18 a.m.' },
      { id: 'm3', from: 'instructor', body: 'Exacto, ahí suele estar el detalle. Lo revisamos juntos.', time: '9:20 a.m.' },
    ],
  },
}

type ChatKey = keyof typeof chats

export default function Chat() {
  const { chatId } = useParams()
  const activeChat = chats[(chatId ?? 'calculo-ana') as ChatKey] ?? chats['calculo-ana']

  useEffect(() => {
    document.title = 'Chat | Uniference'
  }, [])

  // TODO: conectar mensajes en tiempo real con Firestore onSnapshot.
  // TODO: restringir acceso al chat a suscripciones activas.
  // TODO: conectar notificaciones de mensajes nuevos.
  // TODO: archivar chat al cancelar la suscripción.

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-primary-500 to-primary-700 px-4 pt-10 pb-20 overflow-hidden">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, i) => <li key={i} />)}
        </ul>

        <div className="relative z-10 max-w-5xl mx-auto">
          <Link
            to="/suscripciones"
            className="inline-flex items-center gap-2 text-primary-100 hover:text-white text-sm font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a suscripciones
          </Link>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-end"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 text-white border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] mb-5">
                <MessageCircle className="w-4 h-4" />
                Chat habilitado
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-3">
                {activeChat.instructor}
              </h1>
              <p className="text-primary-100 text-lg">{activeChat.subject}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 text-green-700 px-3 py-1.5 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                {activeChat.status}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 text-white px-3 py-1.5 text-xs font-bold">
                <Bell className="w-4 h-4" />
                {activeChat.unread + 1} mensajes nuevos
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-12 pb-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
            aria-label="Mensajes de chat"
          >
            <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-gray-900">Conversación</p>
                <p className="text-xs text-gray-400">Vista mock de mensajes</p>
              </div>
              <span className="rounded-full bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1">
                {activeChat.unread + 1} nuevos
              </span>
            </div>

            <div className="p-4 sm:p-6 space-y-4 bg-gray-50/60">
              {activeChat.messages.map((message, i) => {
                const isStudent = message.from === 'student'
                return (
                  <motion.div
                    key={message.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[82%] sm:max-w-[70%] rounded-3xl px-4 py-3 shadow-sm ${
                      isStudent
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-white text-gray-700 border border-gray-100 rounded-bl-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.body}</p>
                      <p className={`text-[11px] mt-2 ${isStudent ? 'text-primary-100' : 'text-gray-400'}`}>
                        {message.time}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="border-t border-gray-100 p-4 bg-white">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => console.log('Send message placeholder', chatId)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Enviar
                </button>
              </div>
            </div>
          </motion.section>

          <motion.aside
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 h-fit"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">Suscripción</h2>
            <div className="space-y-3 mb-5">
              {[
                ['Instructor', activeChat.instructor],
                ['Materia', activeChat.subject],
                ['Precio', activeChat.price],
                ['Estado', activeChat.status],
                ['Próxima sesión', activeChat.nextSession],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-gray-50 border border-gray-100 p-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm font-bold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => console.log('Cancel subscription placeholder', chatId)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-100 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Cancelar suscripción
            </button>
          </motion.aside>
        </div>
      </main>
    </div>
  )
}
