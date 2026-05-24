import type { Announcement } from '../../domain/models/Announcement'

const BASE_URL = import.meta.env.VITE_API_URL

const authHeaders = (): Record<string, string> => ({
  'Content-Type':               'application/json',
  'ngrok-skip-browser-warning': 'true',
  ...(localStorage.getItem('access_token')
    ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    : {}),
})

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data?.detail ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export interface AnnouncementBody {
  label:        string
  version:      string
  date?:        string
  title:        string
  description:  string
}

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
