import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'
import type { UserProfile } from './profile'

export interface PublicInstructor extends UserProfile {
  uid: string
}

export async function getPublicInstructors(): Promise<PublicInstructor[]> {
  const snap = await getDocs(query(collection(db, 'users'), where('role', '==', 'instructor')))
  return snap.docs
    .map(d => ({ uid: d.id, ...(d.data() as UserProfile) }))
    .filter(i => (i.subjects ?? []).some(s => s.status === 'active'))
}

export async function getPublicInstructor(uid: string): Promise<PublicInstructor | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return { uid, ...(snap.data() as UserProfile) }
}
