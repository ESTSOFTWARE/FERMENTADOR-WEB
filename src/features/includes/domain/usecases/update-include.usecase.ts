import type { IncludeRepository }    from '../repositories/IncludeRepository'
import type { UpdateIncludeRequest } from '../dtos/request/update-include.request'
import type { Include }              from '../models/Include'

export class UpdateIncludeUseCase {
  private readonly repository: IncludeRepository

  constructor(repository: IncludeRepository) {
    this.repository = repository
  }

  execute(productId: number, includeId: number, data: UpdateIncludeRequest): Promise<Include> {
    return this.repository.update(productId, includeId, data)
  }
}