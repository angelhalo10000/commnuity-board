import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { viewerApi } from '../../api/viewer'
import type { CircularDetail, Attachment } from '../../types'
import { NewBadge, TargetBadge } from '../../components/StatusBadge'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

const isAndroid = /Android/i.test(navigator.userAgent)

function AttachmentView({ attachment }: { attachment: Attachment }) {
  const fileType = attachment.file_type ?? (attachment.content_type.startsWith('image/') ? 'image' : 'pdf')

  if (fileType === 'image') {
    return (
      <img src={attachment.file_url} alt={attachment.filename} style={{ maxWidth: '100%', borderRadius: 'var(--radius)' }} />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {!isAndroid && (
        <iframe
          src={attachment.file_url}
          style={{ width: '100%', height: 600, border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
          title={attachment.filename}
        />
      )}
      <a href={attachment.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
        {attachment.filename} をダウンロード
      </a>
    </div>
  )
}

export default function CircularDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [circular, setCircular] = useState<CircularDetail | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    viewerApi.getCircular(id)
      .then(r => setCircular(r.data))
      .catch(() => setError('回覧板が見つかりません'))
  }, [id])

  if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>
  if (!circular) return <div className="loading">読み込み中...</div>

  return (
    <div className="container">
      <Link to="/circulars" style={{ fontSize: 14, display: 'block', marginBottom: 16 }}>← 回覧板一覧へ</Link>
      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            {circular.is_new && <NewBadge />}
            <TargetBadge targetType={circular.target_type} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{circular.title}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatDate(circular.published_at)} 配信</p>
        </div>
        <hr className="divider" />
        {circular.files.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>添付ファイルはありません</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {circular.files.map(f => (
              <AttachmentView key={f.id} attachment={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
