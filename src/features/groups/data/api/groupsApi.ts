import type { AddMemberRequest, CreateGroupRequest, Group } from '../../domain/models/Group'

const BASE_URL = import.meta.env.VITE_API_URL

const authHeaders = (): Record<string, string> => ({
  'Content-Type':               'application/json',
  'ngrok-skip-browser-warning': 'true',
  ...(localStorage.getItem('access_token')
    ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    : {}),
})

const authHeadersMultipart = (): Record<string, string> => ({
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
  if (res.status === 204) return undefined as T
  return res.json()
}

export const groupsApi = {
  getAll: (): Promise<Group[]> =>
    fetch(`${BASE_URL}/groups/`, { headers: authHeaders() })
      .then(handleResponse<Group[]>),

  getAllAdmin: (): Promise<Group[]> =>
    fetch(`${BASE_URL}/groups/all`, { headers: authHeaders() })
      .then(handleResponse<Group[]>),

  getById: (id: number): Promise<Group> =>
    fetch(`${BASE_URL}/groups/${id}`, { headers: authHeaders() })
      .then(handleResponse<Group>),

  create: (data: CreateGroupRequest): Promise<Group> =>
    fetch(`${BASE_URL}/groups/`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify(data),
    }).then(handleResponse<Group>),

  delete: (id: number): Promise<void> =>
    fetch(`${BASE_URL}/groups/${id}`, {
      method:  'DELETE',
      headers: authHeaders(),
    }).then(handleResponse<void>),

  addMember: (groupId: number, data: AddMemberRequest): Promise<Group> =>
    fetch(`${BASE_URL}/groups/${groupId}/members`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify(data),
    }).then(handleResponse<Group>),

  removeMember: (groupId: number, studentId: number): Promise<void> =>
    fetch(`${BASE_URL}/groups/${groupId}/members/${studentId}`, {
      method:  'DELETE',
      headers: authHeaders(),
    }).then(handleResponse<void>),

  uploadCover: (groupId: number, file: File): Promise<Group> => {
    const form = new FormData()
    form.append('file', file)
    return fetch(`${BASE_URL}/groups/${groupId}/cover`, {
      method:  'POST',
      headers: authHeadersMultipart(),
      body:    form,
    }).then(handleResponse<Group>)
  },
}
