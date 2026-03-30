'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PLANS } from '@/lib/checkout'

// Bridge: T02 will rewrite this page; keep shape compatible for now
const subscriptionPlans = Object.values(PLANS).map((p) => ({
  id: p.id as string,
  name: p.name,
  description: p.id === 'monthly' ? 'Flexible month-to-month' : 'Best value — save 47%',
  price_monthly: p.id === 'monthly' ? p.price : p.pricePerMonth,
  price_yearly: p.id === 'annual' ? p.price : p.price * 12,
  features: [] as string[],
  popular: p.id === 'annual',
}))
import { Check, Star, Zap, Crown } from 'lucide-react'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const planIcons = {
    basic: Star,
    pro: Zap,
    clinical: Crown
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-quantum-50 to-neural-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-gradient">
                🎵 FreqTherapy
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="quantum" size="sm">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Choose Your <span className="text-gradient">Quantum Level</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Start with research-backed frequencies for free, then unlock 
              advanced personalization and clinical-grade features.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <div className="bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    billingPeriod === 'monthly'
                      ? 'bg-white text-slate-900 shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    billingPeriod === 'yearly'
                      ? 'bg-white text-slate-900 shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Yearly
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Free Tier */}
          <div className="mb-12">
            <Card className="max-w-2xl mx-auto p-6 border-2 border-dashed border-slate-300">
              <div className="text-center">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold mb-2">Free Forever</h3>
                <p className="text-slate-600 mb-6">
                  Experience the power of frequency therapy with our core healing frequencies
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="text-left">
                    <h4 className="font-semibold mb-2">Included Frequencies:</h4>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>🧬 DNA Repair (528 Hz)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>😴 Deep Sleep (7.83 Hz)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="text-left">
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>10-minute sessions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Basic visual patterns</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Screen-off capability</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Link href="/auth/register">
                  <Button variant="outline" size="lg">
                    Start Free Today
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Paid Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => {
              const Icon = planIcons[plan.id as keyof typeof planIcons] || Star
              const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly / 12
              const yearlyDiscount = billingPeriod === 'yearly' ? Math.round((1 - (plan.price_yearly / 12) / plan.price_monthly) * 100) : 0

              return (
                <Card 
                  key={plan.id}
                  variant={plan.popular ? 'quantum' : 'default'}
                  glow={plan.popular}
                  className={`relative p-6 ${plan.popular ? 'ring-2 ring-quantum-400 transform scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-quantum-500 to-neural-500 text-white px-6 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-quantum-100 to-neural-100 rounded-2xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-quantum-600" />
                    </div>
                    
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold">${price.toFixed(0)}</span>
                        <span className="text-slate-600 ml-1">/month</span>
                      </div>
                      
                      {billingPeriod === 'yearly' && yearlyDiscount > 0 && (
                        <div className="mt-2">
                          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                            Save {yearlyDiscount}% yearly
                          </span>
                        </div>
                      )}
                      
                      {billingPeriod === 'yearly' && (
                        <p className="text-sm text-slate-500 mt-2">
                          Billed ${plan.price_yearly} annually
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/auth/register" className="w-full">
                      <Button 
                        variant={plan.popular ? 'quantum' : 'primary'} 
                        size="lg" 
                        className="w-full"
                      >
                        {plan.id === 'basic' ? 'Start Basic Plan' : 
                         plan.id === 'pro' ? 'Upgrade to Pro' : 
                         'Get Clinical Access'}
                      </Button>
                    </Link>

                    <p className="text-xs text-slate-500 text-center mt-3">
                      7-day free trial • Cancel anytime
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Enterprise */}
          <div className="mt-16">
            <Card variant="neural" className="p-8 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-2xl font-bold mb-4">Enterprise Solutions</h3>
                <p className="text-slate-600 mb-6">
                  Custom frequency therapy solutions for healthcare providers, wellness centers, 
                  and corporate wellness programs. White-label options available.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <h4 className="font-semibold mb-2">Healthcare Providers</h4>
                    <p className="text-sm text-slate-600">
                      Clinical-grade tools for therapists and practitioners
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Corporate Wellness</h4>
                    <p className="text-sm text-slate-600">
                      Employee stress reduction and productivity programs
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Research Institutions</h4>
                    <p className="text-sm text-slate-600">
                      Custom protocols and data collection capabilities
                    </p>
                  </div>
                </div>

                <Button variant="quantum" size="lg">
                  Contact Enterprise Sales
                </Button>
              </div>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="p-6">
                <h3 className="font-semibold mb-3">What makes this different from other apps?</h3>
                <p className="text-sm text-slate-600">
                  We use scientifically-researched frequencies with AI personalization 
                  and biometric integration. Unlike meditation apps, we focus on 
                  measurable physiological effects.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-3">Can I cancel my subscription anytime?</h3>
                <p className="text-sm text-slate-600">
                  Yes, you can cancel anytime. Your subscription will remain active 
                  until the end of your billing period, then automatically downgrade to free.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-3">Do you offer a money-back guarantee?</h3>
                <p className="text-sm text-slate-600">
                  We offer a 7-day free trial and 30-day money-back guarantee. 
                  If you're not satisfied, contact support for a full refund.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-3">How does biometric integration work?</h3>
                <p className="text-sm text-slate-600">
                  Connect your Apple Watch, Oura Ring, or other devices to track 
                  HRV, stress levels, and sleep quality to optimize your frequency protocols.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}