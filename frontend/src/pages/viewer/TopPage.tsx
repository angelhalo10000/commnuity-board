import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { viewerApi } from '../../api/viewer'
import type { NoticeSummary, CircularSummary } from '../../types'
import { NewBadge, TargetBadge } from '../../components/StatusBadge'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function TopPage() {
  const [notices, setNotices] = useState<NoticeSummary[]>([])
  const [circulars, setCirculars] = useState<CircularSummary[]>([])

  useEffect(() => {
    viewerApi.getNotices({ page: 1 }).then(r => setNotices(r.data.notices.slice(0, 5)))
    viewerApi.getCirculars({ page: 1 }).then(r => setCirculars(r.data.circulars.slice(0, 5)))
  }, [])

  return (
    <>
      <div style={{ background: 'var(--primary)', color: '#fff', padding: '28px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>自治会</h1>
        <p style={{ fontSize: 14, opacity: 0.85 }}>お知らせや回覧板をオンラインで確認できます</p>
      </div>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* お知らせ */}
          <div>
            <div className="section-heading">
              <h2>📢 最新のお知らせ</h2>
              <Link to="/notices" style={{ fontSize: 13 }}>すべて見る →</Link>
            </div>
            {notices.length === 0 && <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>お知らせはありません</p>}
            {notices.map(n => (
              <Link key={n.id} to={`/notices/${n.id}`} className="notice-card">
                <div className="notice-card-title">{n.title}</div>
                <div className="notice-card-meta">
                  <span>{formatDate(n.published_at)}</span>
                  {n.is_new && <NewBadge />}
                  <TargetBadge targetType={n.target_type} />
                </div>
              </Link>
            ))}
          </div>
          {/* 回覧板 */}
          <div>
            <div className="section-heading">
              <h2>📋 最新の回覧板</h2>
              <Link to="/circulars" style={{ fontSize: 13 }}>すべて見る →</Link>
            </div>
            {circulars.length === 0 && <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>回覧板はありません</p>}
            {circulars.map(c => (
              <Link key={c.id} to={`/circulars/${c.id}`} className="notice-card">
                <div className="notice-card-title">{c.title}</div>
                <div className="notice-card-meta">
                  <span>{formatDate(c.published_at)}</span>
                  {c.is_new && <NewBadge />}
                  <TargetBadge targetType={c.target_type} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
