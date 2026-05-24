import { authHeaders } from '../../../../core/api/http'

const BASE = import.meta.env.VITE_API_URL

export const userApi = {
  getAll: () =>
    fetch(`${BASE}/users/`, { headers: authHeaders() }),

  getById: (id: number) =>
    fetch(`${BASE}/users/${id}`, { headers: authHeaders() }),

  create: (body: object) =>
    fetch(`${BASE}/users/`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify(body),
    }),

  update: (id: number, body: object) =>
    fetch(`${BASE}/users/${id}/`, {
      method:  'PUT',
      headers: authHeaders(),
      body:    JSON.stringify(body),
    }),

  delete: (id: number) =>
    fetch(`${BASE}/users/${id}/`, {
      method:  'DELETE',
      headers: authHeaders(),
    }),
}
