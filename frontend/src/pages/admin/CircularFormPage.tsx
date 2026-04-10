import { useEffect, useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import type { Attachment } from '../../types'

export default function CircularFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [targetType, setTargetType] = useState<'all' | 'leaders'>('all')
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>('draft')
  const [scheduledAt, setScheduledAt] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [existingFiles, setExistingFiles] = useState<Attachment[]>([])
  const [removeIds, setRemoveIds] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    adminApi.getCircular(id).then(r => {
      const c = r.data
      setTitle(c.title)
      setTargetType(c.target_type)
      setStatus(c.status === 'archived' ? 'published' : c.status as 'draft' | 'scheduled' | 'published')
      setScheduledAt(c.scheduled_at ? c.scheduled_at.slice(0, 16) : '')
      setExistingFiles(c.files)
    })
  }, [id])

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files ?? []))
  }

  function toggleRemove(fileId: string) {
    setRemoveIds(prev => prev.includes(fileId) ? prev.filter(x => x !== fileId) : [...prev, fileId])
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd = new FormData()
    fd.append('title', title)
    fd.append('target_type', targetType)
    fd.append('status', status)
    if (status === 'scheduled' && scheduledAt) fd.append('scheduled_at', scheduledAt)
    files.forEach(f => fd.append('files[]', f))
    removeIds.forEach(rid => fd.append('remove_file_ids[]', rid))

    try {
      if (isEdit && id) {
        await adminApi.updateCircular(id, fd)
      } else {
        await adminApi.createCircular(fd)
      }
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
        <h1 className="page-title" style={{ margin: 0 }}>{isEdit ? '回覧板編集' : '回覧板作成'}</h1>
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

          {existingFiles.length > 0 && (
            <div className="form-group">
              <label className="form-label">既存のファイル</label>
              {existingFiles.map(f => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ flex: 1, fontSize: 14, textDecoration: removeIds.includes(f.id) ? 'line-through' : 'none', color: removeIds.includes(f.id) ? 'var(--text-muted)' : 'var(--text)' }}>
                    {f.file_type === 'image' ? '🖼️' : '📄'} {f.filename}
                  </span>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => toggleRemove(f.id)}>
                    {removeIds.includes(f.id) ? '取消' : '削除'}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">ファイル（PDF/画像、複数可）</label>
            <div className="file-upload" onClick={() => document.getElementById('circular-files')?.click()}>
              {files.length > 0
                ? <span>{files.map(f => f.name).join(', ')}</span>
                : <span>クリックしてファイルを選択（PDF/JPG/PNG、最大10MB、複数選択可）</span>
              }
            </div>
            <input id="circular-files" type="file" accept=".pdf,image/*" multiple style={{ display: 'none' }}
              onChange={handleFileChange} />
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
