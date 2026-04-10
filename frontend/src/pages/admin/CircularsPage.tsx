import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import type { AdminCircularSummary, Pagination } from '../../types'
import { StatusBadge, TargetBadge } from '../../components/StatusBadge'
import PaginationComp from '../../components/Pagination'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AdminCircularsPage() {
  const [circulars, setCirculars] = useState<AdminCircularSummary[]>([])
  const [pagination, setPagination] = useState<Pagination>({ current_page: 1, total_pages: 1, total_count: 0 })
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  function load() {
    adminApi.getCirculars({ keyword: keyword || undefined, status: status || undefined, page })
      .then(r => { setCirculars(r.data.circulars); setPagination(r.data.pagination) })
  }

  useEffect(load, [keyword, status, page])

  async function handleDelete(id: string) {
    if (!confirm('削除しますか？')) return
    await adminApi.deleteCircular(id)
    load()
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ margin: 0 }}>回覧板管理</h1>
        <Link to="/admin/circulars/new" className="btn btn-primary">＋ 新規作成</Link>
      </div>

      <form className="search-bar" onSubmit={(e: FormEvent) => { e.preventDefault(); setPage(1) }}>
        <div className="search-row">
          <div className="form-group">
            <label className="form-label">キーワード</label>
            <input className="form-control" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="タイトルを検索" />
          </div>
          <div className="form-group" style={{ maxWidth: 140 }}>
            <label className="form-label">ステータス</label>
            <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">すべて</option>
              <option value="draft">下書き</option>
              <option value="scheduled">予約済み</option>
              <option value="published">公開中</option>
              <option value="archived">アーカイブ</option>
            </select>
          </div>
          <button type="submit" className="btn btn-secondary">検索</button>
        </div>
      </form>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr><th>タイトル</th><th>対象</th><th>ステータス</th><th>配信日/配信予定日</th><th></th></tr>
          </thead>
          <tbody>
            {circulars.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>回覧板はありません</td></tr>
            )}
            {circulars.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500 }}>📋 {c.title}</td>
                <td><TargetBadge targetType={c.target_type} /></td>
                <td><StatusBadge status={c.status} /></td>
                <td>{formatDate(c.scheduled_at ?? c.published_at)}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleDelete(c.id)} className="btn btn-danger btn-sm">削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationComp current={pagination.current_page} total={pagination.total_pages} onChange={p => setPage(p)} />
    </>
  )
}
