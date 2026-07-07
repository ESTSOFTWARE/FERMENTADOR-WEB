import type { ReviewRepository } from '../repositories/ReviewRepository'

export class DeleteReviewUseCase {
  private readonly repository: ReviewRepository

  constructor(repository: ReviewRepository) {
    this.repository = repository
  }
  execute(productId: number, reviewId: number): Promise<void> {
    return this.repository.delete(productId, reviewId)
  }
}