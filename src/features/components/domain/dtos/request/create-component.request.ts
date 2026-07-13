export interface CreateComponentRequest {
  name:         string
  description:  string
  price:        number
  sku:          string
  stock:        number
  image?:       string | null
  category_id?: number | null
}
