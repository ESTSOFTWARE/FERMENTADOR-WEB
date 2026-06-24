import type { UserRequest }  from '../../models/dto/UserRequest'
import type { UserResponse } from '../../models/dto/UserResponse'
import type { User }         from '../../models/entities/User'
import { apiClient }         from '../../../../core/network/client'

export const userApi = {
  getAll:  ()                              => apiClient.get<User[]>('/users/'),
  getById: (id: number)                    => apiClient.get<User>(`/users/${id}`),
  create:  (body: UserRequest)             => apiClient.post<UserResponse>('/users/', body),
  update:  (id: number, body: Partial<UserRequest>) => apiClient.put<UserResponse>(`/users/${id}`, body),
  delete:  (id: number)                    => apiClient.delete<void>(`/users/${id}`),
}
