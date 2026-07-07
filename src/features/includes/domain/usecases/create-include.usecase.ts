import type { IncludeRepository }    from '../repositories/IncludeRepository'
import type { CreateIncludeRequest } from '../dtos/request/create-include.request'
import type { Include }              from '../models/Include'

export class CreateIncludeUseCase {
  private readonly repository: IncludeRepository

  constructor(repository: IncludeRepository) {
    this.repository = repository
  }
  execute(productId: number, data: CreateIncludeRequest): Promise<Include> {
    return this.repository.create(productId, data)
  }
}