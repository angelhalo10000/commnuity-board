import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { adminApi } from '../../api/admin'

function PasswordForm({ label, onSave }: { label: string; onSave: (current: string, next: string) => Promise<void> }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(''); setError('')
    setLoading(true)
    try {
      await onSave(current, next)
      setMsg('変更しました')
      setCurrent(''); setNext('')
    } catch (err: unknown) {
      const messages = (err as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors
      setError(messages?.join(', ') ?? '変更に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>{label}</h3>
      {msg && <div className="alert alert-info">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">現在のパスワード</label>
          <input type="password" className="form-control" value={current} onChange={e => setCurrent(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">新しいパスワード</label>
          <input type="password" className="form-control" value={next} onChange={e => setNext(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? '変更中...' : '変更する'}
        </button>
      </form>
    </div>
  )
}

export default function SettingsPage() {
  const [orgName, setOrgName] = useState('')
  const [editName, setEditName] = useState('')
  const [nameMsg, setNameMsg] = useState('')

  useEffect(() => {
    adminApi.getSettings().then(r => { setOrgName(r.data.organization_name); setEditName(r.data.organization_name) })
  }, [])

  async function handleNameSave(e: FormEvent) {
    e.preventDefault()
    await adminApi.updateOrganization(editName)
    setOrgName(editName)
    setNameMsg('変更しました')
  }

  return (
    <>
      <h1 className="page-title">設定</h1>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>自治会名</h3>
        {nameMsg && <div className="alert alert-info">{nameMsg}</div>}
        <form onSubmit={handleNameSave}>
          <div className="form-group">
            <input className="form-control" value={editName} onChange={e => setEditName(e.target.value)} required />
            <p className="form-hint">現在: {orgName}</p>
          </div>
          <button type="submit" className="btn btn-primary btn-sm">変更する</button>
        </form>
      </div>

      <PasswordForm label="会員共通パスワード" onSave={(c, n) => adminApi.updateMemberPassword(c, n).then(() => {})} />
      <PasswordForm label="班長共通パスワード" onSave={(c, n) => adminApi.updateLeaderPassword(c, n).then(() => {})} />
      <PasswordForm label="管理者パスワード" onSave={(c, n) => adminApi.updateAdminPassword(c, n).then(() => {})} />
    </>
  )
}
