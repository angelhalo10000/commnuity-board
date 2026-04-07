export type ViewerRole = 'member' | 'leader'

export interface Pagination {
  current_page: number
  total_pages: number
  total_count: number
}

export interface Attachment {
  id: string
  filename: string
  content_type: string
  byte_size: number
  file_url: string
}

export interface NoticeSummary {
  id: string
  title: string
  target_type: 'all' | 'leaders'
  published_at: string
  is_new: boolean
}

export interface NoticeDetail extends NoticeSummary {
  body: string
  attachments: Attachment[]
  updated_at: string
}

export interface AdminNoticeSummary {
  id: string
  title: string
  target_type: 'all' | 'leaders'
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  scheduled_at: string | null
  published_at: string | null
}

export interface AdminNoticeDetail extends AdminNoticeSummary {
  body: string
  attachments: Attachment[]
  created_at: string
  updated_at: string
}

export interface CircularSummary {
  id: string
  title: string
  target_type: 'all' | 'leaders'
  published_at: string
  is_new: boolean
}

export interface CircularDetail extends CircularSummary {
  file_url: string
  file_type: 'pdf' | 'image'
}

export interface AdminCircularSummary {
  id: string
  title: string
  target_type: 'all' | 'leaders'
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  scheduled_at: string | null
  published_at: string | null
}

export interface AdminCircularDetail extends AdminCircularSummary {
  file_url?: string
  file_type?: 'pdf' | 'image'
}
