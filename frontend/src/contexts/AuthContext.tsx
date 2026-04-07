import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { ViewerRole } from '../types'
import { adminApi } from '../api/admin'
import { viewerApi } from '../api/viewer'

interface AuthState {
  viewerRole: ViewerRole | null
  isAdmin: boolean
  orgName: string
  ready: boolean
}

interface AuthContextType extends AuthState {
  setViewerRole: (role: ViewerRole | null) => void
  setIsAdmin: (v: boolean) => void
  setOrgName: (name: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [viewerRole, setViewerRole] = useState<ViewerRole | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Promise.all([
      adminApi.getSession().then(r => { setIsAdmin(true); setOrgName(r.data.organization_name) }).catch(() => {}),
      viewerApi.getSession().then(r => { setViewerRole(r.data.role); setOrgName(r.data.organization_name) }).catch(() => {}),
    ]).finally(() => setReady(true))
  }, [])

  return (
    <AuthContext.Provider value={{ viewerRole, isAdmin, orgName, ready, setViewerRole, setIsAdmin, setOrgName }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
