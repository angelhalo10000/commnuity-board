import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { viewerApi } from '../../api/viewer'
import { useAuth } from '../../contexts/AuthContext'

export default function EnterPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setViewerRole } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await viewerApi.login(password)
      setViewerRole(res.data.role)
      navigate('/')
    } catch {
      setError('パスワードが正しくありません')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 20px' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏘</div>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>自治会サイト</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>パスワードを入力してください</p>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label className="form-label">パスワード</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? '確認中...' : 'ログイン'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
