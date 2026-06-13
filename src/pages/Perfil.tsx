import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Eye,
  GraduationCap,
  ImagePlus,
  RotateCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRoundCog,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

type TabKey = 'cuenta' | 'estudiante' | 'instructor' | 'notificaciones' | 'privacidad'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'cuenta', label: 'Cuenta', icon: UserRoundCog },
  { key: 'estudiante', label: 'Estudiante', icon: GraduationCap },
  { key: 'instructor', label: 'Instructor', icon: BriefcaseBusiness },
  { key: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { key: 'privacidad', label: 'Privacidad', icon: ShieldCheck },
]

const initialToggles = {
  studentShowUniversity: true,
  studentShowCareer: true,
  studentInterestsVisible: false,
  studentTutorRecommendations: true,
  instructorPublicProfile: true,
  instructorShowExperience: true,
  instructorShowPrices: true,
  instructorAllowRequests: true,
  notifyImportantEmails: true,
  notifyMessages: true,
  notifyReviews: false,
  notifySessionReminders: true,
  notifyPlatformUpdates: true,
  privacyShowEmail: false,
  privacyShowUniversity: true,
  privacyShowSpecialty: true,
  privacyShowRating: true,
  privacyShowAvailability: true,
  privacyDiscoverable: true,
}

type ToggleKey = keyof typeof initialToggles

function PreferenceToggle({ label, description, checked, onToggle }: {
  label: string
  description?: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-left hover:bg-white hover:shadow-sm transition-all"
    >
      <span>
        <span className="block text-sm font-semibold text-gray-800">{label}</span>
        {description && <span className="block text-xs text-gray-400 mt-0.5">{description}</span>}
      </span>
      <span className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors flex-shrink-0 ${
        checked ? 'bg-primary-500' : 'bg-gray-300'
      }`}>
        <span className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </span>
    </button>
  )
}

function SectionTitle({ eyebrow, title, description }: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">{eyebrow}</p>
      <h2 className="text-2xl font-extrabold text-gray-900">{title}</h2>
      {description && <p className="text-sm text-gray-500 leading-relaxed mt-2 max-w-2xl">{description}</p>}
    </div>
  )
}

export default function Perfil() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabKey>('cuenta')
  const [toggles, setToggles] = useState(initialToggles)
  const displayName = user?.displayName?.trim() || 'Usuario Uniference'
  const email = user?.email ?? 'correo@uniference.com'
  const initialSource = user?.displayName?.trim() || user?.email || 'U'
  const initial = initialSource.charAt(0).toUpperCase()

  useEffect(() => {
    document.title = 'Perfil y configuración | Uniference'
  }, [])

  const toggle = (key: ToggleKey) => {
    setToggles(current => ({ ...current, [key]: !current[key] }))
  }

  // TODO: conectar datos de cuenta con Firestore cuando esté disponible.
  const account = {
    name: displayName,
    email,
    university: 'Universidad Tecnológica de Panamá',
    mainRole: 'Estudiante e instructor',
    status: 'Perfil en construcción',
  }

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
                Perfil compartido
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.55 }}
                className="text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-4"
              >
                Perfil y configuración
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.5 }}
                className="text-primary-100 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0"
              >
                Administra cómo se muestra tu información, tus preferencias de comunicación y la forma en que participas dentro de Uniference.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.22, duration: 0.5 }}
              className="mx-auto md:mx-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/15 border border-white/25 p-2 shadow-2xl"
              aria-label={`Avatar de ${displayName}`}
            >
              <div className="w-full h-full rounded-full bg-white text-primary-600 flex items-center justify-center text-4xl font-extrabold">
                {initial}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-12 pb-16 relative z-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-3 grid grid-cols-2 lg:grid-cols-5 gap-2 mb-8"
          role="tablist"
          aria-label="Configuración de perfil"
        >
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              aria-controls={`panel-${key}`}
              onClick={() => setActiveTab(key)}
              className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold transition-colors ${
                activeTab === key
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </motion.div>

        <motion.section
          key={activeTab}
          id={`panel-${activeTab}`}
          role="tabpanel"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8"
        >
          {activeTab === 'cuenta' && (
            <div>
              <SectionTitle
                eyebrow="Cuenta"
                title="Información principal"
                description="Estos datos representan la base compartida para tu experiencia como estudiante e instructor."
              />
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-64 flex-shrink-0">
                  <div className="rounded-3xl bg-gray-50 border border-gray-100 p-5 text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-md mb-4">
                      {initial}
                    </div>
                    <button
                      type="button"
                      onClick={() => console.log('Photo change placeholder')}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                    >
                      <ImagePlus className="w-4 h-4" />
                      Cambiar foto
                    </button>
                    <p className="text-xs text-gray-400 mt-3">
                      La subida de foto se conectará cuando Firebase Storage esté disponible.
                    </p>
                    {/* TODO: conectar subida/cambio de foto con Firebase Storage cuando esté disponible. */}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ['Nombre', account.name],
                    ['Correo', account.email],
                    ['Universidad principal', account.university],
                    ['Rol principal', account.mainRole],
                    ['Estado del perfil', account.status],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'estudiante' && (
            <div>
              <SectionTitle
                eyebrow="Rol estudiante"
                title="Preferencias de estudiante"
                description="Controla cómo se presenta tu información académica y qué apoyo quieres recibir."
              />
              {/* TODO: conectar preferencias del estudiante con Firestore. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PreferenceToggle label="Mostrar universidad en perfil" checked={toggles.studentShowUniversity} onToggle={() => toggle('studentShowUniversity')} />
                <PreferenceToggle label="Mostrar carrera" checked={toggles.studentShowCareer} onToggle={() => toggle('studentShowCareer')} />
                <PreferenceToggle label="Permitir que instructores vean mis intereses académicos" checked={toggles.studentInterestsVisible} onToggle={() => toggle('studentInterestsVisible')} />
                <PreferenceToggle label="Recibir recomendaciones de tutores" checked={toggles.studentTutorRecommendations} onToggle={() => toggle('studentTutorRecommendations')} />
              </div>
              <Link
                to="/estudiante"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
              >
                Ir al Portal estudiante
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {activeTab === 'instructor' && (
            <div>
              <SectionTitle
                eyebrow="Rol instructor"
                title="Preferencias de instructor"
                description="Define qué información verá la comunidad cuando busquen apoyo académico."
              />
              {/* TODO: conectar preferencias del instructor con Firestore. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PreferenceToggle label="Mostrar perfil público como instructor" checked={toggles.instructorPublicProfile} onToggle={() => toggle('instructorPublicProfile')} />
                <PreferenceToggle label="Mostrar años de experiencia" checked={toggles.instructorShowExperience} onToggle={() => toggle('instructorShowExperience')} />
                <PreferenceToggle label="Mostrar precios desde el perfil público" checked={toggles.instructorShowPrices} onToggle={() => toggle('instructorShowPrices')} />
                <PreferenceToggle label="Permitir solicitudes de nuevos estudiantes" checked={toggles.instructorAllowRequests} onToggle={() => toggle('instructorAllowRequests')} />
              </div>
              <Link
                to="/instructor"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
              >
                Ir al Portal instructor
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {activeTab === 'notificaciones' && (
            <div>
              <SectionTitle
                eyebrow="Comunicación"
                title="Notificaciones"
                description="Elige qué avisos quieres recibir cuando esta configuración esté conectada."
              />
              {/* TODO: conectar configuración de notificaciones con Firestore o servicio correspondiente. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PreferenceToggle label="Recibir emails importantes" checked={toggles.notifyImportantEmails} onToggle={() => toggle('notifyImportantEmails')} />
                <PreferenceToggle label="Recibir mensajes de estudiantes/instructores" checked={toggles.notifyMessages} onToggle={() => toggle('notifyMessages')} />
                <PreferenceToggle label="Recibir avisos de nuevas reseñas" checked={toggles.notifyReviews} onToggle={() => toggle('notifyReviews')} />
                <PreferenceToggle label="Recibir recordatorios de sesiones" checked={toggles.notifySessionReminders} onToggle={() => toggle('notifySessionReminders')} />
                <PreferenceToggle label="Recibir actualizaciones de la plataforma" checked={toggles.notifyPlatformUpdates} onToggle={() => toggle('notifyPlatformUpdates')} />
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Estas preferencias se guardarán cuando la configuración de cuenta esté conectada.
              </p>
            </div>
          )}

          {activeTab === 'privacidad' && (
            <div>
              <SectionTitle
                eyebrow="Privacidad"
                title="Control de visibilidad"
                description="Configura qué detalles deberían aparecer públicamente en tus perfiles."
              />
              <div className="rounded-2xl bg-primary-50 border border-primary-100 p-4 mb-5 flex items-start gap-3">
                <Eye className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-primary-800 leading-relaxed">
                  Tu privacidad importa. Estas opciones ayudarán a controlar qué información se muestra públicamente.
                </p>
              </div>
              {/* TODO: conectar configuración de privacidad con Firestore. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PreferenceToggle label="Mostrar email en mi perfil" checked={toggles.privacyShowEmail} onToggle={() => toggle('privacyShowEmail')} />
                <PreferenceToggle label="Mostrar universidad" checked={toggles.privacyShowUniversity} onToggle={() => toggle('privacyShowUniversity')} />
                <PreferenceToggle label="Mostrar carrera o especialidad" checked={toggles.privacyShowSpecialty} onToggle={() => toggle('privacyShowSpecialty')} />
                <PreferenceToggle label="Mostrar calificación promedio" checked={toggles.privacyShowRating} onToggle={() => toggle('privacyShowRating')} />
                <PreferenceToggle label="Mostrar disponibilidad semanal" checked={toggles.privacyShowAvailability} onToggle={() => toggle('privacyShowAvailability')} />
                <PreferenceToggle label="Permitir que otros usuarios encuentren mi perfil" checked={toggles.privacyDiscoverable} onToggle={() => toggle('privacyDiscoverable')} />
              </div>
            </div>
          )}
        </motion.section>

        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-center">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                <SlidersHorizontal className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Acciones de cuenta</h2>
              <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
                Por ahora esta pantalla es una base visual. La persistencia de datos se conectará en una épica posterior.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <button
                type="button"
                onClick={() => console.log('Save settings placeholder')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => setToggles(initialToggles)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restablecer
              </button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
