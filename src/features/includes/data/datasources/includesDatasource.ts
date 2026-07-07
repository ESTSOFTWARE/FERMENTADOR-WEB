import type { CreateIncludeRequest } from '../../domain/dtos/request/create-include.request'
import type { UpdateIncludeRequest } from '../../domain/dtos/request/update-include.request'
import type { IncludeDto }           from '../dtos/response/include.dto'
import { apiClient }                 from '../../../../core/network/client'

export const includesDatasource = {
  getByProduct: (productId: number) =>
    apiClient.get<IncludeDto[]>(`/products/${productId}/includes/`),

  create: (productId: number, data: CreateIncludeRequest) =>
    apiClient.post<IncludeDto>(`/products/${productId}/includes/`, data),

  update: (productId: number, includeId: number, data: UpdateIncludeRequest) =>
    apiClient.put<IncludeDto>(`/products/${productId}/includes/${includeId}`, data),

  delete: (productId: number, includeId: number) =>
    apiClient.delete<void>(`/products/${productId}/includes/${includeId}`),
}