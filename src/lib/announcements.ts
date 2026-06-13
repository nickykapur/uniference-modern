import {
  collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export interface Announcement {
  id?: string
  instructorId: string
  instructorName: string
  title: string
  subject: string
  description: string
  price: string
  cta: string
  university?: string
  status: 'active' | 'paused' | 'draft'
  clicks: number
  impressions: number
  createdAt?: unknown
}

export async function getInstructorAnnouncements(instructorId: string): Promise<Announcement[]> {
  const snap = await getDocs(query(collection(db, 'announcements'), where('instructorId', '==', instructorId)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement))
}

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const snap = await getDocs(query(collection(db, 'announcements'), where('status', '==', 'active')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement))
}

export async function saveAnnouncement(ann: Omit<Announcement, 'id' | 'createdAt' | 'clicks' | 'impressions'>): Promise<string> {
  const ref = await addDoc(collection(db, 'announcements'), {
    ...ann, clicks: 0, impressions: 0, createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>): Promise<void> {
  await updateDoc(doc(db, 'announcements', id), data)
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(db, 'announcements', id))
}
