export interface ComponentDto {
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

export interface ComponentsResponseDto {
  items: ComponentDto[]
  total: number
  page:  number
  limit: number
}