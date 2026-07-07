import type { CreateBenefitRequest } from '../../domain/dtos/request/create-benefit.request'
import type { UpdateBenefitRequest } from '../../domain/dtos/request/update-benefit.request'
import type { BenefitDto }           from '../dtos/response/benefit.dto'
import { apiClient }                 from '../../../../core/network/client'

export const benefitsDatasource = {
  getByProduct: (productId: number) =>
    apiClient.get<BenefitDto[]>(`/products/${productId}/benefits/`),

  create: (productId: number, data: CreateBenefitRequest) =>
    apiClient.post<BenefitDto>(`/products/${productId}/benefits/`, data),

  update: (productId: number, benefitId: number, data: UpdateBenefitRequest) =>
    apiClient.put<BenefitDto>(`/products/${productId}/benefits/${benefitId}`, data),

  delete: (productId: number, benefitId: number) =>
    apiClient.delete<void>(`/products/${productId}/benefits/${benefitId}`),
}