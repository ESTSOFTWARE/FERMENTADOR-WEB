import type { Subscription } from '../models/Subscription'
import type { BillingRepository } from '../repositories/BillingRepository'

export class GetSubscriptionUseCase {
  private readonly repository: BillingRepository
  constructor(repository: BillingRepository) { this.repository = repository }

  async execute(): Promise<Subscription | null> {
    return this.repository.getSubscription()
  }
}
