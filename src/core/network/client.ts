const BASE_URL = import.meta.env.VITE_API_URL

const JSON_HEADERS = {
  'Content-Type':               'application/json',
  'ngrok-skip-browser-warning': 'true',
}

const MULTIPART_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  // No Content-Type — el browser lo pone automáticamente con el boundary de FormData
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    if (res.status === 401) {
      localStorage.removeItem('user_data')
      localStorage.removeItem('profile_image')
      // data.detail === 'SESSION_REPLACED' cuando se inició sesión en otro dispositivo
      window.dispatchEvent(new CustomEvent('session_expired', { detail: data?.detail }))
    }
    throw new Error(data?.detail ?? `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
  })
  return handleResponse<T>(res)
}

export const apiClient = {
  get: <T>(path: string) =>
    request<T>(path, { headers: JSON_HEADERS }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method:  'POST',
      headers: JSON_HEADERS,
      body:    body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method:  'PUT',
      headers: JSON_HEADERS,
      body:    body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method:  'PATCH',
      headers: JSON_HEADERS,
      body:    body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE', headers: JSON_HEADERS }),

  upload: <T>(path: string, form: FormData, method: 'POST' | 'PUT' | 'PATCH' = 'POST') =>
    request<T>(path, { method, headers: MULTIPART_HEADERS, body: form }),
}
