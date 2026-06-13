import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  Bell,
  BookOpenCheck,
  Calculator,
  CalendarDays,
  Check,
  CheckCircle2,
  Columns3,
  FileText,
  GraduationCap,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react'
import { getUserProfile, saveUserProfile } from '../lib/profile'
import { useAuth } from '../context/AuthContext'

type TabKey = 'gpa' | 'calendario' | 'apuntes' | 'grupos' | 'recordatorios' | 'comparador'
type CourseKey = 'calculo' | 'programacion' | 'fisica'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const summaryCards: { label: string; value: string; icon: LucideIcon; tone: string }[] = [
  { label: 'Promedio estimado', value: '4.2', icon: Calculator, tone: 'bg-primary-50 text-primary-600' },
  { label: 'Fechas próximas', value: '4', icon: CalendarDays, tone: 'bg-amber-50 text-amber-600' },
  { label: 'Recursos guardados', value: '12', icon: FileText, tone: 'bg-blue-50 text-blue-600' },
  { label: 'Grupos activos', value: '3', icon: Users, tone: 'bg-emerald-50 text-emerald-600' },
  { label: 'Recordatorios', value: '5', icon: Bell, tone: 'bg-violet-50 text-violet-600' },
  { label: 'Profesores comparados', value: '2', icon: Columns3, tone: 'bg-rose-50 text-rose-600' },
]

const tabs: { id: TabKey; label: string; icon: LucideIcon }[] = [
  { id: 'gpa', label: 'GPA', icon: Calculator },
  { id: 'calendario', label: 'Calendario', icon: CalendarDays },
  { id: 'apuntes', label: 'Apuntes', icon: FileText },
  { id: 'grupos', label: 'Grupos', icon: Users },
  { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
  { id: 'comparador', label: 'Comparador', icon: Columns3 },
]

const universities = [
  'Universidad Tecnológica de Panamá',
  'Universidad de Panamá',
  'USMA',
  'Otra universidad',
]

const academicDates = [
  { title: 'Matrícula regular', date: '15 Jul', university: 'UTP', type: 'Matrícula' },
  { title: 'Inicio de clases', date: '05 Ago', university: 'UTP', type: 'Académico' },
  { title: 'Primer parcial', date: '02 Sep', university: 'UTP', type: 'Examen' },
  { title: 'Vacaciones cortas', date: '10 Oct', university: 'UTP', type: 'Receso' },
]

const notes = [
  {
    title: 'Resumen de derivadas',
    subject: 'Cálculo I',
    university: 'UTP',
    type: 'PDF',
    sharedBy: 'Sofía M.',
  },
  {
    title: 'Guía de ciclos en programación',
    subject: 'Programación I',
    university: 'UP',
    type: 'Guía',
    sharedBy: 'Carlos R.',
  },
  {
    title: 'Fórmulas de Física I',
    subject: 'Física I',
    university: 'USMA',
    type: 'Resumen',
    sharedBy: 'Andrea L.',
  },
]

const studyGroups = [
  {
    title: 'Cálculo I antes del parcial',
    university: 'UTP',
    members: '8/12',
    mode: 'Presencial',
    status: 'Abierto',
  },
  {
    title: 'Programación desde cero',
    university: 'UP',
    members: '14/20',
    mode: 'Virtual',
    status: 'Abierto',
  },
  {
    title: 'Física I práctica de problemas',
    university: 'USMA',
    members: '6/10',
    mode: 'Híbrido',
    status: 'Casi lleno',
  },
]

const reminders = [
  { title: 'Parcial de Cálculo I', date: '02 Sep', remaining: '12 días', status: 'Activo' },
  { title: 'Entrega de proyecto de Programación', date: '08 Sep', remaining: '18 días', status: 'Activo' },
  { title: 'Matrícula segundo semestre', date: '15 Jul', remaining: '3 días', status: 'Urgente' },
]

const professors = [
  {
    name: 'Prof. Roberto García',
    subject: 'Física I',
    university: 'UTP',
    rating: '4.5',
    difficulty: 'Media',
    homework: 'Alta',
    comment: 'Explica bien, pero exige bastante.',
  },
  {
    name: 'Prof. Elena Vargas',
    subject: 'Física I',
    university: 'UTP',
    rating: '4.8',
    difficulty: 'Media',
    homework: 'Media',
    comment: 'Muy organizada y clara con los temas.',
  },
  {
    name: 'Prof. Manuel Ortega',
    subject: 'Física I',
    university: 'UTP',
    rating: '4.1',
    difficulty: 'Alta',
    homework: 'Media',
    comment: 'Buen dominio del tema, ritmo rápido.',
  },
]

function gradeToPoints(grade: number) {
  if (grade >= 97) return 4.8
  if (grade >= 95) return 4.5
  if (grade >= 90) return 4.3
  if (grade >= 85) return 3.9
  if (grade >= 80) return 3.5
  if (grade >= 75) return 3
  if (grade >= 70) return 2.5
  return 2
}

function statusClasses(status: string) {
  if (status === 'Activo' || status === 'Abierto') return 'bg-green-100 text-green-700'
  if (status === 'Urgente') return 'bg-red-100 text-red-600'
  if (status === 'Casi lleno') return 'bg-amber-100 text-amber-700'
  if (status === 'Matrícula' || status === 'Examen') return 'bg-primary-100 text-primary-700'
  return 'bg-gray-100 text-gray-600'
}

function Badge({ children, tone }: { children: string; tone?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${tone ?? statusClasses(children)}`}>
      {children}
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

type CourseEntry = { name: string; credits: number; grade: number }
type ReminderEntry = { id: string; title: string; date: string; status: string }

const defaultCourses: Record<CourseKey, CourseEntry> = {
  calculo: { name: 'Cálculo I', credits: 4, grade: 91 },
  programacion: { name: 'Programación I', credits: 3, grade: 95 },
  fisica: { name: 'Física I', credits: 4, grade: 87 },
}

export default function VidaUniversitaria() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabKey>('gpa')
  const [university, setUniversity] = useState(universities[0])
  const [calendarUniversity, setCalendarUniversity] = useState('UTP')
  const [courses, setCourses] = useState<Record<CourseKey, CourseEntry>>(defaultCourses)
  const [userReminders, setUserReminders] = useState<ReminderEntry[]>([])
  const [newReminder, setNewReminder] = useState({ title: '', date: '' })
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [savingGpa, setSavingGpa] = useState(false)
  const [savedGpa, setSavedGpa] = useState(false)


  useEffect(() => {
    document.title = 'Vida universitaria | Uniference'
  }, [])

  useEffect(() => {
    if (!user) return
    getUserProfile(user.uid).then(prof => {
      if (prof.gpaData) {
        try {
          const parsed = JSON.parse(prof.gpaData)
          if (parsed && typeof parsed === 'object') setCourses(parsed)
        } catch { /* ignore */ }
      }
      if (prof.remindersData) {
        try {
          const parsed = JSON.parse(prof.remindersData)
          if (Array.isArray(parsed)) setUserReminders(parsed)
        } catch { /* ignore */ }
      }
    })
  }, [user])

  const gpa = useMemo(() => {
    const values = Object.values(courses)
    const totalCredits = values.reduce((sum, course) => sum + course.credits, 0)
    const weighted = values.reduce((sum, course) => sum + gradeToPoints(course.grade) * course.credits, 0)
    return totalCredits ? weighted / totalCredits : 0
  }, [courses])

  const gpaStatus = gpa >= 4 ? 'Buen rendimiento' : 'En observación'

  function updateCourse(courseKey: CourseKey, field: 'credits' | 'grade', value: number) {
    setCourses(current => ({
      ...current,
      [courseKey]: {
        ...current[courseKey],
        [field]: Number.isFinite(value) ? value : 0,
      },
    }))
  }

  async function handleSaveGpa() {
    if (!user) return
    setSavingGpa(true)
    try {
      await saveUserProfile(user.uid, { gpaData: JSON.stringify(courses) })
      setSavedGpa(true)
      setTimeout(() => setSavedGpa(false), 2000)
    } finally {
      setSavingGpa(false)
    }
  }

  async function handleAddReminder() {
    if (!user || !newReminder.title.trim()) return
    const entry: ReminderEntry = { id: Date.now().toString(), title: newReminder.title.trim(), date: newReminder.date, status: 'Activo' }
    const updated = [entry, ...userReminders]
    setUserReminders(updated)
    setNewReminder({ title: '', date: '' })
    setShowReminderForm(false)
    await saveUserProfile(user.uid, { remindersData: JSON.stringify(updated) })
  }

  async function handleDeleteReminder(id: string) {
    if (!user) return
    const updated = userReminders.filter(r => r.id !== id)
    setUserReminders(updated)
    await saveUserProfile(user.uid, { remindersData: JSON.stringify(updated) })
  }

  const allReminders = [...userReminders, ...reminders.map(r => ({ ...r, id: `static-${r.title}` }))]

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
            <GraduationCap className="w-4 h-4" />
            Vida universitaria
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-4"
          >
            Herramientas para organizar mejor tu semestre.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="text-primary-100 text-lg leading-relaxed max-w-3xl mx-auto md:mx-0"
          >
            Calcula tu promedio, revisa fechas importantes, comparte recursos, únete a grupos de estudio y compara profesores antes de matricularte.
          </motion.p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-12 pb-16 relative z-20">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8" aria-label="Resumen de vida universitaria">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2" role="tablist" aria-label="Herramientas de vida universitaria">
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
          {activeTab === 'gpa' && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
                <div>
                  <SectionLabel
                    eyebrow="Promedio"
                    title="Calculadora de promedio/GPA"
                    description="Cada universidad puede manejar escalas diferentes. Esta versión usa datos de ejemplo y servirá como base visual."
                  />

                  <label className="block mb-5">
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Universidad
                    </span>
                    <select
                      value={university}
                      onChange={event => setUniversity(event.target.value)}
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                    >
                      {universities.map(item => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>

                  {/* TODO: conectar escalas reales por universidad y guardar simulaciones del estudiante si se define en Firestore. */}
                  <div className="space-y-3">
                    {(Object.entries(courses) as [CourseKey, typeof courses[CourseKey]][]).map(([key, course]) => (
                      <div key={key} className="grid grid-cols-1 md:grid-cols-[1fr_120px_120px] gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div>
                          <p className="font-extrabold text-gray-900">{course.name}</p>
                          <p className="text-xs text-gray-400 mt-1">Escala visual local · {university}</p>
                        </div>
                        <label>
                          <span className="block text-xs font-semibold text-gray-400 mb-1">Créditos</span>
                          <input
                            type="number"
                            min="0"
                            value={course.credits}
                            onChange={event => updateCourse(key, 'credits', Number(event.target.value))}
                            className="w-full rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </label>
                        <label>
                          <span className="block text-xs font-semibold text-gray-400 mb-1">Nota</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={course.grade}
                            onChange={event => updateCourse(key, 'grade', Number(event.target.value))}
                            className="w-full rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="rounded-3xl bg-primary-50 border border-primary-100 p-6 self-start">
                  <div className="w-12 h-12 rounded-2xl bg-white text-primary-600 flex items-center justify-center mb-5">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-primary-700">Promedio estimado</p>
                  <p className="text-5xl font-extrabold text-primary-900 mt-1">{gpa.toFixed(1)}</p>
                  <div className="mt-4">
                    <Badge tone="bg-green-100 text-green-700">{gpaStatus}</Badge>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveGpa}
                    disabled={savingGpa}
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors disabled:opacity-70"
                  >
                    {savingGpa ? <Loader2 className="w-4 h-4 animate-spin" /> : savedGpa ? <Check className="w-4 h-4" /> : null}
                    {savedGpa ? 'Guardado' : 'Guardar GPA'}
                  </button>
                </aside>
              </div>
            </motion.div>
          )}

          {activeTab === 'calendario' && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-5 items-start">
                <SectionLabel
                  eyebrow="Calendario"
                  title="Calendario académico"
                  description="Revisa fechas de matrícula, clases, parciales y recesos por universidad con datos de ejemplo."
                />
                <label className="block">
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Universidad
                  </span>
                  <select
                    value={calendarUniversity}
                    onChange={event => setCalendarUniversity(event.target.value)}
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                  >
                    {['UTP', 'UP', 'USMA', 'Otra'].map(item => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* TODO: conectar calendario académico real por universidad. */}
              {/* TODO: permitir recordatorios reales en una fase posterior. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {academicDates.map((date, i) => (
                  <motion.article
                    key={date.title}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="rounded-3xl border border-gray-100 bg-gray-50 p-5"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex flex-col items-center justify-center text-primary-700 shadow-sm">
                        <span className="text-lg font-extrabold">{date.date.split(' ')[0]}</span>
                        <span className="text-xs font-bold">{date.date.split(' ')[1]}</span>
                      </div>
                      <Badge>{date.type}</Badge>
                    </div>
                    <h3 className="font-extrabold text-gray-900">{date.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{calendarUniversity || date.university}</p>
                    <button
                      type="button"
                      onClick={() => console.log('Create reminder placeholder', date)}
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                    >
                      <Bell className="w-4 h-4" />
                      Crear recordatorio
                    </button>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'apuntes' && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="space-y-5 mb-8"
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <SectionLabel
                  eyebrow="Apuntes"
                  title="Banco de apuntes y recursos"
                  description="Comparte resúmenes, guías o enlaces útiles con otros estudiantes. Esta vista todavía no sube archivos reales."
                />

                {/* TODO: conectar banco de apuntes con Firestore y Storage. */}
                {/* TODO: moderar recursos compartidos por estudiantes. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ['Título del recurso', 'Resumen de derivadas'],
                    ['Materia', 'Cálculo I'],
                    ['Universidad', 'UTP'],
                    ['Tipo', 'Resumen / PDF / Guía / Enlace'],
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
                      Descripción
                    </span>
                    <textarea
                      value="Material de ejemplo para repasar antes del parcial."
                      readOnly
                      rows={3}
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 resize-none"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => console.log('Upload note placeholder')}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Subir recurso
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {notes.map((note, i) => (
                  <motion.article
                    key={note.title}
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
                    <h3 className="font-extrabold text-gray-900 mb-2">{note.title}</h3>
                    <p className="text-sm text-gray-500">{note.subject} · {note.university}</p>
                    <p className="text-xs font-bold text-primary-700 mt-3">{note.type} · Compartido por {note.sharedBy}</p>
                    <div className="grid grid-cols-3 gap-2 mt-5">
                      <VisualActionButton label="Ver recurso" onClick={() => console.log('View note placeholder', note)} />
                      <VisualActionButton label="Guardar" onClick={() => console.log('Save note placeholder', note)} />
                      <VisualActionButton label="Reportar" tone="danger" onClick={() => console.log('Report note placeholder', note)} />
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'grupos' && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="space-y-5 mb-8"
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <SectionLabel
                  eyebrow="Grupos"
                  title="Grupos de estudio"
                  description="Crea o encuentra grupos por materia y universidad. Las acciones son visuales en esta fase."
                />

                {/* TODO: conectar creación/unión a grupos con Firestore y permisos de usuario. */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    ['Materia', 'Cálculo I'],
                    ['Universidad', 'UTP'],
                    ['Nombre del grupo', 'Cálculo I antes del parcial'],
                    ['Modalidad', 'Presencial / Virtual / Híbrido'],
                    ['Cupos', '12 estudiantes'],
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
                </div>
                <button
                  type="button"
                  onClick={() => console.log('Create study group placeholder')}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Crear grupo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {studyGroups.map((group, i) => (
                  <motion.article
                    key={group.title}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <Badge>{group.status}</Badge>
                    </div>
                    <h3 className="font-extrabold text-gray-900 mb-2">{group.title}</h3>
                    <p className="text-sm text-gray-500">{group.university} · {group.mode}</p>
                    <p className="text-xs font-bold text-primary-700 mt-3">Miembros: {group.members}</p>
                    <div className="grid grid-cols-2 gap-2 mt-5">
                      <VisualActionButton label="Unirme" tone="primary" onClick={() => console.log('Join group placeholder', group)} />
                      <VisualActionButton label="Ver detalles" onClick={() => console.log('Group details placeholder', group)} />
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'recordatorios' && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="space-y-5 mb-8"
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <SectionLabel
                  eyebrow="Recordatorios"
                  title="Fechas que no quieres olvidar"
                  description="Mantén visibles parciales, entregas y periodos de matrícula importantes."
                />

                <div className="flex justify-end mb-3">
                  <button
                    type="button"
                    onClick={() => setShowReminderForm(v => !v)}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar recordatorio
                  </button>
                </div>

                {showReminderForm && (
                  <div className="rounded-3xl border border-primary-100 bg-primary-50/50 p-4 mb-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                    <label className="block">
                      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Título</span>
                      <input
                        value={newReminder.title}
                        onChange={e => setNewReminder(p => ({ ...p, title: e.target.value }))}
                        placeholder="Ej. Parcial de Física"
                        className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Fecha</span>
                      <input
                        type="date"
                        value={newReminder.date}
                        onChange={e => setNewReminder(p => ({ ...p, date: e.target.value }))}
                        className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      />
                    </label>
                    <div className="flex gap-2">
                      <button type="button" onClick={handleAddReminder} className="inline-flex items-center gap-1.5 rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => setShowReminderForm(false)} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {allReminders.map((reminder) => {
                    const isUserReminder = !reminder.id.startsWith('static-')
                    return (
                      <article
                        key={reminder.id}
                        className="grid grid-cols-1 lg:grid-cols-[1fr_120px_auto] gap-3 items-center rounded-2xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div>
                          <h3 className="font-extrabold text-gray-900">{reminder.title}</h3>
                          <p className="text-sm text-gray-500">Fecha: {reminder.date}</p>
                        </div>
                        <Badge>{reminder.status}</Badge>
                        {isUserReminder && (
                          <button
                            type="button"
                            onClick={() => handleDeleteReminder(reminder.id)}
                            className="inline-flex items-center justify-center rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </article>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900">Notificaciones pendientes</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mt-1">
                      Las notificaciones reales se conectarán cuando el sistema de recordatorios esté disponible.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'comparador' && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-start">
                <SectionLabel
                  eyebrow="Comparador"
                  title="Compara profesores universitarios"
                  description="Esta vista compara profesores de universidad antes de matricularte. No compara instructores o tutores."
                />
                <label className="block">
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Agregar profesor a comparar
                  </span>
                  <select
                    defaultValue="Prof. Elena Vargas"
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                  >
                    {professors.map(professor => (
                      <option key={professor.name}>{professor.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* TODO: conectar comparador con profesores y reseñas reales existentes. */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {professors.map((professor, i) => (
                  <motion.article
                    key={professor.name}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="rounded-3xl border border-gray-100 bg-gray-50 p-5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white text-primary-700 flex items-center justify-center font-extrabold shadow-sm">
                        {i + 1}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {professor.rating}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-gray-900">{professor.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{professor.subject} · {professor.university}</p>
                    <div className="grid grid-cols-2 gap-3 my-5">
                      <div className="rounded-2xl bg-white border border-gray-100 p-3">
                        <p className="text-xs text-gray-400">Dificultad</p>
                        <p className="text-sm font-extrabold text-gray-900">{professor.difficulty}</p>
                      </div>
                      <div className="rounded-2xl bg-white border border-gray-100 p-3">
                        <p className="text-xs text-gray-400">Tareas</p>
                        <p className="text-sm font-extrabold text-gray-900">{professor.homework}</p>
                      </div>
                    </div>
                    <blockquote className="text-sm text-gray-600 leading-relaxed bg-white rounded-2xl border-l-4 border-primary-400 px-4 py-3">
                      "{professor.comment}"
                    </blockquote>
                    <button
                      type="button"
                      onClick={() => console.log('View reviews placeholder', professor)}
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
                    >
                      Ver reseñas
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.article>
                ))}
              </div>

              <Link
                to="/buscar"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Search className="w-4 h-4" />
                Buscar más profesores
              </Link>
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
              <h2 className="text-2xl font-extrabold text-white mb-3">Herramientas para tomar mejores decisiones</h2>
              <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
                Esta pantalla reúne funcionalidades pensadas para apoyar la vida universitaria: organización, recursos, grupos, recordatorios y comparación antes de matricularse. Por ahora usa datos de ejemplo y quedará lista para conexión con datos reales en próximas fases.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-56">
              <Link
                to="/estudiante"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <BookOpenCheck className="w-4 h-4" />
                Ir al portal estudiante
              </Link>
              <Link
                to="/buscar"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
              >
                Buscar profesor
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
