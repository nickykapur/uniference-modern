import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Crown } from 'lucide-react'

type PremiumInstructorAdProps = {
  instructorName: string
  subject: string
  description: string
  priceLabel: string
  university: string
  badgeLabel?: string
  ctaLabel?: string
  ctaHref?: string
}

export default function PremiumInstructorAd({
  instructorName,
  subject,
  description,
  priceLabel,
  university,
  badgeLabel = 'Instructor Premium',
  ctaLabel = 'Ver perfil',
  ctaHref = '/instructor',
}: PremiumInstructorAdProps) {
  return (
    <article className="bg-white border border-amber-100 rounded-3xl p-5 shadow-sm overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-300 via-primary-400 to-primary-600" />
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
          <Crown className="w-7 h-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 rounded-full px-2.5 py-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              {badgeLabel}
            </span>
            <span className="text-xs font-semibold text-gray-400">{university}</span>
          </div>
          <h3 className="text-lg font-extrabold text-gray-900">{instructorName}</h3>
          <p className="text-sm font-semibold text-primary-700">{subject}</p>
          <p className="text-sm text-gray-500 leading-relaxed mt-2">{description}</p>
        </div>

        <div className="sm:text-right flex-shrink-0">
          <p className="text-xs text-gray-400">Desde</p>
          <p className="text-xl font-extrabold text-gray-900 mb-3">{priceLabel}</p>
          <Link
            to={ctaHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
