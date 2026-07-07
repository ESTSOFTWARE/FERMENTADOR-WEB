import type { BenefitRepository } from '../repositories/BenefitRepository'
import type { Benefit }           from '../models/Benefit'

export class GetBenefitsUseCase {
  private readonly repository: BenefitRepository

  constructor(repository: BenefitRepository) {
    this.repository = repository
  }
  execute(productId: number): Promise<Benefit[]> {
    return this.repository.getByProduct(productId)
  }
}