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

export const reviewsApi = {
  getAll: (productId: number) => apiClient.get<ReviewList>(`/products/${productId}/reviews/`),
}
