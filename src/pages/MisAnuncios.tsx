import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Crown,
  Eye,
  Loader2,
  Megaphone,
  PauseCircle,
  PlayCircle,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'
import PremiumInstructorAd from '../components/PremiumInstructorAd'
import {
  getInstructorAnnouncements,
  saveAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../lib/announcements'
import type { Announcement } from '../lib/announcements'
import { getUserProfile } from '../lib/profile'
import { useAuth } from '../context/AuthContext'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

function statusClasses(status: string) {
  if (status === 'active') return 'bg-green-100 text-green-700'
  if (status === 'paused') return 'bg-amber-100 text-amber-700'
  return 'bg-gray-100 text-gray-600'
}

function statusLabel(status: string) {
  if (status === 'active') return 'Activo'
  if (status === 'paused') return 'Pausado'
  return 'Borrador'
}

export default function MisAnuncios() {
  const { user } = useAuth()
  const displayName = user?.displayName?.trim() || 'Instructor'

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [premiumRenewal, setPremiumRenewal] = useState('')
  const [ads, setAds] = useState<Announcement[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const [form, setForm] = useState({
    title: '',
    subject: '',
    description: '',
    price: '',
    cta: 'Ver perfil',
    status: 'active' as Announcement['status'],
  })

  useEffect(() => {
    document.title = 'Mis anuncios | Uniference'
  }, [])

  useEffect(() => {
    if (!user) return
    const uid = user.uid
    Promise.all([
      getUserProfile(uid),
      getInstructorAnnouncements(uid),
    ]).then(([prof, annList]) => {
      setIsPremium(prof.isPremium ?? false)
      setPremiumRenewal(prof.premiumRenewal ?? '')
      setAds(annList)
    }).finally(() => setLoading(false))
  }, [user])

  async function handleSave() {
    if (!user || !form.title.trim()) return
    setSaving(true)
    try {
      const id = await saveAnnouncement({
        ...form,
        instructorId: user.uid,
        instructorName: displayName,
      })
      const newAd: Announcement = { ...form, id, instructorId: user.uid, instructorName: displayName, clicks: 0, impressions: 0 }
      setAds(prev => [newAd, ...prev])
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      setForm({ title: '', subject: '', description: '', price: '', cta: 'Ver perfil', status: 'active' })
    } finally {
      setSaving(false)
    }
  }

  async function handleTogglePause(ad: Announcement) {
    if (!ad.id) return
    const newStatus: Announcement['status'] = ad.status === 'active' ? 'paused' : 'active'
    await updateAnnouncement(ad.id, { status: newStatus })
    setAds(prev => prev.map(a => a.id === ad.id ? { ...a, status: newStatus } : a))
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteAnnouncement(id)
      setAds(prev => prev.filter(a => a.id !== id))
    } finally {
      setDeletingId(null)
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
            <Megaphone className="w-4 h-4" />
            Mis anuncios
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-4"
          >
            Crea banners para promocionar tus materias.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="text-primary-100 text-lg leading-relaxed max-w-3xl mx-auto md:mx-0"
          >
            Los instructores premium podrán destacar materias, horarios o promociones para que más estudiantes encuentren su perfil.
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
            <motion.section
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-center">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">Estado premium</p>
                    <h2 className="text-2xl font-extrabold text-gray-900">
                      {isPremium ? 'Premium activo' : 'Sin premium'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {isPremium
                        ? `Plan: Instructor Premium${premiumRenewal ? ` · Próxima renovación: ${premiumRenewal}` : ''}`
                        : 'Activa Premium para publicar anuncios visibles en toda la plataforma.'}
                    </p>
                  </div>
                </div>
                <Link
                  to="/instructor/premium"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                  {isPremium ? 'Administrar plan' : 'Activar Premium'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.section>

            <section className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-5 mb-8">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
              >
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">Editor</p>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Nuevo anuncio</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Título del anuncio', key: 'title' },
                    { label: 'Materia destacada', key: 'subject' },
                    { label: 'Precio promocional', key: 'price' },
                    { label: 'CTA del anuncio', key: 'cta' },
                  ].map(({ label, key }) => (
                    <label key={key} className="block">
                      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</span>
                      <input
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm(cur => ({ ...cur, [key]: e.target.value }))}
                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                      />
                    </label>
                  ))}
                  <label className="block sm:col-span-2">
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Descripción corta</span>
                    <textarea
                      value={form.description}
                      onChange={e => setForm(cur => ({ ...cur, description: e.target.value }))}
                      rows={3}
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                    />
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !form.title.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Guardado' : 'Guardar anuncio'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreview(v => !v)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview ? 'Ocultar' : 'Vista previa'}
                  </button>
                </div>
              </motion.div>

              {showPreview && (
                <motion.div
                  variants={fadeUp}
                  custom={1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <div>
                    <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">Vista previa</p>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Banner premium</h2>
                  </div>
                  <PremiumInstructorAd
                    instructorName={displayName}
                    subject={form.subject || 'Materia'}
                    description={form.description || 'Descripción del anuncio.'}
                    priceLabel={form.price || '$0'}
                    university=""
                    badgeLabel="Instructor Premium"
                    ctaLabel={form.cta || 'Ver perfil'}
                    ctaHref="/instructor"
                  />
                </motion.div>
              )}
            </section>

            {ads.length > 0 && (
              <section>
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">Historial</p>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Mis anuncios</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ads.map((ad, i) => (
                    <motion.article
                      key={ad.id}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-extrabold text-gray-900">{ad.title}</h3>
                          <p className="text-sm text-gray-500">{ad.subject}</p>
                        </div>
                        <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${statusClasses(ad.status)}`}>
                          {statusLabel(ad.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3">
                          <p className="text-xs text-gray-400">Clicks</p>
                          <p className="text-lg font-extrabold text-gray-900">{ad.clicks}</p>
                        </div>
                        <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3">
                          <p className="text-xs text-gray-400">Impresiones</p>
                          <p className="text-lg font-extrabold text-gray-900">{ad.impressions}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePause(ad)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          {ad.status === 'active'
                            ? <><PauseCircle className="w-3.5 h-3.5" />Pausar</>
                            : <><PlayCircle className="w-3.5 h-3.5" />Activar</>
                          }
                        </button>
                        <button
                          type="button"
                          onClick={() => ad.id && handleDelete(ad.id)}
                          disabled={deletingId === ad.id}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {deletingId === ad.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />
                          }
                          Eliminar
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}

            {ads.length === 0 && !loading && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="text-gray-500 text-sm">Crea tu primer anuncio usando el formulario de arriba.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
