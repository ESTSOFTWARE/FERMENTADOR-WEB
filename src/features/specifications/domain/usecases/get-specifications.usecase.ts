import type { SpecificationRepository } from '../repositories/SpecificationRepository'
import type { Specification }           from '../models/Specification'

export class GetSpecificationsUseCase {
  private readonly repository: SpecificationRepository

  constructor(repository: SpecificationRepository) {
    this.repository = repository
  }
  execute(productId: number): Promise<Specification[]> {
    return this.repository.getByProduct(productId)
  }
}