import type {
  CashPayment,
  CheckoutSession,
  PayPalSubscriptionSession,
  Subscription,
} from '../models/Subscription'

export interface BillingRepository {
  createCheckout(plan: string, billingCycle: string): Promise<CheckoutSession>
  createOxxo(plan: string, billingCycle: string): Promise<CashPayment>
  createSpei(plan: string, billingCycle: string): Promise<CashPayment>
  getCashPayment(paymentId: number): Promise<CashPayment>
  createPayPalSubscription(plan: string, billingCycle: string): Promise<PayPalSubscriptionSession>
  getSubscription(): Promise<Subscription | null>
  cancelSubscription(): Promise<{ message: string }>
}
