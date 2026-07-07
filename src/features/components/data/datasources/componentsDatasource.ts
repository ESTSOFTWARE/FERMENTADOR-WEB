import type { CreateComponentRequest }              from '../../domain/dtos/request/create-component.request'
import type { UpdateComponentRequest }              from '../../domain/dtos/request/update-component.request'
import type { ComponentDto, ComponentsResponseDto } from '../dtos/response/component.dto'
import { apiClient }                                from '../../../../core/network/client'

export const componentsDatasource = {
  getAll: ()                                         => apiClient.get<ComponentsResponseDto>('/products/?limit=100'),
  create: (data: CreateComponentRequest)              => apiClient.post<ComponentDto>('/products/', data),
  update: (id: number, data: UpdateComponentRequest)  => apiClient.put<ComponentDto>(`/products/${id}`, data),
  delete: (id: number)                                => apiClient.delete<void>(`/products/${id}`),
}