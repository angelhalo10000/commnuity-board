import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { viewerApi } from '../../api/viewer'
import type { NoticeDetail } from '../../types'
import { NewBadge, TargetBadge } from '../../components/StatusBadge'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [notice, setNotice] = useState<NoticeDetail | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    viewerApi.getNotice(id)
      .then(r => setNotice(r.data))
      .catch(() => setError('お知らせが見つかりません'))
  }, [id])

  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>
  if (!notice) return <div className="loading">読み込み中...</div>

  return (
    <div className="container">
      <Link to="/notices" style={{ fontSize: 14, display: 'block', marginBottom: 16 }}>← お知らせ一覧へ</Link>
      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            {notice.is_new && <NewBadge />}
            <TargetBadge targetType={notice.target_type} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{notice.title}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {formatDate(notice.published_at)} 配信
            {notice.updated_at !== notice.published_at && ` · ${formatDate(notice.updated_at)} 更新`}
          </p>
        </div>
        <hr className="divider" />
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{notice.body}</div>
        {notice.attachments.length > 0 && (
          <>
            <hr className="divider" />
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>添付ファイル</h3>
            {notice.attachments.map(a => (
              <a key={a.id} href={a.file_url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 8 }}>
                <span>📎</span>
                <span style={{ flex: 1, fontSize: 14 }}>{a.filename}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatBytes(a.byte_size)}</span>
              </a>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
