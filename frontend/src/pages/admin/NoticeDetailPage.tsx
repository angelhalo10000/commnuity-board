import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import type { AdminNoticeDetail } from '../../types'
import { StatusBadge, TargetBadge } from '../../components/StatusBadge'

function formatDateTime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminNoticeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [notice, setNotice] = useState<AdminNoticeDetail | null>(null)

  useEffect(() => {
    if (!id) return
    adminApi.getNotice(id).then(r => setNotice(r.data))
  }, [id])

  if (!notice) return null

  const dateLabel = notice.status === 'scheduled' ? '配信予定日時' : '配信日時'
  const dateValue = formatDateTime(notice.scheduled_at ?? notice.published_at)

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Link to="/admin/notices" style={{ fontSize: 14 }}>← 一覧へ</Link>
        <h1 className="page-title" style={{ margin: 0 }}>お知らせ詳細</h1>
        <button onClick={() => navigate(`/admin/notices/${id}/edit`)} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>編集</button>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>📢 {notice.title}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>ステータス</div>
            <StatusBadge status={notice.status} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>配信対象</div>
            <TargetBadge targetType={notice.target_type} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{dateLabel}</div>
            <span style={{ fontSize: 14 }}>{dateValue}</span>
          </div>
        </div>

        {notice.body && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>本文</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{notice.body}</div>
          </div>
        )}

        {notice.attachments.length > 0 && (
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>添付ファイル</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notice.attachments.map(a => (
                <a key={a.id} href={a.file_url} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 6, textDecoration: 'none', color: 'var(--text)' }}>
                  <span>📎</span>
                  <span style={{ flex: 1, fontSize: 14 }}>{a.filename}</span>
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
