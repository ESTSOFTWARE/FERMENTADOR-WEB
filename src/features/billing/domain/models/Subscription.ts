export interface Subscription {
  plan:                   string   // starter | academic | enterprise
  billing_cycle:          string   // monthly | annual
  status:                 string   // active | past_due | canceled | incomplete | pending_payment | expired
  current_period_end:     string | null
  cancel_at_period_end:   boolean
  payment_provider?:      string   // stripe | paypal | oxxo | spei
  paypal_subscription_id?: string | null
}

// Pago OXXO/SPEI (efectivo/transferencia). Es asíncrono: se genera un voucher/
// CLABE con referencia y el pago se confirma después (status pending → succeeded).
export interface CashPayment {
  payment_id:    number
  provider:      'oxxo' | 'spei'
  status:        'pending' | 'succeeded' | 'expired'
  amount_mxn:    number   // centavos
  plan:          string
  billing_cycle: string
  reference:     string | null
  expires_at:    string | null
  voucher_url?:  string | null   // OXXO: URL del voucher imprimible
  clabe?:        string | null   // SPEI: CLABE a la que transferir
}

export interface CheckoutSession {
  client_secret: string
}

export interface PayPalSubscriptionSession {
  subscription_id: string
}

export interface PayPalClientToken {
  client_token: string
}

export interface PayPalOrderResult {
  order_id: string
}
