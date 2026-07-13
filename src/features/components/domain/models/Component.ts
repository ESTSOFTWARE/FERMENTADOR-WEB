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
  /** Opcional: el backend aún no lo devuelve; los mocks sí. */
  image?:      string | null
}
