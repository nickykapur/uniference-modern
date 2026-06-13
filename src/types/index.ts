export interface Review {
  id?: string
  profesor: string
  materia: string
  comentario: string
  rating: number
  universidad: string
  userId?: string
  userEmail?: string | null
  createdAt?: Date
  aceptado: boolean
  rechazado?: boolean
}

export interface Tutor {
  id?: string
  nombre: string
  universidad: string
  carrera: string
  materia: string
  whatsapp: string
  porQueGoodTutor: string
  disponibilidad: string[]
  tarifa: 'gratis' | 'pago'
  precio?: string
  fotoUrl?: string
  aceptado: boolean
  rechazado?: boolean
  createdAt?: unknown
}

export type UserRole = 'student' | 'instructor' | 'admin'

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  role?: UserRole
}

export type Universidad =
  | 'utp'
  | 'latina'
  | 'nacional'
  | 'usma'
  | 'isae'
  | 'umecit'

export const UNIVERSIDADES: Record<Universidad, string> = {
  utp: 'Universidad Tecnológica de Panamá',
  latina: 'Universidad Latina de Panamá',
  nacional: 'Universidad de Panamá',
  usma: 'USMA – Universidad Santa María La Antigua',
  isae: 'ISAE Universidad',
  umecit: 'UMECIT',
}
