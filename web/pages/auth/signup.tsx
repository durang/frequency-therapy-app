import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedTier, setSelectedTier] = useState<'basic' | 'pro' | 'clinical'>('basic')
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            subscription_tier: selectedTier,
          },
        },
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Check your email for the confirmation link!')
        // Redirect to a success page or show success message
        setTimeout(() => {
          router.push('/auth/confirm')
        }, 2000)
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const pricingTiers = [
    {
      id: 'basic' as const,
      name: 'Quantum Basic',
      price: '$19.99',
      features: [
        '3 core frequency categories',
        'Sessions up to 30 minutes',
        'Basic visualizations',
        'Sleep tracking integration',
        'Email support'
      ],
      popular: false
    },
    {
      id: 'pro' as const,
      name: 'Quantum Pro',
      price: '$39.99',
      features: [
        'All 6 frequency categories',
        'Unlimited session length',
        'Advanced visualizations',
        'HRV integration',
        'Custom frequency protocols',
        'Progress analytics',
        'Priority support'
      ],
      popular: true
    },
    {
      id: 'clinical' as const,
      name: 'Quantum Clinical',
      price: '$79.99',
      features: [
        'Everything in Pro',
        'Clinical-grade protocols',
        'Biomarker tracking',
        'Professional dashboard',
        'Research-grade analytics',
        'White-label options',
        'Direct practitioner support'
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-8">
            <span>← Back to Home</span>
          </Link>
          <h2 className="text-3xl font-bold text-white">
            Start Your Frequency Journey
          </h2>
          <p className="mt-2 text-slate-400">
            Choose your plan and begin healing with quantum frequencies
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`category-card relative cursor-pointer transition-all ${
                selectedTier === tier.id 
                  ? 'border-quantum-500 bg-quantum-900/20 scale-105' 
                  : 'hover:scale-102'
              }`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-quantum-500 to-frequency-500 text-white text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-white mb-1">
                  {tier.price}
                  <span className="text-sm text-slate-400 font-normal">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-slate-300">
                    <span className="text-healing-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <div className={`w-4 h-4 rounded-full border-2 mx-auto ${
                  selectedTier === tier.id 
                    ? 'bg-quantum-500 border-quantum-500' 
                    : 'border-slate-600'
                }`}>
                  {selectedTier === tier.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sign Up Form */}
        <div className="max-w-md mx-auto">
          <div className="category-card">
            <form className="space-y-6" onSubmit={handleSignUp}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-quantum-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-quantum-500 focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>

              {message && (
                <div className={`text-sm p-3 rounded-lg ${
                  message.includes('Check your email') 
                    ? 'bg-green-900/50 text-green-300 border border-green-800' 
                    : 'bg-red-900/50 text-red-300 border border-red-800'
                }`}>
                  {message}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="frequency-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : `Start Free Trial - ${pricingTiers.find(t => t.id === selectedTier)?.name}`}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-quantum-400 hover:text-quantum-300">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Trial Info */}
          <div className="mt-6 text-center text-xs text-slate-400">
            <p>
              🎁 7-day free trial • Cancel anytime • No setup fees
            </p>
            <p className="mt-1">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}