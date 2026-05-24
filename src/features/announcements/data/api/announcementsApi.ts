import type { Announcement }     from '../../domain/models/Announcement'
import type { AnnouncementBody } from '../../domain/dtos/announcement-body.dto'
import { authHeaders, handleResponse } from '../../../../core/api/http'

const BASE_URL = import.meta.env.VITE_API_URL

export const announcementsApi = {
  getAll: (): Promise<Announcement[]> =>
    fetch(`${BASE_URL}/announcements/`, { headers: authHeaders() })
      .then(handleResponse<Announcement[]>),

  create: (body: AnnouncementBody): Promise<Announcement> =>
    fetch(`${BASE_URL}/announcements/`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify(body),
    }).then(handleResponse<Announcement>),

  update: (id: number, body: AnnouncementBody): Promise<Announcement> =>
    fetch(`${BASE_URL}/announcements/${id}`, {
      method:  'PUT',
      headers: authHeaders(),
      body:    JSON.stringify(body),
    }).then(handleResponse<Announcement>),

  delete: (id: number): Promise<void> =>
    fetch(`${BASE_URL}/announcements/${id}`, {
      method:  'DELETE',
      headers: authHeaders(),
    }).then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`) }),

  pin: (id: number, durationDays: number | null): Promise<Announcement> =>
    fetch(`${BASE_URL}/announcements/${id}/pin`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify({ duration_days: durationDays }),
    }).then(handleResponse<Announcement>),

  unpin: (id: number): Promise<Announcement> =>
    fetch(`${BASE_URL}/announcements/${id}/pin`, {
      method:  'DELETE',
      headers: authHeaders(),
    }).then(handleResponse<Announcement>),
}
