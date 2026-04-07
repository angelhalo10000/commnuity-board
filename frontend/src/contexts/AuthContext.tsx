import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { ViewerRole } from '../types'

interface AuthState {
  viewerRole: ViewerRole | null
  isAdmin: boolean
}

interface AuthContextType extends AuthState {
  setViewerRole: (role: ViewerRole | null) => void
  setIsAdmin: (v: boolean) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [viewerRole, setViewerRole] = useState<ViewerRole | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <AuthContext.Provider value={{ viewerRole, isAdmin, setViewerRole, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
