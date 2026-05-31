import type { CheckoutSession, PayPalSubscriptionSession, Subscription } from '../../domain/models/Subscription'
import type { BillingRepository } from '../../domain/repositories/BillingRepository'
import { billingApi } from '../api/billingApi'

export class BillingRepositoryImpl implements BillingRepository {
  createCheckout(plan: string, billingCycle: string): Promise<CheckoutSession> {
    return billingApi.createCheckout(plan, billingCycle)
  }

  createPayPalSubscription(plan: string, billingCycle: string): Promise<PayPalSubscriptionSession> {
    return billingApi.createPayPalSubscription(plan, billingCycle)
  }

  getSubscription(): Promise<Subscription | null> {
    return billingApi.getSubscription()
  }

  cancelSubscription(): Promise<void> {
    return billingApi.cancelSubscription()
  }
}
