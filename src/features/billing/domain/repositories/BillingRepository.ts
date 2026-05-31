import type { CheckoutSession, PayPalSubscriptionSession, Subscription } from '../models/Subscription'

export interface BillingRepository {
  createCheckout(plan: string, billingCycle: string): Promise<CheckoutSession>
  createPayPalSubscription(plan: string, billingCycle: string): Promise<PayPalSubscriptionSession>
  getSubscription(): Promise<Subscription | null>
  cancelSubscription(): Promise<void>
}
