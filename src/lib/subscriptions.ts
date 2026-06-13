import {
  collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export interface Subscription {
  id?: string
  studentId: string
  studentName: string
  instructorId: string
  instructorName: string
  subject: string
  price: string
  status: 'active' | 'cancelled' | 'pending'
  nextSession?: string
  createdAt?: unknown
}

export async function getStudentSubscriptions(studentId: string): Promise<Subscription[]> {
  const snap = await getDocs(query(collection(db, 'subscriptions'), where('studentId', '==', studentId)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Subscription))
}

export async function getInstructorSubscriptions(instructorId: string): Promise<Subscription[]> {
  const snap = await getDocs(query(collection(db, 'subscriptions'), where('instructorId', '==', instructorId)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Subscription))
}

export async function createSubscription(sub: Omit<Subscription, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'subscriptions'), { ...sub, createdAt: serverTimestamp() })
  return ref.id
}

export async function cancelSubscription(subId: string): Promise<void> {
  await updateDoc(doc(db, 'subscriptions', subId), { status: 'cancelled' })
}
