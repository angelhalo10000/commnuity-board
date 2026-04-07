import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { viewerApi } from '../../api/viewer'
import type { CircularDetail } from '../../types'
import { NewBadge, TargetBadge } from '../../components/StatusBadge'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
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
        {circular.file_type === 'image' ? (
          <img src={circular.file_url} alt={circular.title} style={{ maxWidth: '100%', borderRadius: 'var(--radius)' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <iframe
              src={circular.file_url}
              style={{ width: '100%', height: 600, border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
              title={circular.title}
            />
            <a href={circular.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
              PDFをダウンロード
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
