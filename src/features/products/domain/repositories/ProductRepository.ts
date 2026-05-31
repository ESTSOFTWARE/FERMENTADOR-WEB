import type { Product } from '../models/Product'

export interface ProductRepository {
  getAll():             Promise<Product[]>
  getById(id: number):  Promise<Product>
}
