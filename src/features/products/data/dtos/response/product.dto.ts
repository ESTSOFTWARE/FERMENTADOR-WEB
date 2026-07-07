export interface ProductDto {
  id:          number
  name:        string
  description: string
  price:       number
  sku:         string
  stock:       number
  rating:      number
  category_id: number | null
  created_at:  string
  updated_at:  string
}

export interface ProductsResponseDto {
  items: ProductDto[]
  total: number
  page:  number
  limit: number
}