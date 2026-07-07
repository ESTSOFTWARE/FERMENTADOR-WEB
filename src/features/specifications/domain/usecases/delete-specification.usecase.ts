import type { SpecificationRepository } from '../repositories/SpecificationRepository'

export class DeleteSpecificationUseCase {
  private readonly repository: SpecificationRepository

  constructor(repository: SpecificationRepository) {
    this.repository = repository
  }

  execute(productId: number, specId: number): Promise<void> {
    return this.repository.delete(productId, specId)
  }
}