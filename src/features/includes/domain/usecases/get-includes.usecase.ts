import type { IncludeRepository } from '../repositories/IncludeRepository'
import type { Include }           from '../models/Include'

export class GetIncludesUseCase {
  private readonly repository: IncludeRepository

  constructor(repository: IncludeRepository) {
    this.repository = repository
  }

  execute(productId: number): Promise<Include[]> {
    return this.repository.getByProduct(productId)
  }
}