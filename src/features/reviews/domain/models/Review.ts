export interface Review {
  id:         number
  product_id: number
  user_id:    number
  rating:     number
  comment:    string | null
  created_at: string
}