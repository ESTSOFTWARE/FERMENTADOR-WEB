import type { CreateComponentRequest }    from '../../domain/dtos/request/create-component.request'
import type { UpdateComponentRequest }    from '../../domain/dtos/request/update-component.request'
import type { PaginatedProductsResponse } from '../../domain/dtos/response/paginated-products.response'
import type { Component }                 from '../../domain/models/Component'
import { apiClient }                      from '../../../../core/network/client'

export const componentsApi = {
  getAll: () => apiClient.get<PaginatedProductsResponse>('/products/?limit=100').then(r => r.items),
  getRelated: (id: number) => apiClient.get<Component[]>(`/products/${id}/related`),
  create: (data: CreateComponentRequest)               => apiClient.post<Component>('/products/', data),
  update: (id: number, data: UpdateComponentRequest)   => apiClient.put<Component>(`/products/${id}`, data),
  delete: (id: number)                                 => apiClient.delete<void>(`/products/${id}`),
  uploadImage: (id: number, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient.upload<Component>(`/products/${id}/image`, form)
  },
}
