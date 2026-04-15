import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import type { AdminCircularSummary, Pagination } from '../../types'
import { StatusBadge, TargetBadge } from '../../components/StatusBadge'
import PaginationComp from '../../components/Pagination'
import { IconEye, IconPencil, IconTrash } from '../../components/Icons'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AdminCircularsPage() {
  const [circulars, setCirculars] = useState<AdminCircularSummary[]>([])
  const [pagination, setPagination] = useState<Pagination>({ current_page: 1, total_pages: 1, total_count: 0 })
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('')
  const [targetType, setTargetType] = useState('')
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [page, setPage] = useState(1)

  function load() {
    adminApi.getCirculars({
      keyword: keyword || undefined,
      status: status || undefined,
      target_type: targetType || undefined,
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
      page,
    })
      .then(r => { setCirculars(r.data.circulars); setPagination(r.data.pagination) })
  }

  useEffect(load, [keyword, status, targetType, year, month, page])

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
          <div className="form-group" style={{ maxWidth: 120 }}>
            <label className="form-label">対象</label>
            <select className="form-control" value={targetType} onChange={e => setTargetType(e.target.value)}>
              <option value="">すべて</option>
              <option value="all">全員</option>
              <option value="leaders">班長のみ</option>
            </select>
          </div>
          <div className="form-group" style={{ maxWidth: 100 }}>
            <label className="form-label">年</label>
            <input className="form-control" type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="例: 2026" min="2000" max="2099" />
          </div>
          <div className="form-group" style={{ maxWidth: 80 }}>
            <label className="form-label">月</label>
            <select className="form-control" value={month} onChange={e => setMonth(e.target.value)}>
              <option value="">すべて</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m}月</option>
              ))}
            </select>
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

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="table" style={{ minWidth: 480 }}>
          <thead>
            <tr><th>タイトル</th><th>配信日</th><th>ファイル数</th><th></th></tr>
          </thead>
          <tbody>
            {circulars.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>回覧板はありません</td></tr>
            )}
            {circulars.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>📋 {c.title}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <StatusBadge status={c.status} />
                    <TargetBadge targetType={c.target_type} />
                  </div>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{formatDate(c.scheduled_at ?? c.published_at)}</td>
                <td style={{ textAlign: 'center' }}>{c.files_count}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Link to={`/admin/circulars/${c.id}`} className="btn btn-secondary btn-sm icon-btn" title="詳細"><IconEye /></Link>
                    <Link to={`/admin/circulars/${c.id}/edit`} className="btn btn-secondary btn-sm icon-btn" title="編集"><IconPencil /></Link>
                    <button onClick={() => handleDelete(c.id)} className="btn btn-danger btn-sm icon-btn" title="削除"><IconTrash /></button>
                  </div>
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
