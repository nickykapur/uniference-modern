import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { getUserRole, setUserRole } from '../lib/users'
import { isAdminEmail } from '../lib/admins'
import type { User, UserRole } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, role: UserRole) => Promise<void>
  loginWithGoogle: () => Promise<{ isNewUser: boolean }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email
        let role: UserRole | null = null
        if (isAdminEmail(email)) {
          role = 'admin'
        } else {
          role = await getUserRole(firebaseUser.uid)
        }
        setUser({
          uid: firebaseUser.uid,
          email,
          displayName: firebaseUser.displayName,
          role: role ?? undefined,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (email: string, password: string, role: UserRole) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await setUserRole(cred.user.uid, role)
  }

  const loginWithGoogle = async (): Promise<{ isNewUser: boolean }> => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const existingRole = await getUserRole(result.user.uid)
    return { isNewUser: existingRole === null }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
