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

// Levenshtein distance — measures how many edits separate two strings
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
  return dp[m][n]
}

// Returns closest professor names to the query from a list of known names
export function fuzzyMatch(query: string, names: string[], topN = 3): string[] {
  const q = query.toLowerCase()
  return names
    .map(name => ({
      name,
      score: levenshtein(q, name.toLowerCase()),
    }))
    .filter(({ score, name }) => {
      // Accept if distance is small relative to name length, OR if query is a substring
      const maxDist = Math.floor(name.length * 0.4)
      return score <= maxDist || name.toLowerCase().includes(q)
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, topN)
    .map(({ name }) => name)
}

export function useReviews() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const submitReview = async (review: Omit<Review, 'id' | 'createdAt'>): Promise<string> => {
    setLoading(true)
    setError(null)
    try {
      const docRef = await addDoc(collection(db, 'reviews'), {
        ...review,
        aceptado: false,
        createdAt: Timestamp.now(),
      })
      return docRef.id
    } catch (e) {
      setError('Error al enviar la reseña. Intenta de nuevo.')
      throw e
    } finally {
      setLoading(false)
    }
  }

  const searchReviews = async (universidad: string, profesor: string): Promise<Review[]> => {
    setLoading(true)
    setError(null)
    setSuggestions([])
    try {
      const q = query(
        collection(db, 'reviews'),
        where('universidad', '==', universidad),
        where('aceptado', '==', true),
      )
      const snapshot = await getDocs(q)
      const allReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review))

      const matched = allReviews
        .filter((r) => {
          const name = r.profesor.toLowerCase()
          const terms = profesor.toLowerCase().trim().split(/\s+/)
          return terms.every(t => name.includes(t))
        })
        .sort((a, b) => {
          const ta = (a.createdAt as unknown as { seconds: number })?.seconds ?? 0
          const tb = (b.createdAt as unknown as { seconds: number })?.seconds ?? 0
          return tb - ta
        })

      // If no results, run fuzzy match against all known professor names
      if (matched.length === 0 && profesor.trim().length > 0) {
        const allNames = Array.from(new Set(allReviews.map(r => r.profesor)))
        const fuzzy = fuzzyMatch(profesor, allNames)
        setSuggestions(fuzzy)
      }

      return matched
    } catch (e: unknown) {
      const code = (e as { code?: string }).code
      const msg = (e as { message?: string }).message ?? ''
      if (code === 'permission-denied') {
        setError('Permiso denegado — revisa las reglas de Firestore.')
      } else {
        setError(`Error: ${code ?? msg}`)
      }
      return []
    } finally {
      setLoading(false)
    }
  }

  return { submitReview, searchReviews, loading, error, suggestions }
}
