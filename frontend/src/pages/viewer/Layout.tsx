import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { viewerApi } from '../../api/viewer'

export default function ViewerLayout() {
  const { setViewerRole } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await viewerApi.logout()
    setViewerRole(null)
    navigate('/enter')
  }

  return (
    <>
      <header className="header">
        <NavLink to="/" className="header-logo">🏘 自治会</NavLink>
        <nav className="header-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>トップ</NavLink>
          <NavLink to="/notices" className={({ isActive }) => isActive ? 'active' : ''}>お知らせ</NavLink>
          <NavLink to="/circulars" className={({ isActive }) => isActive ? 'active' : ''}>回覧板</NavLink>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', fontSize: 14, color: 'var(--text-muted)' }}>ログアウト</button>
        </nav>
      </header>
      <Outlet />
    </>
  )
}
