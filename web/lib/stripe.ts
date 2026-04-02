import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS = {
  basic: {
    name: 'Quantum Basic',
    price: 19.99,
    stripePriceId: 'price_basic', // Replace with actual Stripe price ID
    features: [
      '3 core frequency categories',
      'Sessions up to 30 minutes',
      'Basic visualizations',
      'Sleep tracking integration',
    ],
  },
  pro: {
    name: 'Quantum Pro',
    price: 39.99,
    stripePriceId: 'price_pro', // Replace with actual Stripe price ID
    features: [
      'All 6 frequency categories',
      'Unlimited session length',
      'Advanced visualizations',
      'HRV integration',
      'Custom frequency protocols',
    ],
  },
  clinical: {
    name: 'Quantum Clinical',
    price: 79.99,
    stripePriceId: 'price_clinical', // Replace with actual Stripe price ID
    features: [
      'Everything in Pro',
      'Clinical-grade protocols',
      'Biomarker tracking',
      'Professional dashboard',
      'Research-grade analytics',
    ],
  },
} as const

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS