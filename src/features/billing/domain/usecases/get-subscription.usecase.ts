import type { Subscription } from '../models/Subscription'
import type { BillingRepository } from '../repositories/BillingRepository'

export class GetSubscriptionUseCase {
  constructor(private repository: BillingRepository) {}

  async execute(): Promise<Subscription | null> {
    return this.repository.getSubscription()
  }
}
