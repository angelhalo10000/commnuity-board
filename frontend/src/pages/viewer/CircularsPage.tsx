import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { viewerApi } from '../../api/viewer'
import type { CircularSummary, Pagination } from '../../types'
import { NewBadge, TargetBadge } from '../../components/StatusBadge'
import PaginationComp from '../../components/Pagination'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function CircularsPage() {
  const [circulars, setCirculars] = useState<CircularSummary[]>([])
  const [pagination, setPagination] = useState<Pagination>({ current_page: 1, total_pages: 1, total_count: 0 })
  const [keyword, setKeyword] = useState('')
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    viewerApi.getCirculars({
      keyword: keyword || undefined,
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
      page,
    }).then(r => {
      setCirculars(r.data.circulars)
      setPagination(r.data.pagination)
    })
  }, [keyword, year, month, page])

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    setPage(1)
  }

  return (
    <div className="container">
      <h1 className="page-title">回覧板</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-row">
          <div className="form-group">
            <label className="form-label">キーワード</label>
            <input className="form-control" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="タイトルを検索" />
          </div>
          <div className="form-group" style={{ maxWidth: 100 }}>
            <label className="form-label">年</label>
            <input className="form-control" type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="2026" />
          </div>
          <div className="form-group" style={{ maxWidth: 80 }}>
            <label className="form-label">月</label>
            <input className="form-control" type="number" min={1} max={12} value={month} onChange={e => setMonth(e.target.value)} placeholder="1〜12" />
          </div>
          <button type="submit" className="btn btn-primary">検索</button>
        </div>
      </form>

      {circulars.length === 0
        ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>回覧板はありません</p>
        : circulars.map(c => (
          <Link key={c.id} to={`/circulars/${c.id}`} className="notice-card">
            <div className="notice-card-title">📋 {c.title}</div>
            <div className="notice-card-meta">
              <span>{formatDate(c.published_at)}</span>
              {c.is_new && <NewBadge />}
              <TargetBadge targetType={c.target_type} />
            </div>
          </Link>
        ))
      }
      <PaginationComp current={pagination.current_page} total={pagination.total_pages} onChange={p => setPage(p)} />
    </div>
  )
}
