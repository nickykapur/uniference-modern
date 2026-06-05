export interface Review {
  id?: string
  profesor: string
  materia: string
  comentario: string
  rating: number
  universidad: string
  userId?: string
  userEmail?: string
  createdAt?: Date
  aceptado: boolean
}

export interface User {
  uid: string
  email: string | null
  displayName: string | null
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
