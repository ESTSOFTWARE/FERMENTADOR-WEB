import type { ProductRepository } from '../../domain/repositories/ProductRepository'
import type { Product }           from '../../domain/models/Product'
import { productsApi }            from '../api/productsApi'

export class ProductRepositoryImpl implements ProductRepository {
  getAll(): Promise<Product[]> {
    return productsApi.getAll()
  }

  getById(id: number): Promise<Product> {
    return productsApi.getById(id)
  }
}
