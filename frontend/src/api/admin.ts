import client from './client'
import type { AdminNoticeSummary, AdminNoticeDetail, AdminCircularSummary, AdminCircularDetail, Pagination } from '../types'

export const adminApi = {
  getSession: () => client.get<{ organization_name: string }>('/admin/session'),

  login: (password: string) =>
    client.post('/admin/session', { password }),

  logout: () => client.delete('/admin/session'),

  // Notices
  getNotices: (params: { keyword?: string; year?: number; month?: number; status?: string; target_type?: string; page?: number }) =>
    client.get<{ notices: AdminNoticeSummary[]; pagination: Pagination }>('/admin/notices', { params }),

  getNotice: (id: string) =>
    client.get<AdminNoticeDetail>(`/admin/notices/${id}`),

  createNotice: (data: FormData) =>
    client.post<AdminNoticeDetail>('/admin/notices', data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  updateNotice: (id: string, data: FormData) =>
    client.patch<AdminNoticeDetail>(`/admin/notices/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  deleteNotice: (id: string) =>
    client.delete(`/admin/notices/${id}`),

  // Circulars
  getCirculars: (params: { keyword?: string; year?: number; month?: number; status?: string; target_type?: string; page?: number }) =>
    client.get<{ circulars: AdminCircularSummary[]; pagination: Pagination }>('/admin/circulars', { params }),

  getCircular: (id: string) =>
    client.get<AdminCircularDetail>(`/admin/circulars/${id}`),

  createCircular: (data: FormData) =>
    client.post<AdminCircularDetail>('/admin/circulars', data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  updateCircular: (id: string, data: FormData) =>
    client.patch<AdminCircularDetail>(`/admin/circulars/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  deleteCircular: (id: string) =>
    client.delete(`/admin/circulars/${id}`),

  // Settings
  getSettings: () =>
    client.get<{ organization_name: string }>('/admin/settings'),

  updateMemberPassword: (password: string) =>
    client.patch('/admin/settings/member_password', { password }),

  updateLeaderPassword: (password: string) =>
    client.patch('/admin/settings/leader_password', { password }),

  updateAdminPassword: (current_password: string, password: string) =>
    client.patch('/admin/settings/admin_password', { current_password, password }),

  updateOrganization: (name: string) =>
    client.patch('/admin/settings/organization', { name }),
}
