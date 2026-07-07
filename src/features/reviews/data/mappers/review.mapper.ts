import type { ReviewDto, ReviewListResponseDto } from '../dtos/response/review.dto'
import type { Review }                           from '../../domain/models/Review'
import type { ReviewPage }                       from '../../domain/models/ReviewPage'

export const ReviewMapper = {
  toModel(dto: ReviewDto): Review {
    return {
      id:         dto.id,
      product_id: dto.product_id,
      user_id:    dto.user_id,
      rating:     dto.rating,
      comment:    dto.comment,
      created_at: dto.created_at,
    }
  },
  toPage(dto: ReviewListResponseDto): ReviewPage {
    return {
      items:         dto.items.map(ReviewMapper.toModel),
      total:         dto.total,
      page:          dto.page,
      limit:         dto.limit,
      averageRating: dto.average_rating,
    }
  },
}