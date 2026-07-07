import type { IncludeRepository } from '../repositories/IncludeRepository'

export class DeleteIncludeUseCase {
  private readonly repository: IncludeRepository

  constructor(repository: IncludeRepository) {
    this.repository = repository
  }

  execute(productId: number, includeId: number): Promise<void> {
    return this.repository.delete(productId, includeId)
  }
}