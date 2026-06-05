import { Link } from 'react-router-dom'
import { Search, Star, Users, GraduationCap, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <GraduationCap className="w-4 h-4" />
          La mejor referencia de tu profesor
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Busca. Comenta.{' '}
          <span className="text-primary-600">Apoya.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Encuentra reseñas honestas de profesores en las universidades de Panamá.
          Comparte tu experiencia y ayuda a otros estudiantes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/buscar"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
          >
            <Search className="w-5 h-5" />
            Buscar Profesor
          </Link>
          <Link
            to="/evaluar"
            className="inline-flex items-center gap-2 bg-white text-gray-800 border border-gray-200 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Dejar una reseña
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-7 h-7 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Evalúa a tu profesor</h3>
            <p className="text-gray-500 text-sm">
              Califica con estrellas y deja un comentario detallado sobre tu experiencia en clase.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Busca antes de inscribirte</h3>
            <p className="text-gray-500 text-sm">
              Revisa las opiniones de otros estudiantes antes de elegir a tu profesor.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Encuentra tutores</h3>
            <p className="text-gray-500 text-sm">
              Conecta con tutores disponibles en tu universidad para reforzar lo aprendido.
            </p>
          </div>
        </div>
      </section>

      {/* Universities */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-8">
            Universidades disponibles
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Universidad Tecnológica de Panamá', 'Universidad de Panamá', 'USMA', 'Universidad Latina', 'ISAE Universidad', 'UMECIT'].map(u => (
              <span key={u} className="bg-gray-50 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-full text-sm font-medium">
                {u}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
