import type { BenefitRepository }    from '../repositories/BenefitRepository'
import type { UpdateBenefitRequest } from '../dtos/request/update-benefit.request'
import type { Benefit }              from '../models/Benefit'

export class UpdateBenefitUseCase {
  private readonly repository: BenefitRepository

  constructor(repository: BenefitRepository) {
    this.repository = repository
  }
  execute(productId: number, benefitId: number, data: UpdateBenefitRequest): Promise<Benefit> {
    return this.repository.update(productId, benefitId, data)
  }
}