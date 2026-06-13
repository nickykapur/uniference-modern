import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ArrowRight,
  Crown,
  Eye,
  Megaphone,
  Pencil,
  PauseCircle,
  Save,
  Trash2,
} from 'lucide-react'
import PremiumInstructorAd from '../components/PremiumInstructorAd'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const mockAds = [
  {
    title: 'Refuerzo de Cálculo antes de parciales',
    subject: 'Cálculo I',
    status: 'Activo',
    clicks: 48,
    impressions: 320,
  },
  {
    title: 'Tutoría de Programación desde cero',
    subject: 'Programación I',
    status: 'Borrador',
    clicks: 0,
    impressions: 0,
  },
]

function statusClasses(status: string) {
  return status === 'Activo'
    ? 'bg-green-100 text-green-700'
    : 'bg-amber-100 text-amber-700'
}

export default function MisAnuncios() {
  const [form, setForm] = useState({
    title: 'Refuerzo de Cálculo antes de parciales',
    subject: 'Cálculo I',
    description: 'Sesiones prácticas para llegar con confianza a los parciales.',
    price: '$15/hora',
    cta: 'Ver perfil',
    status: 'Activo',
  })

  useEffect(() => {
    document.title = 'Mis anuncios | Uniference'
  }, [])

  // TODO: conectar creación/edición de anuncios con Firestore.
  // TODO: permitir subida de banner o imagen promocional en una fase posterior.
  // TODO: reemplazar anuncios mock por anuncios reales del instructor premium.

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
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
                  Estado premium
                </p>
                <h2 className="text-2xl font-extrabold text-gray-900">Premium activo</h2>
                <p className="text-sm text-gray-500 mt-1">Plan: Instructor Premium · Próxima renovación: 15 de julio</p>
              </div>
            </div>
            <Link
              to="/instructor/premium"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
            >
              Administrar plan
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
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
              Editor
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Anuncio promocional</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Título del anuncio', 'title'],
                ['Materia destacada', 'subject'],
                ['Precio promocional', 'price'],
                ['CTA del anuncio', 'cta'],
                ['Estado', 'status'],
              ].map(([label, key]) => (
                <label key={key} className="block">
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    {label}
                  </span>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(current => ({ ...current, [key]: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                  />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Descripción corta
                </span>
                <textarea
                  value={form.description}
                  onChange={e => setForm(current => ({ ...current, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                />
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <button
                type="button"
                onClick={() => console.log('Save ad placeholder', form)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar anuncio
              </button>
              <button
                type="button"
                onClick={() => console.log('Preview ad placeholder', form)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Vista previa
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div>
              <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
                Vista previa
              </p>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Banner premium</h2>
            </div>
            <PremiumInstructorAd
              instructorName="Ana Rodríguez"
              subject={form.subject}
              description={form.description}
              priceLabel={form.price}
              university="UTP"
              badgeLabel="Instructor Premium"
              ctaLabel={form.cta}
              ctaHref="/instructor"
            />
          </motion.div>
        </section>

        <section>
          <p className="text-xs font-semibold text-primary-500 uppercase tracking-[0.16em] mb-1">
            Historial
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Anuncios mock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAds.map((ad, i) => (
              <motion.article
                key={ad.title}
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
                    {ad.status}
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
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Editar', icon: Pencil },
                    { label: 'Pausar', icon: PauseCircle },
                    { label: 'Eliminar', icon: Trash2 },
                  ].map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => console.log(`${label} ad placeholder`, ad.title)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
