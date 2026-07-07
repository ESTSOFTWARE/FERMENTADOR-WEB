import type { SpecificationRepository }    from '../repositories/SpecificationRepository'
import type { UpdateSpecificationRequest } from '../dtos/request/update-specification.request'
import type { Specification }              from '../models/Specification'

export class UpdateSpecificationUseCase {
  private readonly repository: SpecificationRepository

  constructor(repository: SpecificationRepository) {
    this.repository = repository
  }

  execute(productId: number, specId: number, data: UpdateSpecificationRequest): Promise<Specification> {
    return this.repository.update(productId, specId, data)
  }
}