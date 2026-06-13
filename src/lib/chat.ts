import {
  collection, query, where, getDocs, addDoc, onSnapshot, orderBy,
  serverTimestamp, doc, updateDoc, getDoc,
} from 'firebase/firestore'
import type { Unsubscribe } from 'firebase/firestore'
import { db } from './firebase'

export interface ChatDoc {
  id?: string
  subscriptionId: string
  studentId: string
  instructorId: string
  studentName: string
  instructorName: string
  subject: string
  price: string
  nextSession?: string
  status: 'active' | 'archived'
  unreadStudent?: number
  unreadInstructor?: number
}

export interface Message {
  id?: string
  chatId: string
  from: 'student' | 'instructor'
  senderId: string
  body: string
  createdAt?: unknown
}

export async function getChatById(chatId: string): Promise<ChatDoc | null> {
  const snap = await getDoc(doc(db, 'chats', chatId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as ChatDoc
}

export async function getStudentChats(studentId: string): Promise<ChatDoc[]> {
  const snap = await getDocs(query(collection(db, 'chats'), where('studentId', '==', studentId), where('status', '==', 'active')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatDoc))
}

export async function createChat(chat: Omit<ChatDoc, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'chats'), chat)
  return ref.id
}

export async function archiveChat(chatId: string): Promise<void> {
  await updateDoc(doc(db, 'chats', chatId), { status: 'archived' })
}

export function subscribeToMessages(chatId: string, callback: (msgs: Message[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'messages'), where('chatId', '==', chatId), orderBy('createdAt', 'asc')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)))
  )
}

export async function sendMessage(msg: Omit<Message, 'id' | 'createdAt'>): Promise<void> {
  await addDoc(collection(db, 'messages'), { ...msg, createdAt: serverTimestamp() })
}
