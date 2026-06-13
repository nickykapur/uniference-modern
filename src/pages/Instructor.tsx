import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Crown,
  DollarSign,
  Loader2,
  Megaphone,
  Plus,
  Save,
  Sparkles,
  Star,
  Trash2,
  UserRoundCheck,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import { getUserProfile, saveUserProfile } from '../lib/profile'
import type { UserProfile } from '../lib/profile'
import { getInstructorSubscriptions } from '../lib/subscriptions'
import { useAuth } from '../context/AuthContext'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const menuItems = [
  { href: '#perfil', label: 'Perfil', icon: UserRoundCheck },
  { href: '#materias', label: 'Materias', icon: BookOpen },
  { href: '#vista-publica', label: 'Vista pública', icon: BriefcaseBusiness },
  { href: '#estadisticas', label: 'Estadísticas', icon: Star },
  { href: '#disponibilidad', label: 'Disponibilidad', icon: CalendarDays },
]

const defaultAvailability = [
  { day: 'Lunes', time: '', available: false },
  { day: 'Martes', time: '', available: false },
  { day: 'Miércoles', time: '', available: false },
  { day: 'Jueves', time: '', available: false },
  { day: 'Viernes', time: '', available: false },
  { day: 'Sábado', time: '', available: false },
  { day: 'Domingo', time: '', available: false },
]

type Subject = NonNullable<UserProfile['subjects']>[number]
type AvailabilitySlot = NonNullable<UserProfile['availability']>[number]

export default function Instructor() {
  const { user } = useAuth()
  const displayName = user?.displayName?.trim() || 'Instructor Uniference'
  const email = user?.email ?? 'Correo pendiente'
  const initialSource = user?.displayName?.trim() || user?.email || 'I'
  const initial = initialSource.charAt(0).toUpperCase()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [bio, setBio] = useState('')
  const [universities, setUniversities] = useState('')
  const [experience, setExperience] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(defaultAvailability)

  const [stats, setStats] = useState({ students: 0, revenue: '$0', activeSubjects: 0 })

  const [newSubject, setNewSubject] = useState({ name: '', description: '', price: '', unit: 'hora' })
  const [showNewSubjectForm, setShowNewSubjectForm] = useState(false)

  useEffect(() => {
    document.title = 'Portal del instructor | Uniference'
  }, [])

  useEffect(() => {
    if (!user) return
    const uid = user.uid
    Promise.all([
      getUserProfile(uid),
      getInstructorSubscriptions(uid),
    ]).then(([prof, subs]) => {
      setBio(prof.bio ?? '')
      setUniversities(prof.universities ?? '')
      setExperience(prof.experience ?? '')
      setSpecialty(prof.specialty ?? '')
      setIsPremium(prof.isPremium ?? false)
      setSubjects(prof.subjects ?? [])
      if (prof.availability && prof.availability.length > 0) {
        setAvailability(prof.availability)
      } else {
        setAvailability(defaultAvailability)
      }

      const active = subs.filter(s => s.status === 'active').length
      const revenue = subs
        .filter(s => s.status === 'active')
        .reduce((sum, s) => {
          const match = s.price.match(/\$?([\d.]+)/)
          return sum + (match ? parseFloat(match[1]) : 0)
        }, 0)
      const activeSubjectCount = (prof.subjects ?? []).filter(s => s.status === 'active').length
      setStats({ students: active, revenue: `$${revenue.toFixed(0)}`, activeSubjects: activeSubjectCount })
    }).finally(() => setLoading(false))
  }, [user])

  async function handleSaveProfile() {
    if (!user) return
    setSaving(true)
    try {
      await saveUserProfile(user.uid, { bio, universities, experience, specialty, subjects, availability })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  function handleAddSubject() {
    if (!newSubject.name.trim()) return
    const subject: Subject = {
      id: Date.now().toString(),
      name: newSubject.name.trim(),
      description: newSubject.description.trim(),
      price: newSubject.price.trim(),
      unit: newSubject.unit,
      status: 'active',
    }
    const updated = [...subjects, subject]
    setSubjects(updated)
    setNewSubject({ name: '', description: '', price: '', unit: 'hora' })
    setShowNewSubjectForm(false)
    if (user) saveUserProfile(user.uid, { subjects: updated })
  }

  function handleDeleteSubject(id: string) {
    const updated = subjects.filter(s => s.id !== id)
    setSubjects(updated)
    if (user) saveUserProfile(user.uid, { subjects: updated })
  }

  function toggleAvailability(day: string) {
    setAvailability(prev => prev.map(s => s.day === day ? { ...s, available: !s.available } : s))
  }

  function updateAvailabilityTime(day: string, time: string) {
    setAvailability(prev => prev.map(s => s.day === day ? { ...s, time } : s))
  }

  const statCards = [
    { label: 'Estudiantes suscritos', value: String(stats.students), icon: Users, tone: 'bg-primary-50 text-primary-600' },
    { label: 'Ingresos estimados', value: stats.revenue, icon: DollarSign, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Materias activas', value: String(stats.activeSubjects), icon: BookOpen, tone: 'bg-blue-50 text-blue-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-primary-500 to-primary-700 px-4 pt-14 pb-24 overflow-hidden">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, i) => <li key={i} />)}
        </ul>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/15 text-white border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] mb-5"
              >
                <Sparkles className="w-4 h-4" />
                Portal del instructor
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.55 }}
                className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-4"
              >
                Hola, {displayName}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.5 }}
                className="text-primary-100 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0"
              >
                Administra tu perfil, organiza tus materias y muestra a los estudiantes cómo puedes ayudarlos a aprender mejor.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.22, duration: 0.5 }}
              className="mx-auto md:mx-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/15 border border-white/25 p-2 shadow-2xl"
            >
              <div className="w-full h-full rounded-full bg-white text-primary-600 flex items-center justify-center text-4xl font-extrabold">
                {initial}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-12 pb-16 relative z-20">
        <motion.nav
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-3 grid grid-cols-2 lg:grid-cols-5 gap-2 mb-8"
          aria-label="Secciones del portal del instructor"
        >
          {menuItems.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </a>
          ))}
        </motion.nav>

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl border border-amber-100 shadow-sm p-5 sm:p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-center">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-2xl font-extrabold text-gray-900">Instructor Premium</h2>
                  {isPremium && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold rounded-full bg-amber-100 text-amber-700 px-2.5 py-1">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Destaca tus materias y administra anuncios promocionales para que más estudiantes encuentren tu perfil.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-2">
              <Link
                to="/instructor/premium"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
              >
                Impulsar mi perfil con Premium
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/instructor/anuncios"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Megaphone className="w-4 h-4" />
                Gestionar mis anuncios
              </Link>
              <Link
                to="/instructor/herramientas"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-100 bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
              >
                <Wrench className="w-4 h-4" />
                Gestionar sesiones y recursos
              </Link>
            </div>
          </div>
        </motion.section>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <>
            <section id="perfil" className="scroll-mt-24 mb-8">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex md:flex-col items-center md:items-start gap-4 md:w-52 flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-md">
                      {initial}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">Perfil</p>
                      <h2 className="text-2xl font-extrabold text-gray-900">Perfil del instructor</h2>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Nombre', value: displayName, disabled: true, onChange: undefined },
                        { label: 'Correo', value: email, disabled: true, onChange: undefined },
                        { label: 'Universidad(es)', value: universities, disabled: false, onChange: (v: string) => setUniversities(v) },
                        { label: 'Años de experiencia', value: experience, disabled: false, onChange: (v: string) => setExperience(v) },
                        { label: 'Especialidad principal', value: specialty, disabled: false, onChange: (v: string) => setSpecialty(v) },
                      ].map(({ label, value, disabled, onChange }) => (
                        <label key={label} className="block">
                          <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</span>
                          <input
                            value={value}
                            disabled={disabled}
                            onChange={onChange ? e => onChange(e.target.value) : undefined}
                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors disabled:opacity-100"
                          />
                        </label>
                      ))}
                    </div>
                    <label className="block">
                      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Bio</span>
                      <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows={3}
                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors disabled:opacity-70"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      {saved ? 'Guardado' : 'Guardar perfil'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </section>

            <section id="materias" className="scroll-mt-24 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">Oferta</p>
                  <h2 className="text-2xl font-extrabold text-gray-900">Materias que enseñas</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewSubjectForm(v => !v)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar materia
                </button>
              </div>

              {showNewSubjectForm && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="bg-white rounded-3xl border border-primary-100 shadow-sm p-5 mb-4"
                >
                  <h3 className="font-bold text-gray-900 mb-4">Nueva materia</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {[
                      { label: 'Nombre', value: newSubject.name, key: 'name' },
                      { label: 'Precio (ej. $15)', value: newSubject.price, key: 'price' },
                    ].map(({ label, value, key }) => (
                      <label key={key} className="block">
                        <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</span>
                        <input
                          value={value}
                          onChange={e => setNewSubject(prev => ({ ...prev, [key]: e.target.value }))}
                          className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                        />
                      </label>
                    ))}
                    <label className="block sm:col-span-2">
                      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Descripción</span>
                      <input
                        value={newSubject.description}
                        onChange={e => setNewSubject(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                      />
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleAddSubject}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Agregar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewSubjectForm(false)}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              )}

              {subjects.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                  <p className="text-gray-400 text-sm">No has agregado materias todavía.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subjects.map((subject, i) => (
                    <motion.article
                      key={subject.id}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-bold text-gray-900">{subject.name}</h3>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          subject.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {subject.status === 'active' ? 'Activa' : 'Borrador'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">{subject.description}</p>
                      <p className="text-sm font-extrabold text-gray-900 mb-4">{subject.price}/{subject.unit}</p>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-100 transition-colors w-full"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </motion.article>
                  ))}
                </div>
              )}
            </section>

            <section id="vista-publica" className="scroll-mt-24 mb-8">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-primary-400 to-primary-600" />
                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-start">
                    <div>
                      <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-2">Vista pública</p>
                      <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Cómo verán tu perfil los estudiantes</h2>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Esta vista será la referencia pública que los estudiantes consultarán antes de solicitar apoyo.
                      </p>
                    </div>

                    <div className="rounded-3xl bg-gray-50 border border-gray-100 p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center text-xl font-extrabold shadow-sm">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-extrabold text-gray-900 truncate">{displayName}</h3>
                            {isPremium && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">
                                <Crown className="w-3 h-3" />
                                Verificado
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{universities || 'Universidad'}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{bio || 'Sin bio todavía.'}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {subjects.filter(s => s.status === 'active').slice(0, 3).map((s) => (
                          <span key={s.id} className="text-xs font-semibold rounded-full bg-primary-50 text-primary-700 px-2.5 py-1">
                            {s.name}
                          </span>
                        ))}
                      </div>
                      {subjects.length > 0 && (
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs text-gray-400">Desde</p>
                            <p className="font-extrabold text-gray-900">{subjects[0].price}/{subjects[0].unit}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            <section id="estadisticas" className="scroll-mt-24 mb-8">
              <div className="mb-4">
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">Dashboard</p>
                <h2 className="text-2xl font-extrabold text-gray-900">Estadísticas</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map(({ label, value, icon: Icon, tone }, i) => (
                  <motion.div
                    key={label}
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
                    <p className="text-3xl font-extrabold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500 mt-1">{label}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            <section id="disponibilidad" className="scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">Horario</p>
                  <h2 className="text-2xl font-extrabold text-gray-900">Disponibilidad semanal</h2>
                </div>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar disponibilidad
                </button>
              </div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                  {availability.map((slot) => (
                    <div
                      key={slot.day}
                      className={`rounded-2xl border p-4 ${
                        slot.available ? 'border-primary-100 bg-primary-50/70' : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-gray-900 text-sm">{slot.day}</p>
                        <button
                          type="button"
                          onClick={() => toggleAvailability(slot.day)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            slot.available ? 'border-primary-500 bg-primary-500' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {slot.available && <Check className="w-3 h-3 text-white" />}
                        </button>
                      </div>
                      {slot.available ? (
                        <input
                          value={slot.time}
                          onChange={e => updateAvailabilityTime(slot.day, e.target.value)}
                          placeholder="Ej. 6pm - 8pm"
                          className="w-full text-xs bg-transparent border-none outline-none text-primary-700 font-semibold placeholder-primary-300"
                        />
                      ) : (
                        <p className="text-xs text-gray-400">No disponible</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
