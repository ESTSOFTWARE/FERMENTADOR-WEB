export interface ProductSpec {
  label: string
  value: string
}

export interface ProductReview {
  id:          number
  name:        string
  initials:    string
  institution: string
  rating:      number
  date:        string
  text:        string
  verified?:   boolean
}

export interface Product {
  id:                   number
  name:                 string
  description:          string
  price:                number
  sku:                  string
  stock:                number
  rating:               number
  image?:               string
  tags?:                string[]
  category?:            string
  specs?:               ProductSpec[]
  inclusions?:          string[]
  compatibility?:       string
  reviews?:             ProductReview[]
  reviewCount?:         number
  ratingDistribution?:  { [star: number]: number }
}
