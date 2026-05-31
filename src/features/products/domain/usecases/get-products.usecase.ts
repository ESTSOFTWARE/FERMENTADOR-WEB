import type { ProductRepository } from '../repositories/ProductRepository'
import type { Product }           from '../models/Product'

export class GetProductsUseCase {
  private readonly repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  execute(): Promise<Product[]> {
    return this.repository.getAll()
  }
}
