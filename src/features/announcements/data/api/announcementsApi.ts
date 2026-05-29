import type { Announcement }     from '../../domain/models/Announcement'
import type { AnnouncementBody } from '../../domain/dtos/announcement-body.dto'
import { apiClient }             from '../../../../core/network/client'

export const announcementsApi = {
  getAll: () =>
    apiClient.get<Announcement[]>('/announcements/'),

  create: (body: AnnouncementBody) =>
    apiClient.post<Announcement>('/announcements/', body),

  update: (id: number, body: AnnouncementBody) =>
    apiClient.put<Announcement>(`/announcements/${id}`, body),

  delete: (id: number) =>
    apiClient.delete<void>(`/announcements/${id}`),

  pin: (id: number, durationDays: number | null) =>
    apiClient.post<Announcement>(`/announcements/${id}/pin`, { duration_days: durationDays }),

  unpin: (id: number) =>
    apiClient.delete<Announcement>(`/announcements/${id}/pin`),
}
