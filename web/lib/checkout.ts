/**
 * Lemon Squeezy checkout configuration.
 *
 * Two plans: Monthly ($19/mo) and Annual ($69/yr — $5.75/mo).
 * Both include a 7-day free trial (card required).
 * Checkout URLs point to Lemon Squeezy hosted pages.
 */

export interface Plan {
  id: 'monthly' | 'annual'
  name: string
  price: number          // dollars
  period: 'month' | 'year'
  pricePerMonth: number  // effective $/mo for display
  checkoutUrl: string
  badge?: string
  trialDays: number
}

/** Lemon Squeezy checkout URLs — replace with real variant URLs before launch. */
export const CHECKOUT_URLS = {
  monthly: 'https://morphiclabs.lemonsqueezy.com/checkout/buy/9010f980-603c-4d95-8454-9bd2aa947586',
  annual: 'https://morphiclabs.lemonsqueezy.com/checkout/buy/54be9e9c-84af-41d2-af28-9275b08ebe17',
} as const

export const FREE_TRIAL_DAYS = 7

export const PLANS: Record<'monthly' | 'annual', Plan> = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    price: 19,
    period: 'month',
    pricePerMonth: 19,
    checkoutUrl: CHECKOUT_URLS.monthly,
    trialDays: FREE_TRIAL_DAYS,
  },
  annual: {
    id: 'annual',
    name: 'Annual',
    price: 69,
    period: 'year',
    pricePerMonth: 5.75,
    checkoutUrl: CHECKOUT_URLS.annual,
    badge: 'Save 70%',
    trialDays: FREE_TRIAL_DAYS,
  },
} as const

/** Unified feature list — what subscribers get. */
export const FEATURES = [
  'All 23 research-backed frequencies',
  'Unlimited session time',
  'Immersive fullscreen experiences',
  'AI frequency recommendations',
  'Configurable breathing guides',
  '25-day structured protocols',
  'Progress tracking & streaks',
  'Dark & light theme',
] as const

/**
 * Build a parameterised Lemon Squeezy checkout URL.
 *
 * Appends `checkout[custom][user_id]`, `checkout[email]`, and
 * trial period parameters so the webhook can link the subscription
 * back to the authenticated user with proper trial setup.
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
