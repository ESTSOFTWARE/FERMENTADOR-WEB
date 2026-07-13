import { apiClient } from '../../../../core/network/client'

export interface Include {
  id:          number
  product_id:  number
  description: string
}

export const includesApi = {
  getAll: (productId: number) => apiClient.get<Include[]>(`/products/${productId}/includes/`),
  create: (productId: number, data: { description: string }) =>
    apiClient.post<Include>(`/products/${productId}/includes/`, data),
  delete: (productId: number, id: number) =>
    apiClient.delete<void>(`/products/${productId}/includes/${id}`),
}
