import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { ViewerRole } from '../types'
import { adminApi } from '../api/admin'
import { viewerApi } from '../api/viewer'

interface AuthState {
  viewerRole: ViewerRole | null
  isAdmin: boolean
  ready: boolean
}

interface AuthContextType extends AuthState {
  setViewerRole: (role: ViewerRole | null) => void
  setIsAdmin: (v: boolean) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [viewerRole, setViewerRole] = useState<ViewerRole | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Promise.all([
      adminApi.getSession().then(() => setIsAdmin(true)).catch(() => {}),
      viewerApi.getSession().then(r => setViewerRole(r.data.role)).catch(() => {}),
    ]).finally(() => setReady(true))
  }, [])

  return (
    <AuthContext.Provider value={{ viewerRole, isAdmin, ready, setViewerRole, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
