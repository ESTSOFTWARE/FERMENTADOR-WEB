import type { CreateSpecificationRequest } from '../../domain/dtos/request/create-specification.request'
import type { UpdateSpecificationRequest } from '../../domain/dtos/request/update-specification.request'
import type { SpecificationDto }           from '../dtos/response/specification.dto'
import { apiClient }                       from '../../../../core/network/client'

export const specificationsDatasource = {
  getByProduct: (productId: number) =>
    apiClient.get<SpecificationDto[]>(`/products/${productId}/specifications/`),

  create: (productId: number, data: CreateSpecificationRequest) =>
    apiClient.post<SpecificationDto>(`/products/${productId}/specifications/`, data),

  update: (productId: number, specId: number, data: UpdateSpecificationRequest) =>
    apiClient.put<SpecificationDto>(`/products/${productId}/specifications/${specId}`, data),

  delete: (productId: number, specId: number) =>
    apiClient.delete<void>(`/products/${productId}/specifications/${specId}`),
}