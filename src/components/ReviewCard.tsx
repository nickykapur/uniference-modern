import { BookOpen, User } from 'lucide-react'
import StarRating from './StarRating'
import type { Review } from '../types'
import { UNIVERSIDADES } from '../types'

export default function ReviewCard({ review }: { review: Review }) {
  const univName = UNIVERSIDADES[review.universidad as keyof typeof UNIVERSIDADES] ?? review.universidad

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{review.profesor}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{review.materia}</span>
          </div>
        </div>
        <StarRating value={review.rating} readonly size="sm" />
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-4">{review.comentario}</p>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
          {univName}
        </span>
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{review.userEmail?.split('@')[0] ?? 'Anónimo'}</span>
        </div>
      </div>
    </div>
  )
}
