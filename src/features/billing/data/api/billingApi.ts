import { apiClient } from '../../../../core/network/client'
import type {
  CheckoutSession,
  PayPalClientToken,
  PayPalOrderResult,
  PayPalSubscriptionSession,
  Subscription,
} from '../../domain/models/Subscription'

export const billingApi = {
  createCheckout: (plan: string, billing_cycle: string): Promise<CheckoutSession> =>
    apiClient.post<CheckoutSession>('/billing/checkout', { plan, billing_cycle }),

  createPayPalSubscription: (plan: string, billing_cycle: string): Promise<PayPalSubscriptionSession> =>
    apiClient.post<PayPalSubscriptionSession>('/billing/paypal/subscription', { plan, billing_cycle }),

  getPayPalClientToken: (): Promise<PayPalClientToken> =>
    apiClient.get<PayPalClientToken>('/billing/paypal/client-token'),

  createPayPalOrder: (amount: string, currency: string, description: string): Promise<PayPalOrderResult> =>
    apiClient.post<PayPalOrderResult>('/billing/paypal/order', { amount, currency, description }),

  capturePayPalOrder: (orderId: string): Promise<object> =>
    apiClient.post<object>(`/billing/paypal/order/${orderId}/capture`, {}),

  getSubscription: (): Promise<Subscription | null> =>
    apiClient.get<Subscription | null>('/billing/subscription'),

  cancelSubscription: (): Promise<void> =>
    apiClient.delete<void>('/billing/subscription'),
}
