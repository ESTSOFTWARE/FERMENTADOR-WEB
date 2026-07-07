import type { Review } from './Review'

export interface ReviewPage {
  items:          Review[]
  total:          number
  page:           number
  limit:          number
  averageRating:  number
}