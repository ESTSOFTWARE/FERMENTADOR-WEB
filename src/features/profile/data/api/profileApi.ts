import type { UpdateUserRequest }       from '../../domain/dtos/request/update-user.request'
import type { ChangePasswordRequest }   from '../../domain/dtos/request/change-password.request'
import type { ActivateCircuitRequest }  from '../../domain/dtos/request/activate-circuit.request'
import type { ChangePasswordResponse }  from '../../domain/dtos/response/change-password.response'
import type { ActivateCircuitResponse } from '../../domain/dtos/response/activate-circuit.response'
import type { UserProfile }             from '../../domain/models/UserProfile'
import { authHeaders, authHeadersMultipart, handleResponse } from '../../../../core/api/http'

const BASE_URL = import.meta.env.VITE_API_URL

export const profileApi = {
  getUser: (userId: number): Promise<UserProfile> =>
    fetch(`${BASE_URL}/users/${userId}`, {
      headers: authHeaders(),
    }).then(handleResponse<UserProfile>),

  uploadProfileImage: (file: File): Promise<{ profile_image: string }> => {
    const form = new FormData()
    form.append('file', file)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 30_000)
    return fetch(`${BASE_URL}/users/me/profile-image`, {
      method:  'POST',
      headers: authHeadersMultipart(),
      body:    form,
      signal:  controller.signal,
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

  activateCircuit: (data: ActivateCircuitRequest): Promise<ActivateCircuitResponse> =>
    fetch(`${BASE_URL}/users/me/activate`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify(data),
    }).then(handleResponse<ActivateCircuitResponse>),

  markTourCompleted: (): Promise<{ message: string }> =>
    fetch(`${BASE_URL}/users/me/tour`, {
      method:  'PATCH',
      headers: authHeaders(),
    }).then(handleResponse<{ message: string }>),
}
