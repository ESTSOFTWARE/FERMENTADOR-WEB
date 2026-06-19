export interface Component {
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
