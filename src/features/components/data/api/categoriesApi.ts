import { apiClient } from '../../../../core/network/client'

export interface Category {
  id:          number
  name:        string
  description: string | null
}

export interface CreateCategoryRequest {
  name:         string
  description?: string | null
}

export interface UpdateCategoryRequest {
  name?:        string
  description?: string | null
}

export const categoriesApi = {
  getAll: ()                                        => apiClient.get<Category[]>('/categories/'),
  create: (data: CreateCategoryRequest)              => apiClient.post<Category>('/categories/', data),
  update: (id: number, data: UpdateCategoryRequest)  => apiClient.put<Category>(`/categories/${id}`, data),
  delete: (id: number)                               => apiClient.delete<void>(`/categories/${id}`),
}