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

export const announcementsApi = {
  getAll: (): Promise<Announcement[]> =>
    fetch(`${BASE_URL}/announcements/`, {
      headers: authHeaders(),
    }).then(handleResponse<Announcement[]>),
}
