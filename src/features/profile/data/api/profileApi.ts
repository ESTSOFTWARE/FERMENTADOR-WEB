import type {
  UpdateUserRequest,
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