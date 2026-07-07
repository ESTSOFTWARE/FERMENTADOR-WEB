import type { BenefitRepository }    from '../repositories/BenefitRepository'
import type { CreateBenefitRequest } from '../dtos/request/create-benefit.request'
import type { Benefit }              from '../models/Benefit'

export class CreateBenefitUseCase {
  private readonly repository: BenefitRepository

  constructor(repository: BenefitRepository) {
    this.repository = repository
  }

  execute(productId: number, data: CreateBenefitRequest): Promise<Benefit> {
    return this.repository.create(productId, data)
  }
}