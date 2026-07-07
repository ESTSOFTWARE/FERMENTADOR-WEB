import type { ReviewRepository } from '../repositories/ReviewRepository'
import type { ReviewPage }       from '../models/ReviewPage'

export class GetReviewsUseCase {
  private readonly repository: ReviewRepository

  constructor(repository: ReviewRepository) {
    this.repository = repository
  }
  execute(productId: number, page = 1, limit = 10): Promise<ReviewPage> {
    return this.repository.getByProduct(productId, page, limit)
  }
}