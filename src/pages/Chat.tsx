import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Loader2,
  MessageCircle,
  Send,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { getChatById, subscribeToMessages, sendMessage, archiveChat } from '../lib/chat'
import type { ChatDoc, Message } from '../lib/chat'
import { cancelSubscription } from '../lib/subscriptions'
import { useAuth } from '../context/AuthContext'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

export default function Chat() {
  const { chatId } = useParams<{ chatId: string }>()
  const { user } = useAuth()

  const [chat, setChat] = useState<ChatDoc | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingChat, setLoadingChat] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Chat | Uniference'
  }, [])

  useEffect(() => {
    if (!chatId) return
    getChatById(chatId).then(c => {
      setChat(c)
      setLoadingChat(false)
    })
  }, [chatId])

  useEffect(() => {
    if (!chatId) return
    const unsub = subscribeToMessages(chatId, msgs => {
      setMessages(msgs)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    })
    return unsub
  }, [chatId])

  async function handleSend() {
    if (!user || !chatId || !text.trim()) return
    const isStudent = chat?.studentId === user.uid
    setSending(true)
    try {
      await sendMessage({
        chatId,
        from: isStudent ? 'student' : 'instructor',
        senderId: user.uid,
        body: text.trim(),
      })
      setText('')
    } finally {
      setSending(false)
    }
  }

  async function handleCancelSubscription() {
    if (!chat?.subscriptionId || !chatId) return
    setCancelling(true)
    try {
      await Promise.all([
        cancelSubscription(chat.subscriptionId),
        archiveChat(chatId),
      ])
      setChat(prev => prev ? { ...prev, status: 'archived' } : prev)
    } finally {
      setCancelling(false)
    }
  }

  const isStudent = chat ? user?.uid === chat.studentId : true
  const unreadCount = chat ? (isStudent ? chat.unreadStudent ?? 0 : chat.unreadInstructor ?? 0) : 0

  if (loadingChat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Chat no encontrado o sin acceso.</p>
        <Link to="/suscripciones" className="text-primary-600 font-semibold hover:text-primary-700">
          Volver a suscripciones
        </Link>
      </div>
    )
  }

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
                {isStudent ? chat.instructorName : chat.studentName}
              </h1>
              <p className="text-primary-100 text-lg">{chat.subject}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 text-green-700 px-3 py-1.5 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                Suscripción activa
              </span>
              {unreadCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 text-white px-3 py-1.5 text-xs font-bold">
                  <Bell className="w-4 h-4" />
                  {unreadCount} mensaje{unreadCount === 1 ? '' : 's'} nuevo{unreadCount === 1 ? '' : 's'}
                </span>
              )}
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
                <p className="text-xs text-gray-400">{messages.length} mensaje{messages.length === 1 ? '' : 's'}</p>
              </div>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1">
                  {unreadCount} nuevo{unreadCount === 1 ? '' : 's'}
                </span>
              )}
            </div>

            <div className="p-4 sm:p-6 space-y-4 bg-gray-50/60 min-h-[300px] max-h-[500px] overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-center text-sm text-gray-400 pt-8">No hay mensajes todavía. ¡Inicia la conversación!</p>
              )}
              {messages.map((message, i) => {
                const isMine = message.senderId === user?.uid
                return (
                  <motion.div
                    key={message.id ?? i}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[82%] sm:max-w-[70%] rounded-3xl px-4 py-3 shadow-sm ${
                      isMine
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-white text-gray-700 border border-gray-100 rounded-bl-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.body}</p>
                    </div>
                  </motion.div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-gray-100 p-4 bg-white">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Escribe un mensaje..."
                  disabled={chat.status === 'archived'}
                  className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || !text.trim() || chat.status === 'archived'}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
                ['Instructor', chat.instructorName],
                ['Materia', chat.subject],
                ['Precio', chat.price],
                ['Estado', chat.status === 'active' ? 'Suscripción activa' : 'Archivada'],
                ['Próxima sesión', chat.nextSession || 'Por definir'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-gray-50 border border-gray-100 p-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm font-bold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
            {chat.status === 'active' && (
              <button
                type="button"
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Cancelar suscripción
              </button>
            )}
          </motion.aside>
        </div>
      </main>
    </div>
  )
}
