import type { ComponentRepository } from '../repositories/ComponentRepository'
import type { Component }           from '../models/Component'

export class GetComponentsUseCase {
  private readonly repository: ComponentRepository
  constructor(repository: ComponentRepository) { this.repository = repository }
  execute(): Promise<Component[]> { return this.repository.getAll() }
}
