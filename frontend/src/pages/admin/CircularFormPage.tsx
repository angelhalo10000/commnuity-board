import { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { adminApi } from '../../api/admin'

export default function CircularFormPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [targetType, setTargetType] = useState<'all' | 'leaders'>('all')
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>('draft')
  const [scheduledAt, setScheduledAt] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd = new FormData()
    fd.append('title', title)
    fd.append('target_type', targetType)
    fd.append('status', status)
    if (status === 'scheduled' && scheduledAt) fd.append('scheduled_at', scheduledAt)
    if (file) fd.append('file', file)

    try {
      await adminApi.createCircular(fd)
      navigate('/admin/circulars')
    } catch (err: unknown) {
      const messages = (err as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors
      setError(messages?.join(', ') ?? '保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Link to="/admin/circulars" style={{ fontSize: 14 }}>← 一覧へ</Link>
        <h1 className="page-title" style={{ margin: 0 }}>回覧板作成</h1>
      </div>
      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">タイトル<span className="required">*</span></label>
            <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">配信対象<span className="required">*</span></label>
              <select className="form-control" value={targetType} onChange={e => setTargetType(e.target.value as 'all' | 'leaders')}>
                <option value="all">全員</option>
                <option value="leaders">班長のみ</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">ステータス<span className="required">*</span></label>
              <select className="form-control" value={status} onChange={e => setStatus(e.target.value as 'draft' | 'scheduled' | 'published')}>
                <option value="draft">下書き</option>
                <option value="scheduled">予約配信</option>
                <option value="published">今すぐ公開</option>
              </select>
            </div>
          </div>
          {status === 'scheduled' && (
            <div className="form-group">
              <label className="form-label">配信日時<span className="required">*</span></label>
              <input type="datetime-local" className="form-control" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">ファイル（PDF/画像）<span className="required">*</span></label>
            <div className="file-upload" onClick={() => document.getElementById('circular-file')?.click()}>
              {file ? <span>📎 {file.name}</span> : <span>クリックしてファイルを選択（PDF/JPG/PNG、最大10MB）</span>}
            </div>
            <input id="circular-file" type="file" accept=".pdf,image/*" style={{ display: 'none' }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] ?? null)} required={!file} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Link to="/admin/circulars" className="btn btn-secondary">キャンセル</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
