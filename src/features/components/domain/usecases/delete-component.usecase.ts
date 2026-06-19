import type { ComponentRepository } from '../repositories/ComponentRepository'

export class DeleteComponentUseCase {
  private readonly repository: ComponentRepository
  constructor(repository: ComponentRepository) { this.repository = repository }
  execute(id: number): Promise<void> { return this.repository.delete(id) }
}
