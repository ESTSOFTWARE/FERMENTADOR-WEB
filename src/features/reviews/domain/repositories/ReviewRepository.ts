import type { ReviewPage }            from '../models/ReviewPage'
import type { CreateReviewRequest }   from '../dtos/request/create-review.request'
import type { Review }                from '../models/Review'

export interface ReviewRepository {
  getByProduct(productId: number, page: number, limit: number): Promise<ReviewPage>
  create(productId: number, data: CreateReviewRequest):          Promise<Review>
  delete(productId: number, reviewId: number):                   Promise<void>
}