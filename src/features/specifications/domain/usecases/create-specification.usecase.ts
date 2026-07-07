import type { SpecificationRepository }    from '../repositories/SpecificationRepository'
import type { CreateSpecificationRequest } from '../dtos/request/create-specification.request'
import type { Specification }              from '../models/Specification'

export class CreateSpecificationUseCase {
  private readonly repository: SpecificationRepository

  constructor(repository: SpecificationRepository) {
    this.repository = repository
  }

  execute(productId: number, data: CreateSpecificationRequest): Promise<Specification> {
    return this.repository.create(productId, data)
  }
}