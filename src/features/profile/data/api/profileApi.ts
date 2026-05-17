import type {
  UpdateUserRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ActivateCircuitRequest,
  ActivateCircuitResponse,
  UserProfile,
} from '../../domain/models/Profile'

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

export const profileApi = {
  getUser: (userId: number): Promise<UserProfile> =>
    fetch(`${BASE_URL}/users/${userId}`, {
      headers: authHeaders(),
    }).then(handleResponse<UserProfile>),

  uploadProfileImage: (file: File): Promise<{ profile_image: string }> => {
    const form = new FormData()
    form.append('file', file)
    const headers: Record<string, string> = { 'ngrok-skip-browser-warning': 'true' }
    const token = localStorage.getItem('access_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 30_000)
    return fetch(`${BASE_URL}/users/me/profile-image`, {
      method: 'POST',
      headers,
      body: form,
      signal: controller.signal,
    })
      .then(res => { clearTimeout(timer); return handleResponse<{ profile_image: string }>(res) })
      .catch(err => {
        clearTimeout(timer)
        if (err instanceof DOMException && err.name === 'AbortError') {
          throw new Error('La subida tardó demasiado. Verifica tu conexión e inténtalo de nuevo.')
        }
        throw err
      })
  },

  changePassword: (data: ChangePasswordRequest): Promise<ChangePasswordResponse> =>
    fetch(`${BASE_URL}/users/me/change-password`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify(data),
    }).then(handleResponse<ChangePasswordResponse>),

  updateUser: (userId: number, data: UpdateUserRequest): Promise<UserProfile> =>
    fetch(`${BASE_URL}/users/${userId}`, {
      method:  'PUT',
      headers: authHeaders(),
      body:    JSON.stringify(data),
    }).then(handleResponse<UserProfile>),

  // POST /users/me/activate → { access_token, token_type, circuit_id }
  activateCircuit: (data: ActivateCircuitRequest): Promise<ActivateCircuitResponse> =>
    fetch(`${BASE_URL}/users/me/activate`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify(data),
    }).then(handleResponse<ActivateCircuitResponse>),
}