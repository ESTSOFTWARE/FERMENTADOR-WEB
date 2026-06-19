import type { ComponentRepository }    from '../repositories/ComponentRepository'
import type { UpdateComponentRequest } from '../dtos/request/update-component.request'
import type { Component }              from '../models/Component'

export class UpdateComponentUseCase {
  private readonly repository: ComponentRepository
  constructor(repository: ComponentRepository) { this.repository = repository }
  execute(id: number, data: UpdateComponentRequest): Promise<Component> { return this.repository.update(id, data) }
}
