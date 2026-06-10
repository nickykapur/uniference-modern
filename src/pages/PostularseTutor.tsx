import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Loader2, CheckCircle, BookOpen, Building2, User, Phone,
  Clock, DollarSign, Camera, ArrowRight, ArrowLeft, Eye,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'
import { UNIVERSIDADES } from '../types'

const UNI_COLORS: Record<string, string> = {
  utp:      'border-blue-200 hover:bg-blue-50 hover:border-blue-400',
  latina:   'border-orange-200 hover:bg-orange-50 hover:border-orange-400',
  nacional: 'border-red-200 hover:bg-red-50 hover:border-red-400',
  usma:     'border-purple-200 hover:bg-purple-50 hover:border-purple-400',
  isae:     'border-green-200 hover:bg-green-50 hover:border-green-400',
  umecit:   'border-teal-200 hover:bg-teal-50 hover:border-teal-400',
}
const UNI_ACTIVE: Record<string, string> = {
  utp:      'border-blue-500 bg-blue-50 text-blue-700',
  latina:   'border-orange-500 bg-orange-50 text-orange-700',
  nacional: 'border-red-500 bg-red-50 text-red-700',
  usma:     'border-purple-500 bg-purple-50 text-purple-700',
  isae:     'border-green-500 bg-green-50 text-green-700',
  umecit:   'border-teal-500 bg-teal-50 text-teal-700',
}

const DISPONIBILIDAD_OPTIONS = [
  'Lunes a Viernes (mañanas)',
  'Lunes a Viernes (tardes)',
  'Lunes a Viernes (noches)',
  'Fines de semana',
  'Virtual (cualquier horario)',
]

const slideVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40, transition: { duration: 0.2 } }),
}

const STEPS = ['Universidad', 'Tus datos', '¿Por qué tú?', 'Foto y envío']

interface FormState {
  universidad: string
  nombre: string
  carrera: string
  materia: string
  whatsapp: string
  disponibilidad: string[]
  tarifa: 'gratis' | 'pago'
  precio: string
  porQueGoodTutor: string
}

export default function PostularseTutor() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormState>({
    universidad: '',
    nombre: '',
    carrera: '',
    materia: '',
    whatsapp: '',
    disponibilidad: [],
    tarifa: 'gratis',
    precio: '',
    porQueGoodTutor: '',
  })

  const set = (field: keyof FormState, value: string | string[]) =>
    setForm(f => ({ ...f, [field]: value }))

  const toggleDisponibilidad = (opt: string) =>
    setForm(f => ({
      ...f,
      disponibilidad: f.disponibilidad.includes(opt)
        ? f.disponibilidad.filter(d => d !== opt)
        : [...f.disponibilidad, opt],
    }))

  const canNext = [
    !!form.universidad,
    !!form.nombre.trim() && !!form.carrera.trim() && !!form.materia.trim() && form.whatsapp.trim().length >= 7 && form.disponibilidad.length > 0,
    form.porQueGoodTutor.trim().length >= 30,
    true,
  ]

  const goTo = (next: number) => { setDir(next > step ? 1 : -1); setStep(next) }

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      let fotoUrl: string | undefined
      if (fotoFile) {
        const storageRef = ref(storage, `tutor-photos/${Date.now()}_${fotoFile.name}`)
        await uploadBytes(storageRef, fotoFile)
        fotoUrl = await getDownloadURL(storageRef)
      }

      await addDoc(collection(db, 'tutors'), {
        nombre: form.nombre.trim(),
        universidad: form.universidad,
        carrera: form.carrera.trim(),
        materia: form.materia.trim(),
        whatsapp: form.whatsapp.trim(),
        disponibilidad: form.disponibilidad,
        tarifa: form.tarifa,
        precio: form.tarifa === 'pago' ? form.precio.trim() : '',
        porQueGoodTutor: form.porQueGoodTutor.trim(),
        fotoUrl: fotoUrl ?? '',
        aceptado: false,
        createdAt: Timestamp.now(),
      })

      setDone(true)
    } catch (e) {
      console.error(e)
      setError('Error al enviar la solicitud. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center max-w-sm">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Solicitud enviada</h2>
          <p className="text-gray-500 text-sm mb-6">
            Tu perfil está en revisión. Una vez aprobado, aparecerás en la lista de tutores.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/tutores')}
              className="bg-primary-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors">
              Ver tutores
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-primary-500 pt-12 pb-24 px-4 text-center overflow-hidden">
        <ul className="circles">
          {Array.from({ length: 10 }).map((_, i) => <li key={i} />)}
        </ul>
        <div className="relative z-10">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Postularse como Tutor
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-primary-100">
            Comparte tu conocimiento y ayuda a otros estudiantes
          </motion.p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 -mt-16 pb-12 relative z-10">
        {/* Step indicators */}
        <div className="flex items-center justify-center mb-5 gap-1">
          {STEPS.map((_label, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-primary-500 text-white' :
                i === step ? 'bg-white text-primary-600 border-2 border-primary-500 shadow' :
                'bg-white text-gray-300 border border-gray-200'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-0.5 transition-all ${i < step ? 'bg-primary-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mb-4 font-medium">{STEPS[step]}</p>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              className="p-6 space-y-4">

              {/* Step 0: Universidad */}
              {step === 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Selecciona tu universidad</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(UNIVERSIDADES).map(([key, name]) => (
                      <button key={key} type="button"
                        onClick={() => set('universidad', key)}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          form.universidad === key ? UNI_ACTIVE[key] : `border-gray-100 ${UNI_COLORS[key]}`
                        }`}>
                        <p className="font-bold text-sm">{key.toUpperCase()}</p>
                        <p className="text-xs opacity-70 mt-0.5 leading-tight">{name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Personal info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      <User className="w-3 h-3 inline mr-1" />Nombre completo
                    </label>
                    <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
                      placeholder="Ej. Carlos Mendoza"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      <Building2 className="w-3 h-3 inline mr-1" />Carrera
                    </label>
                    <input value={form.carrera} onChange={e => set('carrera', e.target.value)}
                      placeholder="Ej. Ingeniería en Sistemas"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      <BookOpen className="w-3 h-3 inline mr-1" />Materia que puedes tutorear
                    </label>
                    <input value={form.materia} onChange={e => set('materia', e.target.value)}
                      placeholder="Ej. Cálculo I, Programación, Física..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      <Phone className="w-3 h-3 inline mr-1" />WhatsApp (con código de país)
                    </label>
                    <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
                      placeholder="Ej. 50769001234"
                      type="tel"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors" />
                    <p className="text-xs text-gray-400 mt-1">Los estudiantes te contactarán por aquí</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      <Clock className="w-3 h-3 inline mr-1" />Disponibilidad
                    </label>
                    <div className="space-y-2">
                      {DISPONIBILIDAD_OPTIONS.map(opt => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            form.disponibilidad.includes(opt)
                              ? 'bg-primary-500 border-primary-500'
                              : 'border-gray-300 group-hover:border-primary-400'
                          }`}
                            onClick={() => toggleDisponibilidad(opt)}>
                            {form.disponibilidad.includes(opt) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-gray-700" onClick={() => toggleDisponibilidad(opt)}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      <DollarSign className="w-3 h-3 inline mr-1" />Tarifa
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['gratis', 'pago'] as const).map(t => (
                        <button key={t} type="button" onClick={() => set('tarifa', t)}
                          className={`py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                            form.tarifa === t
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 text-gray-500 hover:border-primary-300'
                          }`}>
                          {t === 'gratis' ? '🎁 Gratis' : '💰 De pago'}
                        </button>
                      ))}
                    </div>
                    {form.tarifa === 'pago' && (
                      <motion.input initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        value={form.precio} onChange={e => set('precio', e.target.value)}
                        placeholder="Ej. $10/hora"
                        className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors" />
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Why good tutor */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      ¿Por qué crees que eres un buen tutor para <span className="text-primary-600">{form.materia || 'esta materia'}</span>?
                    </label>
                    <p className="text-xs text-gray-400 mb-3">Cuéntanos tu experiencia, logros académicos, metodología de enseñanza...</p>
                    <textarea
                      value={form.porQueGoodTutor}
                      onChange={e => set('porQueGoodTutor', e.target.value)}
                      rows={7}
                      placeholder="Ej. Saqué 95 en Cálculo I y II, ayudé a 8 compañeros a pasar el parcial. Explico paso a paso con ejercicios prácticos..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors resize-none"
                    />
                    <div className="flex justify-between mt-1">
                      <p className={`text-xs ${form.porQueGoodTutor.trim().length < 30 ? 'text-red-400' : 'text-gray-400'}`}>
                        Mínimo 30 caracteres
                      </p>
                      <p className="text-xs text-gray-400">{form.porQueGoodTutor.length}/500</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Photo + preview + submit */}
              {step === 3 && (
                <div className="space-y-5">
                  {/* Photo upload */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      <Camera className="w-3 h-3 inline mr-1" />Foto de perfil (opcional)
                    </label>
                    <div className="flex items-center gap-4">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all overflow-hidden flex-shrink-0">
                        {fotoPreview
                          ? <img src={fotoPreview} alt="preview" className="w-full h-full object-cover" />
                          : <Camera className="w-7 h-7 text-gray-300" />
                        }
                      </div>
                      <div>
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                          className="text-sm text-primary-600 font-semibold hover:underline">
                          {fotoPreview ? 'Cambiar foto' : 'Subir foto'}
                        </button>
                        <p className="text-xs text-gray-400 mt-1">JPG o PNG, máx 5MB</p>
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
                    </div>
                  </div>

                  {/* Preview card */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      <Eye className="w-3 h-3" /> Vista previa
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {fotoPreview
                          ? <img src={fotoPreview} alt="" className="w-full h-full object-cover" />
                          : form.nombre.charAt(0).toUpperCase() || '?'
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900">{form.nombre || '—'}</p>
                        <p className="text-xs text-gray-400">{form.carrera} · {UNIVERSIDADES[form.universidad as keyof typeof UNIVERSIDADES]}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <BookOpen className="w-3 h-3 text-primary-400" />
                          <p className="text-xs text-gray-600">{form.materia}</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${form.tarifa === 'gratis' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {form.tarifa === 'gratis' ? 'Gratis' : form.precio || 'De pago'}
                          </span>
                          {form.disponibilidad.slice(0, 2).map(d => (
                            <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                              {d.split('(')[0].trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <blockquote className="mt-3 text-xs text-gray-500 italic bg-white rounded-lg px-3 py-2 border-l-4 border-primary-300 leading-relaxed line-clamp-3">
                      "{form.porQueGoodTutor || '—'}"
                    </blockquote>
                  </div>

                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="px-6 pb-6 flex gap-3">
            {step > 0 && (
              <button type="button" onClick={() => goTo(step - 1)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Atrás
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => goTo(step + 1)} disabled={!canNext[step]}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition-all disabled:opacity-40 hover:scale-[1.01] active:scale-[0.99] shadow-md">
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition-all disabled:opacity-50 shadow-md">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                {loading ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
