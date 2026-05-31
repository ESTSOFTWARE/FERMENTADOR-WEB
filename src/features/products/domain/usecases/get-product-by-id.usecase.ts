import type { ProductRepository } from '../repositories/ProductRepository'
import type { Product }           from '../models/Product'

export class GetProductByIdUseCase {
  private readonly repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  execute(id: number): Promise<Product> {
    return this.repository.getById(id)
  }
}
