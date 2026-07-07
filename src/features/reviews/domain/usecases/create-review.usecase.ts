import type { ReviewRepository }    from '../repositories/ReviewRepository'
import type { CreateReviewRequest } from '../dtos/request/create-review.request'
import type { Review }              from '../models/Review'

export class CreateReviewUseCase {
  private readonly repository: ReviewRepository

  constructor(repository: ReviewRepository) {
    this.repository = repository
  }

  execute(productId: number, data: CreateReviewRequest): Promise<Review> {
    return this.repository.create(productId, data)
  }
}