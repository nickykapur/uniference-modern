import { useState } from 'react'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Review } from '../types'

export function useReviews() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    setLoading(true)
    setError(null)
    try {
      await addDoc(collection(db, 'reviews'), {
        ...review,
        aceptado: false,
        createdAt: Timestamp.now(),
      })
    } catch (e) {
      console.error('Submit error:', e)
      setError('Error al enviar la reseña. Intenta de nuevo.')
      throw e
    } finally {
      setLoading(false)
    }
  }

  const searchReviews = async (universidad: string, profesor: string): Promise<Review[]> => {
    setLoading(true)
    setError(null)
    try {
      const q = query(
        collection(db, 'reviews'),
        where('universidad', '==', universidad)
      )
      const snapshot = await getDocs(q)
      const results = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Review))
        .filter((r) => r.profesor.toLowerCase().includes(profesor.toLowerCase()))
        .sort((a, b) => {
          const ta = (a.createdAt as unknown as { seconds: number })?.seconds ?? 0
          const tb = (b.createdAt as unknown as { seconds: number })?.seconds ?? 0
          return tb - ta
        })
      return results
    } catch (e: unknown) {
      console.error('Search error:', e)
      const code = (e as { code?: string }).code
      if (code === 'permission-denied') {
        setError('Acceso denegado. Actualiza las reglas de Firestore en Firebase Console.')
      } else {
        setError('Error al buscar reseñas. Intenta de nuevo.')
      }
      return []
    } finally {
      setLoading(false)
    }
  }

  return { submitReview, searchReviews, loading, error }
}
