export type SubscriptionStatus = 'ACTIVE' | 'SUSPENDED' | 'CANCELLED'

export type CheckoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETE'

export interface CheckoutRecord {
  id: string
  store_hash: string
  plan_id: string
  status: CheckoutStatus
  checkout_url: string
  created_at: number
}

export interface Subscription {
  id: string
  status: SubscriptionStatus
  product: {
    id: string
    type: string
    productLevel: string
  }
  pricePerInterval: {
    value: string
    currencyCode: string
  }
  billingInterval: string
  currentPeriodEnd: string
  activationDate: string
}
