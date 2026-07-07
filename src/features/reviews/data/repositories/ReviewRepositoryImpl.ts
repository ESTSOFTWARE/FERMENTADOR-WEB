import { reviewsDatasource }        from '../datasources/reviewsDatasource'
import { ReviewMapper }             from '../mappers/review.mapper'
import type { CreateReviewRequest } from '../../domain/dtos/request/create-review.request'
import type { Review }              from '../../domain/models/Review'
import type { ReviewPage }          from '../../domain/models/ReviewPage'
import type { ReviewRepository }    from '../../domain/repositories/ReviewRepository'

export class ReviewRepositoryImpl implements ReviewRepository {
  async getByProduct(productId: number, page: number, limit: number): Promise<ReviewPage> {
    return ReviewMapper.toPage(await reviewsDatasource.getByProduct(productId, page, limit))
  }
  async create(productId: number, data: CreateReviewRequest): Promise<Review> {
    return ReviewMapper.toModel(await reviewsDatasource.create(productId, data))
  }
  delete(productId: number, reviewId: number): Promise<void> {
    return reviewsDatasource.delete(productId, reviewId)
  }
}