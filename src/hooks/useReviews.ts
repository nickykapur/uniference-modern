import { useState } from 'react'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
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
        createdAt: Timestamp.now(),
      })
    } catch (e) {
      setError('Error submitting review. Please try again.')
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
        where('universidad', '==', universidad),
        where('aceptado', '==', true),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      const results = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Review))
        .filter((r) =>
          r.profesor.toLowerCase().includes(profesor.toLowerCase())
        )
      return results
    } catch (e) {
      setError('Error searching reviews.')
      return []
    } finally {
      setLoading(false)
    }
  }

  return { submitReview, searchReviews, loading, error }
}
