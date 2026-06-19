export interface CreateComponentRequest {
  name:         string
  description:  string
  price:        number
  sku:          string
  stock:        number
  category_id?: number | null
}
