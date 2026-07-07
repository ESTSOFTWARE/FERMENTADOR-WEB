export interface ReviewDto {
  id:         number
  product_id: number
  user_id:    number
  rating:     number
  comment:    string | null
  created_at: string
}

export interface ReviewListResponseDto {
  items:          ReviewDto[]
  total:          number
  page:           number
  limit:          number
  average_rating: number
}