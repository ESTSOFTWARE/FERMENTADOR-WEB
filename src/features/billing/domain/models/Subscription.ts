export interface Subscription {
  plan:                   string   // starter | academic | enterprise
  billing_cycle:          string   // monthly | annual
  status:                 string   // active | past_due | canceled | incomplete
  current_period_end:     string | null
  cancel_at_period_end:   boolean
  payment_provider?:      string   // stripe | paypal
  paypal_subscription_id?: string | null
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
