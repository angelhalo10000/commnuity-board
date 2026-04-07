import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminApi } from '../../api/admin'

export default function AdminLayout() {
  const { setIsAdmin, orgName } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await adminApi.logout()
    setIsAdmin(false)
    navigate('/admin/login')
  }

  return (
    <>
      <header className="header">
        <NavLink to="/admin" className="header-logo">🏘 {orgName} 管理</NavLink>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)' }}>ログアウト</button>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-section">コンテンツ</div>
          <NavLink to="/admin/notices" className={({ isActive }) => `admin-sidebar-item${isActive ? ' active' : ''}`}>📢 お知らせ</NavLink>
          <NavLink to="/admin/circulars" className={({ isActive }) => `admin-sidebar-item${isActive ? ' active' : ''}`}>📋 回覧板</NavLink>
          <div className="admin-sidebar-section">管理</div>
          <NavLink to="/admin/settings" className={({ isActive }) => `admin-sidebar-item${isActive ? ' active' : ''}`}>⚙️ 設定</NavLink>
        </aside>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </>
  )
}
