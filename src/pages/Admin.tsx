import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Loader2, CheckCircle, XCircle, Star, BookOpen, Building2,
  ShieldCheck, ShieldAlert, Inbox, Phone, Clock, GraduationCap, MessageSquare, Trash2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { isAdminEmail } from '../lib/admins'
import { UNIVERSIDADES } from '../types'
import type { Review, Tutor } from '../types'

type Tab = 'reviews' | 'tutors' | 'comments'

const tsSeconds = (v: unknown): number =>
  (v as { seconds?: number })?.seconds ?? 0

const tsDate = (v: unknown): string => {
  const s = tsSeconds(v)
  return s ? new Date(s * 1000).toLocaleDateString('es-PA', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
}

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`w-4 h-4 ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  )
}

function ActionButtons({ busy, onApprove, onReject }: {
  busy: boolean
  onApprove: () => void
  onReject: () => void
}) {
  return (
    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
      <button onClick={onApprove} disabled={busy}
        className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors disabled:opacity-50">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
        Aprobar
      </button>
      <button onClick={onReject} disabled={busy}
        className="flex-1 flex items-center justify-center gap-2 bg-white border border-red-200 text-red-500 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-50">
        <XCircle className="w-4 h-4" />
        Rechazar
      </button>
    </div>
  )
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const isAdmin = isAdminEmail(user?.email)

  const [tab, setTab] = useState<Tab>('reviews')
  const [reviews, setReviews] = useState<Review[]>([])
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [comments, setComments] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { document.title = 'Panel de Moderación | Uniference' }, [])

  const load = useCallback(async () => {
    try {
      const [revSnap, tutSnap, commentsSnap] = await Promise.all([
        getDocs(query(collection(db, 'reviews'), where('aceptado', '==', false))),
        getDocs(query(collection(db, 'tutors'), where('aceptado', '==', false))),
        getDocs(query(collection(db, 'reviews'), where('aceptado', '==', true), orderBy('createdAt', 'desc'))),
      ])
      const newestFirst = (a: { createdAt?: unknown }, b: { createdAt?: unknown }) =>
        tsSeconds(b.createdAt) - tsSeconds(a.createdAt)
      setReviews(
        revSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review))
          .filter(r => !r.rechazado).sort(newestFirst)
      )
      setTutors(
        tutSnap.docs.map(d => ({ id: d.id, ...d.data() } as Tutor))
          .filter(t => !t.rechazado).sort(newestFirst)
      )
      setComments(
        commentsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review))
      )
      setError(null)
    } catch (e) {
      console.error(e)
      setError('Error al cargar los datos. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    const t = setTimeout(load, 0)
    return () => clearTimeout(t)
  }, [isAdmin, load])

  const moderate = async (col: 'reviews' | 'tutors', id: string, approve: boolean) => {
    setBusyId(id)
    setError(null)
    try {
      await updateDoc(doc(db, col, id),
        approve ? { aceptado: true } : { rechazado: true })
      if (col === 'reviews') setReviews(rs => rs.filter(r => r.id !== id))
      else setTutors(ts => ts.filter(t => t.id !== id))
    } catch (e) {
      console.error(e)
      setError('No se pudo actualizar. Revisa tu conexión e intenta de nuevo.')
    } finally {
      setBusyId(null)
    }
  }

  const deleteComment = async (id: string) => {
    setBusyId(id)
    setError(null)
    try {
      await deleteDoc(doc(db, 'reviews', id))
      setComments(cs => cs.filter(c => c.id !== id))
    } catch (e) {
      console.error(e)
      setError('No se pudo eliminar. Intenta de nuevo.')
    } finally {
      setBusyId(null)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center max-w-sm">
          <ShieldAlert className="w-14 h-14 text-amber-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {user ? 'Acceso restringido' : 'Inicia sesión'}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {user
              ? 'Esta sección es solo para administradores de Uniference.'
              : 'Necesitas iniciar sesión con tu cuenta de administrador para moderar el contenido.'}
          </p>
          <Link to={user ? '/' : '/login'}
            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors">
            {user ? 'Volver al inicio' : 'Iniciar sesión'}
          </Link>
        </motion.div>
      </div>
    )
  }

  const pendingCount = tab === 'reviews' ? reviews.length : tab === 'tutors' ? tutors.length : comments.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-primary-500 pt-12 pb-24 px-4 overflow-hidden">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, i) => <li key={i} />)}
        </ul>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-7 h-7 text-white" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Moderación</h1>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-primary-100">
            Aprueba o rechaza las reseñas y solicitudes de tutores pendientes
          </motion.p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-16 pb-12 relative z-10">
        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex gap-2 mb-6">
          {([
            { key: 'reviews', label: 'Reseñas', count: reviews.length, icon: <MessageSquare className="w-4 h-4" /> },
            { key: 'tutors', label: 'Tutores', count: tutors.length, icon: <GraduationCap className="w-4 h-4" /> },
            { key: 'comments', label: 'Comentarios', count: comments.length, icon: <BookOpen className="w-4 h-4" /> },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                tab === t.key ? 'bg-primary-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}>
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                tab === t.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </motion.div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : pendingCount === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-400">
            <Inbox className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-600">
              {tab === 'comments' ? 'Sin comentarios aprobados' : 'Todo al día'}
            </p>
            <p className="text-sm mt-1">
              No hay {tab === 'reviews' ? 'reseñas' : tab === 'tutors' ? 'solicitudes' : 'comentarios'} {tab === 'comments' ? 'aún' : 'pendientes'}
            </p>
          </motion.div>
        ) : tab === 'reviews' ? (
          <div className="space-y-4">
            <AnimatePresence>
              {reviews.map(r => (
                <motion.div key={r.id} layout
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 80, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{r.profesor}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{r.materia}</span>
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />
                          {UNIVERSIDADES[r.universidad as keyof typeof UNIVERSIDADES] ?? r.universidad}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <StarDisplay value={Number(r.rating) || 0} />
                      <span className="text-xs text-gray-300">{tsDate(r.createdAt)}</span>
                    </div>
                  </div>
                  <blockquote className="text-gray-600 text-sm bg-gray-50 rounded-xl px-4 py-3 border-l-4 border-primary-400 italic">
                    "{r.comentario}"
                  </blockquote>
                  <p className="text-xs text-gray-400 mt-2">
                    Enviado por: {r.userEmail ? `@${r.userEmail.split('@')[0]}` : 'anónimo'}
                  </p>
                  <ActionButtons busy={busyId === r.id}
                    onApprove={() => moderate('reviews', r.id!, true)}
                    onReject={() => moderate('reviews', r.id!, false)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : tab === 'tutors' ? (
          <div className="space-y-4">
            <AnimatePresence>
              {tutors.map(t => (
                <motion.div key={t.id} layout
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 80, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {t.fotoUrl
                        ? <img src={t.fotoUrl} alt={t.nombre} className="w-full h-full object-cover" />
                        : t.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{t.nombre}</h3>
                      <p className="text-xs text-gray-400">{t.carrera} · {UNIVERSIDADES[t.universidad as keyof typeof UNIVERSIDADES] ?? t.universidad}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                        <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full">
                          <BookOpen className="w-3 h-3 text-primary-400" />{t.materia}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          t.tarifa === 'gratis' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {t.tarifa === 'gratis' ? 'Gratis' : t.precio || 'De pago'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-300 flex-shrink-0">{tsDate(t.createdAt)}</span>
                  </div>
                  {t.disponibilidad?.length > 0 && (
                    <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                      <Clock className="w-3 h-3 text-gray-400" />{t.disponibilidad.join(', ')}
                    </p>
                  )}
                  <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                    <Phone className="w-3 h-3 text-gray-400" />WhatsApp: {t.whatsapp}
                  </p>
                  <blockquote className="text-gray-600 text-sm bg-gray-50 rounded-xl px-4 py-3 border-l-4 border-primary-400 italic">
                    "{t.porQueGoodTutor}"
                  </blockquote>
                  <ActionButtons busy={busyId === t.id}
                    onApprove={() => moderate('tutors', t.id!, true)}
                    onReject={() => moderate('tutors', t.id!, false)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-gray-400 text-center mb-2">
              {comments.length} comentario{comments.length !== 1 ? 's' : ''} aprobado{comments.length !== 1 ? 's' : ''} — más recientes primero
            </p>
            <AnimatePresence>
              {comments.map(r => (
                <motion.div key={r.id} layout
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 80, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{r.profesor}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{r.materia}</span>
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />
                          {UNIVERSIDADES[r.universidad as keyof typeof UNIVERSIDADES] ?? r.universidad}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <StarDisplay value={Number(r.rating) || 0} />
                      <span className="text-xs text-gray-300">{tsDate(r.createdAt)}</span>
                    </div>
                  </div>
                  <blockquote className="text-gray-600 text-sm bg-gray-50 rounded-xl px-4 py-3 border-l-4 border-green-400 italic">
                    "{r.comentario}"
                  </blockquote>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      Enviado por: {r.userEmail ? `@${r.userEmail.split('@')[0]}` : 'anónimo'}
                    </p>
                    <button onClick={() => deleteComment(r.id!)} disabled={busyId === r.id}
                      className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50">
                      {busyId === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      Eliminar
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
