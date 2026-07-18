import { apiClient } from '../../../../core/network/client'

export interface Review {
  id:         number
  product_id: number
  user_id:    number
  rating:     number
  comment:    string | null
  created_at: string
}

export interface ReviewList {
  items:          Review[]
  total:          number
  page:           number
  limit:          number
  average_rating: number
}

export interface CreateReviewRequest {
  rating:   number
  comment?: string | null
}

export const reviewsApi = {
  getAll: (productId: number, page = 1, limit = 10) =>
    apiClient.get<ReviewList>(`/products/${productId}/reviews/?page=${page}&limit=${limit}`),
  create: (productId: number, data: CreateReviewRequest) =>
    apiClient.post<Review>(`/products/${productId}/reviews/`, data),
  delete: (productId: number, reviewId: number) =>
    apiClient.delete<void>(`/products/${productId}/reviews/${reviewId}`),
}