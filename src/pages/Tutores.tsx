import { BookOpen, MessageCircle, Star } from 'lucide-react'

const TUTORES_MOCK = [
  { name: 'Carlos M.', materia: 'Cálculo I y II', universidad: 'UTP', rating: 4.8, reviews: 12, disponible: true },
  { name: 'Ana R.', materia: 'Programación, Estructuras de Datos', universidad: 'Universidad de Panamá', rating: 4.9, reviews: 21, disponible: true },
  { name: 'Luis P.', materia: 'Física General', universidad: 'UTP', rating: 4.5, reviews: 8, disponible: false },
  { name: 'María G.', materia: 'Química Orgánica', universidad: 'USMA', rating: 4.7, reviews: 15, disponible: true },
  { name: 'Pedro C.', materia: 'Inglés Técnico, Redacción', universidad: 'Universidad Latina', rating: 4.6, reviews: 10, disponible: true },
  { name: 'Sofia V.', materia: 'Estadística, Probabilidad', universidad: 'UTP', rating: 4.8, reviews: 18, disponible: false },
]

export default function Tutores() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tutores Disponibles</h1>
          <p className="text-gray-500">Conecta con estudiantes avanzados que pueden ayudarte con tus materias</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TUTORES_MOCK.map((tutor) => (
            <div key={tutor.name} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-lg">
                  {tutor.name[0]}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  tutor.disponible
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {tutor.disponible ? 'Disponible' : 'Ocupado'}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{tutor.universidad}</p>

              <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                <BookOpen className="w-4 h-4 text-primary-400" />
                <span>{tutor.materia}</span>
              </div>

              <div className="flex items-center gap-1 mb-5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium text-gray-700">{tutor.rating}</span>
                <span className="text-xs text-gray-400">({tutor.reviews} reseñas)</span>
              </div>

              <button
                disabled={!tutor.disponible}
                className={`w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                  tutor.disponible
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Contactar
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary-50 border border-primary-100 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">¿Eres tutor?</h2>
          <p className="text-gray-500 text-sm mb-5">Ofrece tus servicios y ayuda a otros estudiantes mientras ganas dinero.</p>
          <button className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
            Registrarse como tutor
          </button>
        </div>
      </div>
    </div>
  )
}
