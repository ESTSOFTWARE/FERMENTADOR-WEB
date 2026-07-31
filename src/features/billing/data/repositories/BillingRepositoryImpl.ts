import type {
  CashPayment,
  CheckoutSession,
  PayPalSubscriptionSession,
  Subscription,
} from '../../domain/models/Subscription'
import type { BillingRepository } from '../../domain/repositories/BillingRepository'
import { billingApi } from '../api/billingApi'

export class BillingRepositoryImpl implements BillingRepository {
  createCheckout(plan: string, billingCycle: string): Promise<CheckoutSession> {
    return billingApi.createCheckout(plan, billingCycle)
  }

  createOxxo(plan: string, billingCycle: string): Promise<CashPayment> {
    return billingApi.createOxxo(plan, billingCycle)
  }

  createSpei(plan: string, billingCycle: string): Promise<CashPayment> {
    return billingApi.createSpei(plan, billingCycle)
  }

  getCashPayment(paymentId: number): Promise<CashPayment> {
    return billingApi.getCashPayment(paymentId)
  }

  createPayPalSubscription(plan: string, billingCycle: string): Promise<PayPalSubscriptionSession> {
    return billingApi.createPayPalSubscription(plan, billingCycle)
  }

  getSubscription(): Promise<Subscription | null> {
    return billingApi.getSubscription()
  }

  cancelSubscription(): Promise<{ message: string }> {
    return billingApi.cancelSubscription()
  }
}
