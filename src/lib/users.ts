import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { UserRole } from '../types'

export async function getUserRole(uid: string): Promise<UserRole | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return (snap.data().role as UserRole) ?? null
}

export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  await setDoc(doc(db, 'users', uid), { role }, { merge: true })
}
