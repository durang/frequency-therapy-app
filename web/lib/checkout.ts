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
  monthly: 'https://freqtherapy.lemonsqueezy.com/checkout/buy/monthly',
  annual: 'https://freqtherapy.lemonsqueezy.com/checkout/buy/annual',
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
