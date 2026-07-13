import { apiClient } from '../../../../core/network/client'

export interface Specification {
  id:         number
  product_id: number
  name:       string
  value:      string
}

export const specificationsApi = {
  getAll: (productId: number) => apiClient.get<Specification[]>(`/products/${productId}/specifications/`),
  create: (productId: number, data: { name: string; value: string }) =>
    apiClient.post<Specification>(`/products/${productId}/specifications/`, data),
  delete: (productId: number, id: number) =>
    apiClient.delete<void>(`/products/${productId}/specifications/${id}`),
}
