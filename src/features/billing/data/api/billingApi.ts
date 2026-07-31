import { apiClient } from '../../../../core/network/client'
import type {
  CashPayment,
  CheckoutSession,
  PayPalClientToken,
  PayPalOrderResult,
  PayPalSubscriptionSession,
  Subscription,
} from '../../domain/models/Subscription'

export const billingApi = {
  // ── Inicio de pago → microservicio payments (/api/payments/*) ──────────────
  createCheckout: (plan: string, billing_cycle: string): Promise<CheckoutSession> =>
    apiClient.post<CheckoutSession>('/payments/checkout', { plan, billing_cycle }),

  createOxxo: (plan: string, billing_cycle: string): Promise<CashPayment> =>
    apiClient.post<CashPayment>('/payments/oxxo', { plan, billing_cycle }),

  createSpei: (plan: string, billing_cycle: string): Promise<CashPayment> =>
    apiClient.post<CashPayment>('/payments/spei', { plan, billing_cycle }),

  getCashPayment: (paymentId: number): Promise<CashPayment> =>
    apiClient.get<CashPayment>(`/payments/${paymentId}`),

  createPayPalSubscription: (plan: string, billing_cycle: string): Promise<PayPalSubscriptionSession> =>
    apiClient.post<PayPalSubscriptionSession>('/payments/paypal/subscription', { plan, billing_cycle }),

  getPayPalClientToken: (): Promise<PayPalClientToken> =>
    apiClient.get<PayPalClientToken>('/payments/paypal/client-token'),

  createPayPalOrder: (amount: string, currency: string, description: string): Promise<PayPalOrderResult> =>
    apiClient.post<PayPalOrderResult>('/payments/paypal/order', { amount, currency, description }),

  capturePayPalOrder: (orderId: string): Promise<object> =>
    apiClient.post<object>(`/payments/paypal/order/${orderId}/capture`, {}),

  cancelSubscription: (): Promise<{ message: string }> =>
    apiClient.post<{ message: string }>('/payments/subscription/cancel', {}),

  // ── Lectura de estado → API principal (/api/billing/*) ─────────────────────
  getSubscription: (): Promise<Subscription | null> =>
    apiClient.get<Subscription | null>('/billing/subscription'),
}
