import type { BillingRepository } from '../repositories/BillingRepository'

export class CreateCheckoutUseCase {
  private readonly repository: BillingRepository
  constructor(repository: BillingRepository) { this.repository = repository }

  async execute(plan: string, billingCycle: string): Promise<string> {
    const session = await this.repository.createCheckout(plan, billingCycle)
    return session.client_secret
  }
}
