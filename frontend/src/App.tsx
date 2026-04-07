import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

import EnterPage from './pages/viewer/EnterPage'
import ViewerLayout from './pages/viewer/Layout'
import TopPage from './pages/viewer/TopPage'
import NoticesPage from './pages/viewer/NoticesPage'
import NoticeDetailPage from './pages/viewer/NoticeDetailPage'
import CircularsPage from './pages/viewer/CircularsPage'
import CircularDetailPage from './pages/viewer/CircularDetailPage'

import AdminLoginPage from './pages/admin/LoginPage'
import AdminLayout from './pages/admin/Layout'
import AdminNoticesPage from './pages/admin/NoticesPage'
import NoticeFormPage from './pages/admin/NoticeFormPage'
import AdminCircularsPage from './pages/admin/CircularsPage'
import CircularFormPage from './pages/admin/CircularFormPage'
import SettingsPage from './pages/admin/SettingsPage'

function RequireViewer({ children }: { children: React.ReactElement }) {
  const { viewerRole, ready } = useAuth()
  if (!ready) return null
  return viewerRole ? children : <Navigate to="/enter" replace />
}

function RequireAdmin({ children }: { children: React.ReactElement }) {
  const { isAdmin, ready } = useAuth()
  if (!ready) return null
  return isAdmin ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公開側 */}
        <Route path="/enter" element={<EnterPage />} />
        <Route element={<RequireViewer><ViewerLayout /></RequireViewer>}>
          <Route path="/" element={<TopPage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/notices/:id" element={<NoticeDetailPage />} />
          <Route path="/circulars" element={<CircularsPage />} />
          <Route path="/circulars/:id" element={<CircularDetailPage />} />
        </Route>

        {/* 管理側 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<Navigate to="/admin/notices" replace />} />
          <Route path="notices" element={<AdminNoticesPage />} />
          <Route path="notices/new" element={<NoticeFormPage />} />
          <Route path="notices/:id/edit" element={<NoticeFormPage />} />
          <Route path="circulars" element={<AdminCircularsPage />} />
          <Route path="circulars/new" element={<CircularFormPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
