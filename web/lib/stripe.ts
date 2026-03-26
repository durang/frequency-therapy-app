import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

export { getStripe }

export const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Quantum Basic',
    description: 'Perfect for daily frequency therapy',
    price_monthly: 19.99,
    price_yearly: 199.99,
    stripe_price_id_monthly: 'price_basic_monthly',
    stripe_price_id_yearly: 'price_basic_yearly',
    features: [
      'All research-backed frequencies',
      'Unlimited session time',
      'Basic progress tracking',
      'Visual therapy patterns',
      'Screen-off capability',
      'Apple Health integration'
    ],
    frequency_limit: null,
    session_duration_limit: null,
    popular: false
  },
  {
    id: 'pro',
    name: 'Quantum Pro',
    description: 'Advanced personalization and tracking',
    price_monthly: 39.99,
    price_yearly: 399.99,
    stripe_price_id_monthly: 'price_pro_monthly',
    stripe_price_id_yearly: 'price_pro_yearly',
    features: [
      'Everything in Basic',
      'AI Personal Frequency Profiling',
      'Advanced progress analytics',
      'Biometric integration (HRV)',
      'Custom frequency protocols',
      'Priority support',
      'Export data capabilities'
    ],
    frequency_limit: null,
    session_duration_limit: null,
    popular: true
  },
  {
    id: 'clinical',
    name: 'Quantum Clinical',
    description: 'Professional tools for practitioners',
    price_monthly: 79.99,
    price_yearly: 799.99,
    stripe_price_id_monthly: 'price_clinical_monthly',
    stripe_price_id_yearly: 'price_clinical_yearly',
    features: [
      'Everything in Pro',
      'Client management tools',
      'Professional certification access',
      'Research data access',
      'White-label options',
      'API access',
      'Priority phone support'
    ],
    frequency_limit: null,
    session_duration_limit: null,
    popular: false
  }
]

export const createCheckoutSession = async (
  priceId: string,
  customerId?: string,
  successUrl?: string,
  cancelUrl?: string
) => {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      customerId,
      successUrl: successUrl || `${window.location.origin}/dashboard?success=true`,
      cancelUrl: cancelUrl || `${window.location.origin}/pricing?canceled=true`,
    }),
  })

  const session = await response.json()
  return session
}

export const createPortalSession = async (customerId: string) => {
  const response = await fetch('/api/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId,
      returnUrl: `${window.location.origin}/dashboard`,
    }),
  })

  const session = await response.json()
  return session
}