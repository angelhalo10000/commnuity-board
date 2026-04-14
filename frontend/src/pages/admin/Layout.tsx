import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminApi } from '../../api/admin'

export default function AdminLayout() {
  const { setIsAdmin, orgName } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleLogout() {
    await adminApi.logout()
    setIsAdmin(false)
    navigate('/admin/login')
  }

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (
    <>
      <header className="header">
        <NavLink to="/admin" className="header-logo">🏘 {orgName} 管理</NavLink>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="admin-hamburger"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="メニュー"
          >☰</button>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)' }}>ログアウト</button>
        </div>
      </header>
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={closeSidebar} />}
      <div className="admin-layout">
        <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="admin-sidebar-section">コンテンツ</div>
          <NavLink to="/admin/notices" onClick={closeSidebar} className={({ isActive }) => `admin-sidebar-item${isActive ? ' active' : ''}`}>📢 お知らせ</NavLink>
          <NavLink to="/admin/circulars" onClick={closeSidebar} className={({ isActive }) => `admin-sidebar-item${isActive ? ' active' : ''}`}>📋 回覧板</NavLink>
          <div className="admin-sidebar-section">管理</div>
          <NavLink to="/admin/settings" onClick={closeSidebar} className={({ isActive }) => `admin-sidebar-item${isActive ? ' active' : ''}`}>⚙️ 設定</NavLink>
          <a href="/" target="_blank" rel="noopener noreferrer" onClick={closeSidebar} className="admin-sidebar-item">🌐 サイトを見る</a>
        </aside>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </>
  )
}
