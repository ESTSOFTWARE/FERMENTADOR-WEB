import { apiClient } from '../../../../core/network/client'

export interface Category {
  id:          number
  name:        string
  description: string | null
}

export const categoriesApi = {
  getAll: () => apiClient.get<Category[]>('/categories/'),
}
