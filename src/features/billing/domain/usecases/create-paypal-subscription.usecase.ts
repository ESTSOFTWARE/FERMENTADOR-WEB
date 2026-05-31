import type { BillingRepository } from '../repositories/BillingRepository'

export class CreatePayPalSubscriptionUseCase {
  private readonly repository: BillingRepository
  constructor(repository: BillingRepository) { this.repository = repository }

  async execute(plan: string, billingCycle: string): Promise<string> {
    const session = await this.repository.createPayPalSubscription(plan, billingCycle)
    return session.subscription_id
  }
}
