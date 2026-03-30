'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { PLANS, FEATURES } from '@/lib/checkout' // lemonsqueezy plan config
import { Check } from 'lucide-react'

const FAQ_ITEMS = [
  {
    q: 'What makes FreqTherapy different from other apps?',
    a: 'We combine research-backed frequencies with DJ-style multi-frequency mixing, spatial audio, and AI-powered recommendations. Unlike meditation apps, we focus on measurable physiological effects through precise frequency delivery.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, cancel anytime from your Lemon Squeezy account. Your access continues until the end of your billing period — no questions asked.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes — every plan includes a 7-day free trial. You won\'t be charged until the trial ends, and you can cancel before then at no cost.',
  },
  {
    q: 'What\'s included in both plans?',
    a: 'Monthly and Annual plans include the exact same features — all frequencies, unlimited sessions, spatial audio, AI recommendations, and more. The Annual plan simply saves you 47%.',
  },
] as const

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  const activePlan = PLANS[billing]
  const otherPlan = billing === 'monthly' ? PLANS.annual : PLANS.monthly

  return (
    <div className="min-h-screen bg-[var(--surface-primary)]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[var(--surface-overlay)] backdrop-blur-md border-b border-[var(--border-default)] z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-[var(--text-primary)]">
                🎵 FreqTherapy
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/auth/login"
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Simple, honest pricing
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              One plan, full access. Choose monthly flexibility or save 47% with annual billing.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 p-1">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  billing === 'monthly'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('annual')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  billing === 'annual'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Annual
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-semibold">
                  Save 47%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-20">
            {/* Monthly Card */}
            <PlanCard
              plan={PLANS.monthly}
              isActive={billing === 'monthly'}
              onSelect={() => setBilling('monthly')}
            />

            {/* Annual Card */}
            <PlanCard
              plan={PLANS.annual}
              isActive={billing === 'annual'}
              onSelect={() => setBilling('annual')}
            />
          </div>

          {/* Feature List */}
          <div className="max-w-2xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
              Everything included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {FAQ_ITEMS.map((item) => (
                <div
                  key={item.q}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {item.q}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              7-day free trial · Cancel anytime · 30-day money-back guarantee
            </p>
            <a
              href={activePlan.checkoutUrl}
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[var(--accent-primary)] text-white font-medium text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              Start your free trial
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

/* ─── Plan Card ─── */

interface PlanCardProps {
  plan: typeof PLANS.monthly
  isActive: boolean
  onSelect: () => void
}

function PlanCard({ plan, isActive, onSelect }: PlanCardProps) {
  const isAnnual = plan.id === 'annual'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect() }}
      className={`relative rounded-2xl border-2 p-8 transition-all cursor-pointer ${
        isActive
          ? 'border-[var(--accent-primary)] bg-white dark:bg-slate-800 shadow-xl ring-1 ring-[var(--accent-primary)]/20'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      {/* Badge */}
      {isAnnual && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-400">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Plan Name */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {plan.name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isAnnual ? 'Billed annually' : 'Billed monthly'}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-slate-900 dark:text-white">
            ${plan.pricePerMonth}
          </span>
          <span className="text-slate-500 dark:text-slate-400">/mo</span>
        </div>
        {isAnnual && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            ${plan.price}/year · saves ${PLANS.monthly.price * 12 - plan.price}/yr
          </p>
        )}
      </div>

      {/* CTA */}
      <a
        href={plan.checkoutUrl}
        onClick={(e) => e.stopPropagation()}
        className={`block w-full text-center py-3 rounded-lg font-medium transition-all ${
          isActive
            ? 'bg-[var(--accent-primary)] text-white hover:opacity-90 shadow-md'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
        }`}
      >
        Start free trial
      </a>
    </div>
  )
}
