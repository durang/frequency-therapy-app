/**
 * Lemon Squeezy checkout configuration.
 *
 * Two plans: Monthly ($19/mo) and Annual ($120/yr — $10/mo).
 * Checkout URLs point to Lemon Squeezy hosted pages.
 * S05 will later replace <a href> links with Lemon.js overlay.
 */

export interface Plan {
  id: 'monthly' | 'annual'
  name: string
  price: number          // dollars
  period: 'month' | 'year'
  pricePerMonth: number  // effective $/mo for display
  checkoutUrl: string
  badge?: string
}

/** Lemon Squeezy checkout URLs — replace with real variant URLs before launch. */
export const CHECKOUT_URLS = {
  monthly: 'https://morphiclabs.lemonsqueezy.com/checkout/buy/9010f980-603c-4d95-8454-9bd2aa947586',
  annual: 'https://morphiclabs.lemonsqueezy.com/checkout/buy/54be9e9c-84af-41d2-af28-9275b08ebe17',
} as const

export const PLANS: Record<'monthly' | 'annual', Plan> = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    price: 19,
    period: 'month',
    pricePerMonth: 19,
    checkoutUrl: CHECKOUT_URLS.monthly,
  },
  annual: {
    id: 'annual',
    name: 'Annual',
    price: 120,
    period: 'year',
    pricePerMonth: 10,
    checkoutUrl: CHECKOUT_URLS.annual,
    badge: 'Save 47%',
  },
} as const

/** Unified feature list shared across both plans. */
export const FEATURES = [
  'All research-backed frequencies',
  'Unlimited session time',
  'DJ-style multi-frequency mixing',
  'Spatial audio positioning',
  'AI frequency recommendations',
  'Progress tracking & streaks',
  'Visual therapy patterns',
  'Dark & light theme support',
] as const

/**
 * Build a parameterised Lemon Squeezy checkout URL.
 *
 * Appends `checkout[custom][user_id]` and `checkout[email]` query
 * parameters so the webhook can link the subscription back to the
 * authenticated user.
 */
export function buildCheckoutUrl(
  planId: 'monthly' | 'annual',
  userId?: string,
  email?: string,
): string {
  const base = CHECKOUT_URLS[planId]
  const params = new URLSearchParams()

  if (userId) {
    params.set('checkout[custom][user_id]', userId)
  }
  if (email) {
    params.set('checkout[email]', email)
  }

  const qs = params.toString()
  if (!qs) return base

  // Handle URLs that may already contain a query string
  const separator = base.includes('?') ? '&' : '?'
  return `${base}${separator}${qs}`
}
