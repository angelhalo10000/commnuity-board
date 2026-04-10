const STATUS_LABELS: Record<string, string> = {
  draft: '下書き',
  scheduled: '予約済み',
  published: '公開中',
  archived: 'アーカイブ',
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{STATUS_LABELS[status] ?? status}</span>
}

export function TargetBadge({ targetType }: { targetType: 'all' | 'leaders' }) {
  if (targetType === 'leaders') {
    return <span className="badge badge-leader">班長のみ</span>
  }
  return <span className="badge badge-all">全員</span>
}

export function NewBadge() {
  return <span className="badge badge-new">新着</span>
}
