import type { ComponentRepository }    from '../repositories/ComponentRepository'
import type { CreateComponentRequest } from '../dtos/request/create-component.request'
import type { Component }              from '../models/Component'

export class CreateComponentUseCase {
  private readonly repository: ComponentRepository
  constructor(repository: ComponentRepository) { this.repository = repository }
  execute(data: CreateComponentRequest): Promise<Component> { return this.repository.create(data) }
}
