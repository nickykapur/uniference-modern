import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export interface UserProfile {
  // student fields
  university?: string
  career?: string
  semester?: string
  // instructor fields
  displayName?: string
  bio?: string
  universities?: string
  experience?: string
  specialty?: string
  isPremium?: boolean
  premiumRenewal?: string
  subjects?: Array<{ id: string; name: string; description: string; price: string; unit: string; status: string }>
  availability?: Array<{ day: string; time: string; available: boolean }>
  // preferences
  prefs?: Record<string, boolean>
  // vida universitaria
  gpaData?: string
  remindersData?: string
}

export async function getUserProfile(uid: string): Promise<UserProfile> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return {}
  const data = snap.data()
  // strip role field, return the rest
  const { role: _role, ...profile } = data
  return profile as UserProfile
}

export async function saveUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await setDoc(doc(db, 'users', uid), data, { merge: true })
}
