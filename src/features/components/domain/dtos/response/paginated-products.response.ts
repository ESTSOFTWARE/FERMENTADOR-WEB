import type { Component } from '../../models/Component'

export interface PaginatedProductsResponse {
  items: Component[]
  total: number
  page:  number
  limit: number
}
