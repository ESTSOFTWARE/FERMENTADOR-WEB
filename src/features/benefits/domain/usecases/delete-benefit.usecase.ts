import type { BenefitRepository } from '../repositories/BenefitRepository'

export class DeleteBenefitUseCase {
  private readonly repository: BenefitRepository

  constructor(repository: BenefitRepository) {
    this.repository = repository
  }

  execute(productId: number, benefitId: number): Promise<void> {
    return this.repository.delete(productId, benefitId)
  }
}