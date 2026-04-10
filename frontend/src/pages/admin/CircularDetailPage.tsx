import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import type { AdminCircularDetail } from '../../types'
import { StatusBadge, TargetBadge } from '../../components/StatusBadge'

function formatDateTime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminCircularDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [circular, setCircular] = useState<AdminCircularDetail | null>(null)

  useEffect(() => {
    if (!id) return
    adminApi.getCircular(id).then(r => setCircular(r.data))
  }, [id])

  if (!circular) return null

  const dateLabel = circular.status === 'scheduled' ? '配信予定日時' : '配信日時'
  const dateValue = formatDateTime(circular.scheduled_at ?? circular.published_at)

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Link to="/admin/circulars" style={{ fontSize: 14 }}>← 一覧へ</Link>
        <h1 className="page-title" style={{ margin: 0 }}>回覧板詳細</h1>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>📋 {circular.title}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>ステータス</div>
            <StatusBadge status={circular.status} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>配信対象</div>
            <TargetBadge targetType={circular.target_type} />
            {circular.target_type === 'all' && <span style={{ fontSize: 14 }}>全員</span>}
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{dateLabel}</div>
            <span style={{ fontSize: 14 }}>{dateValue}</span>
          </div>
        </div>

        {circular.files.length > 0 && (
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>添付ファイル</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {circular.files.map(f => (
                <a key={f.id} href={f.file_url} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 6, textDecoration: 'none', color: 'var(--text)' }}>
                  <span>{f.file_type === 'image' ? '🖼️' : '📄'}</span>
                  <span style={{ flex: 1, fontSize: 14 }}>{f.filename}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>開く</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
