import { apiClient } from '../../../../core/network/client'

export interface Benefit {
  id:          number
  product_id:  number
  title:       string
  description: string | null
}

export const benefitsApi = {
  getAll: (productId: number) => apiClient.get<Benefit[]>(`/products/${productId}/benefits/`),
  create: (productId: number, data: { title: string; description: string | null }) =>
    apiClient.post<Benefit>(`/products/${productId}/benefits/`, data),
  delete: (productId: number, id: number) =>
    apiClient.delete<void>(`/products/${productId}/benefits/${id}`),
}
