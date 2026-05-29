import type { UpdateUserRequest }       from '../../domain/dtos/request/update-user.request'
import type { ChangePasswordRequest }   from '../../domain/dtos/request/change-password.request'
import type { ActivateCircuitRequest }  from '../../domain/dtos/request/activate-circuit.request'
import type { ChangePasswordResponse }  from '../../domain/dtos/response/change-password.response'
import type { ActivateCircuitResponse } from '../../domain/dtos/response/activate-circuit.response'
import type { UserProfile }             from '../../domain/models/UserProfile'
import { apiClient }                    from '../../../../core/network/client'

export const profileApi = {
  getUser: (userId: number) =>
    apiClient.get<UserProfile>(`/users/${userId}`),

  uploadProfileImage: (file: File): Promise<{ profile_image: string }> => {
    const form       = new FormData()
    const controller = new AbortController()
    const timer      = setTimeout(() => controller.abort(), 30_000)
    form.append('file', file)
    return apiClient.upload<{ profile_image: string }>('/users/me/profile-image', form)
      .then(res  => { clearTimeout(timer); return res })
      .catch(err => {
        clearTimeout(timer)
        if (err instanceof DOMException && err.name === 'AbortError') {
          throw new Error('La subida tardó demasiado. Verifica tu conexión e inténtalo de nuevo.')
        }
        throw err
      })
  },

  changePassword: (data: ChangePasswordRequest) =>
    apiClient.post<ChangePasswordResponse>('/users/me/change-password', data),

  updateUser: (userId: number, data: UpdateUserRequest) =>
    apiClient.put<UserProfile>(`/users/${userId}`, data),

  activateCircuit: (data: ActivateCircuitRequest) =>
    apiClient.post<ActivateCircuitResponse>('/users/me/activate', data),

  markTourCompleted: () =>
    apiClient.patch<{ message: string }>('/users/me/tour'),
}
