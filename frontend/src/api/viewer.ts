import client from './client'
import type { NoticeSummary, NoticeDetail, CircularSummary, CircularDetail, Pagination, ViewerRole } from '../types'

export const viewerApi = {
  login: (password: string) =>
    client.post<{ role: ViewerRole }>('/viewer/session', { password }),

  logout: () => client.delete('/viewer/session'),

  getNotices: (params: { keyword?: string; year?: number; month?: number; page?: number }) =>
    client.get<{ notices: NoticeSummary[]; pagination: Pagination }>('/viewer/notices', { params }),

  getNotice: (id: string) =>
    client.get<NoticeDetail>(`/viewer/notices/${id}`),

  getCirculars: (params: { keyword?: string; year?: number; month?: number; page?: number }) =>
    client.get<{ circulars: CircularSummary[]; pagination: Pagination }>('/viewer/circulars', { params }),

  getCircular: (id: string) =>
    client.get<CircularDetail>(`/viewer/circulars/${id}`),
}
