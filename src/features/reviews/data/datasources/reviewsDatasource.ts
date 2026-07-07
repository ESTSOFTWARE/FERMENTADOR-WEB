import type { CreateReviewRequest }        from '../../domain/dtos/request/create-review.request'
import type { ReviewDto, ReviewListResponseDto } from '../dtos/response/review.dto'
import { apiClient }                       from '../../../../core/network/client'

export const reviewsDatasource = {
  getByProduct: (productId: number, page: number, limit: number) =>
    apiClient.get<ReviewListResponseDto>(`/products/${productId}/reviews/?page=${page}&limit=${limit}`),

  create: (productId: number, data: CreateReviewRequest) =>
    apiClient.post<ReviewDto>(`/products/${productId}/reviews/`, data),

  delete: (productId: number, reviewId: number) =>
    apiClient.delete<void>(`/products/${productId}/reviews/${reviewId}`),
}