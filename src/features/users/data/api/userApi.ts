import { apiClient } from '../../../../core/network/client'

export const userApi = {
  getAll:          ()                   => apiClient.get('/users/'),
  getById:         (id: number)         => apiClient.get(`/users/${id}`),
  create:          (body: object)       => apiClient.post('/users/', body),
  update:          (id: number, body: object) => apiClient.put(`/users/${id}/`, body),
  delete:          (id: number)         => apiClient.delete(`/users/${id}/`),
}
