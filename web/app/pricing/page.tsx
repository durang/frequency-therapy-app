'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { PLANS, FEATURES, CHECKOUT_URLS } from '@/lib/checkout'
import { useAuth } from '@/lib/authState'

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')
  const { user } = useAuth()

  const handleCheckout = (plan: 'monthly' | 'annual') => {
    const url = CHECKOUT_URLS[plan]
    // Add user context if authenticated
    const checkoutUrl = user
      ? `${url}?checkout[custom][user_id]=${user.id}&checkout[email]=${user.email}`
      : url

    if (typeof window !== 'undefined' && (window as any).LemonSqueezy?.Url?.Open) {
      (window as any).LemonSqueezy.Url.Open(checkoutUrl)
    } else {
      window.open(checkoutUrl, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf9]/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/50 dark:border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight">FreqTherapy</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Link href="/dashboard" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/login" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Simple, honest pricing
          </h1>
          <p className="text-gray-500 dark:text-white/35 text-lg max-w-md mx-auto">
            One plan, full access. Monthly flexibility or save 47% with annual.
          </p>
        </motion.div>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center bg-gray-100 dark:bg-white/[0.04] rounded-full p-1 border border-gray-200 dark:border-white/[0.06]">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-5 py-2 rounded-full text-sm transition-all ${
              billing === 'monthly'
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm font-medium'
                : 'text-gray-500 dark:text-white/30'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`px-5 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
              billing === 'annual'
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm font-medium'
                : 'text-gray-500 dark:text-white/30'
            }`}
          >
            Annual
            <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 font-medium">
              Save 47%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="max-w-xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="p-8 rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] relative"
        >
          {billing === 'annual' && (
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-cyan-500 text-white text-[10px] tracking-wider uppercase font-medium">
              Best value
            </div>
          )}

          <div className="flex items-end gap-2 mb-1">
            <span className="text-5xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              ${billing === 'monthly' ? '19' : '10'}
            </span>
            <span className="text-gray-400 dark:text-white/25 text-base mb-2">/month</span>
          </div>
          {billing === 'annual' && (
            <p className="text-xs text-gray-400 dark:text-white/20 mb-6">
              $120/year · saves $108 vs monthly
            </p>
          )}
          {billing === 'monthly' && (
            <p className="text-xs text-gray-400 dark:text-white/20 mb-6">
              Billed monthly · Cancel anytime
            </p>
          )}

          <button
            onClick={() => handleCheckout(billing)}
            className="w-full py-3.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-all mb-8"
          >
            Get Started
          </button>

          {/* Features */}
          <div className="space-y-3">
            {[
              'All 20 therapeutic frequencies',
              'Unlimited session length',
              'Configurable breathing guides',
              'Immersive fullscreen experience',
              'Scientific teleprompter narratives',
              'Priority new frequency access',
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500 flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-white/40">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-light text-center mb-12" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Questions
        </h2>
        <div className="space-y-6">
          {[
            { q: 'Can I try for free?', a: 'Yes. 2 frequencies are available free with 5-minute sessions. No account needed.' },
            { q: 'What payment methods?', a: 'All major cards, Apple Pay, Google Pay via our payment partner Lemon Squeezy.' },
            { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your dashboard or the subscription portal. No lock-in.' },
            { q: 'Is this a medical device?', a: 'No. FreqTherapy is a wellness tool. It is not FDA-approved and does not diagnose, treat, or cure any condition. Always consult your doctor.' },
          ].map(faq => (
            <div key={faq.q} className="pb-6 border-b border-gray-100 dark:border-white/[0.04]">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white/70 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-500 dark:text-white/30 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-white/[0.04] py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 dark:text-white/20 hover:text-gray-900 dark:hover:text-white transition-colors">
            ← Back to home
          </Link>
          <p className="text-xs text-gray-400 dark:text-white/15">
            © 2024 FreqTherapy
          </p>
        </div>
      </footer>
    </div>
  )
}
