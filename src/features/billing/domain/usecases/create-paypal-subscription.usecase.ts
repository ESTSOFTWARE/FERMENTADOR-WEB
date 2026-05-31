import type { BillingRepository } from '../repositories/BillingRepository'

export class CreatePayPalSubscriptionUseCase {
  constructor(private repository: BillingRepository) {}

  async execute(plan: string, billingCycle: string): Promise<string> {
    const session = await this.repository.createPayPalSubscription(plan, billingCycle)
    return session.subscription_id
  }
}
