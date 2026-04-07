import { useEffect, useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import type { AdminNoticeDetail, Attachment } from '../../types'

export default function NoticeFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [targetType, setTargetType] = useState<'all' | 'leaders'>('all')
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>('draft')
  const [scheduledAt, setScheduledAt] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([])
  const [removeIds, setRemoveIds] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    adminApi.getNotice(id).then(r => {
      const n: AdminNoticeDetail = r.data
      setTitle(n.title)
      setBody(n.body)
      setTargetType(n.target_type)
      setStatus(n.status === 'archived' ? 'published' : n.status as 'draft' | 'scheduled' | 'published')
      setScheduledAt(n.scheduled_at ? n.scheduled_at.slice(0, 16) : '')
      setExistingAttachments(n.attachments)
    })
  }, [id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd = new FormData()
    fd.append('title', title)
    fd.append('body', body)
    fd.append('target_type', targetType)
    fd.append('status', status)
    if (status === 'scheduled' && scheduledAt) fd.append('scheduled_at', scheduledAt)
    files.forEach(f => fd.append('attachments[]', f))
    removeIds.forEach(rid => fd.append('remove_attachment_ids[]', rid))

    try {
      if (isEdit && id) {
        await adminApi.updateNotice(id, fd)
      } else {
        await adminApi.createNotice(fd)
      }
      navigate('/admin/notices')
    } catch (err: unknown) {
      const messages = (err as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors
      setError(messages?.join(', ') ?? '保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files ?? []))
  }

  function toggleRemove(attachmentId: string) {
    setRemoveIds(prev => prev.includes(attachmentId) ? prev.filter(x => x !== attachmentId) : [...prev, attachmentId])
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Link to="/admin/notices" style={{ fontSize: 14 }}>← 一覧へ</Link>
        <h1 className="page-title" style={{ margin: 0 }}>{isEdit ? 'お知らせ編集' : 'お知らせ作成'}</h1>
      </div>
      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">タイトル<span className="required">*</span></label>
            <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">本文</label>
            <textarea className="form-control" value={body} onChange={e => setBody(e.target.value)} rows={8} />
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

          {existingAttachments.length > 0 && (
            <div className="form-group">
              <label className="form-label">既存の添付ファイル</label>
              {existingAttachments.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ flex: 1, fontSize: 14, textDecoration: removeIds.includes(a.id) ? 'line-through' : 'none', color: removeIds.includes(a.id) ? 'var(--text-muted)' : 'var(--text)' }}>
                    📎 {a.filename}
                  </span>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => toggleRemove(a.id)}>
                    {removeIds.includes(a.id) ? '取消' : '削除'}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">添付ファイル（複数可）</label>
            <input type="file" multiple onChange={handleFileChange} className="form-control" />
            <p className="form-hint">1ファイルあたり最大10MB</p>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Link to="/admin/notices" className="btn btn-secondary">キャンセル</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
