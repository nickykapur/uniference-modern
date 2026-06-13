import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Briefcase, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { setUserRole } from '../lib/users'
import type { UserRole } from '../types'

export default function RoleSelect() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState<UserRole>('student')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!user) return
    setLoading(true)
    await setUserRole(user.uid, role)
    navigate(role === 'instructor' ? '/instructor' : '/estudiante')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¿Cómo usarás Uniference?</h1>
        <p className="text-gray-500 text-sm mb-8">Selecciona tu rol para personalizar tu experiencia</p>

        <div className="flex gap-3 mb-8">
          <button type="button" onClick={() => setRole('student')}
            className={`flex-1 flex flex-col items-center gap-2 py-6 rounded-xl border-2 transition-all ${
              role === 'student'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}>
            <BookOpen className="w-8 h-8" />
            <span className="font-semibold">Estudiante</span>
          </button>
          <button type="button" onClick={() => setRole('instructor')}
            className={`flex-1 flex flex-col items-center gap-2 py-6 rounded-xl border-2 transition-all ${
              role === 'instructor'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}>
            <Briefcase className="w-8 h-8" />
            <span className="font-semibold">Instructor</span>
          </button>
        </div>

        <button onClick={handleConfirm} disabled={loading}
          className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          Continuar
        </button>
      </div>
    </div>
  )
}
