'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { PLANS, FEATURES, CHECKOUT_URLS, FREE_TRIAL_DAYS } from '@/lib/checkout'
import { useAuth } from '@/lib/authState'

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')
  const { user } = useAuth()

  const plan = PLANS[billing]

  const handleCheckout = (planId: 'monthly' | 'annual') => {
    const url = CHECKOUT_URLS[planId]
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
              <Link href="/dashboard" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link>
            ) : (
              <Link href="/auth/login" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-400/10 border border-cyan-100 dark:border-cyan-400/20 text-cyan-700 dark:text-cyan-400 text-xs font-medium mb-6">
            ✦ {FREE_TRIAL_DAYS}-day free trial · No charge until day {FREE_TRIAL_DAYS + 1}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Try everything free<br className="hidden sm:block" /> for {FREE_TRIAL_DAYS} days
          </h1>
          <p className="text-gray-500 dark:text-white/35 text-base sm:text-lg max-w-lg mx-auto">
            Full access to all 23 frequencies, protocols, and AI recommendations.
            Cancel anytime before day {FREE_TRIAL_DAYS + 1} — you won&apos;t be charged.
          </p>
        </motion.div>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center mb-10 sm:mb-12 px-6">
        <div className="inline-flex items-center bg-gray-100 dark:bg-white/[0.04] rounded-full p-1 border border-gray-200 dark:border-white/[0.06]">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-4 sm:px-5 py-2 rounded-full text-sm transition-all ${
              billing === 'monthly'
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm font-medium'
                : 'text-gray-500 dark:text-white/30'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`px-4 sm:px-5 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
              billing === 'annual'
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm font-medium'
                : 'text-gray-500 dark:text-white/30'
            }`}
          >
            Annual
            <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 font-medium">
              {plan.badge || 'Save 70%'}
            </span>
          </button>
        </div>
      </div>

      {/* Plan card */}
      <div className="max-w-xl mx-auto px-6 mb-16 sm:mb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={billing}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] relative"
          >
            {billing === 'annual' && (
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-cyan-500 text-white text-[10px] tracking-wider uppercase font-medium">
                Best value
              </div>
            )}

            {/* Trial callout */}
            <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-400/[0.06] border border-cyan-100 dark:border-cyan-400/15">
              <span className="text-lg">🎁</span>
              <div>
                <p className="text-sm font-medium text-cyan-700 dark:text-cyan-400">
                  First {FREE_TRIAL_DAYS} days free
                </p>
                <p className="text-[11px] text-cyan-600/60 dark:text-cyan-400/40">
                  You won&apos;t be charged today. Cancel anytime during the trial.
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-2 mb-1">
              <span className="text-4xl sm:text-5xl font-light tabular-nums" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                ${billing === 'monthly' ? '19' : '5.75'}
              </span>
              <span className="text-gray-400 dark:text-white/25 text-base mb-1.5">/month</span>
            </div>
            {billing === 'annual' ? (
              <p className="text-xs text-gray-400 dark:text-white/20 mb-6">
                $69/year · saves $159 vs monthly
              </p>
            ) : (
              <p className="text-xs text-gray-400 dark:text-white/20 mb-6">
                Billed monthly · Cancel anytime
              </p>
            )}

            {/* CTA */}
            <button
              onClick={() => handleCheckout(billing)}
              className="w-full py-3.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-all mb-2"
            >
              Start {FREE_TRIAL_DAYS}-Day Free Trial
            </button>
            <p className="text-[10px] text-gray-400 dark:text-white/15 text-center mb-8">
              No charge until {new Date(Date.now() + FREE_TRIAL_DAYS * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {' · '}Cancel anytime
            </p>

            {/* Features */}
            <div className="space-y-3">
              {FEATURES.map(f => (
                <div key={f} className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-white/40">{f}</span>
                </div>
              ))}
            </div>

            {/* Guarantee */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/[0.04] text-center">
              <p className="text-xs text-gray-400 dark:text-white/20">
                🛡️ 30-day money-back guarantee after trial · No questions asked
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Social proof */}
      <div className="max-w-xl mx-auto px-6 mb-16 text-center">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400 dark:text-white/20">
          <span>23 frequencies</span>
          <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-white/10" />
          <span>6 protocols</span>
          <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-white/10" />
          <span>Peer-reviewed research</span>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto px-6 pb-20 sm:pb-24">
        <h2 className="text-2xl font-light text-center mb-10 sm:mb-12" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Questions
        </h2>
        <div className="space-y-6">
          {[
            { q: 'What happens during the free trial?', a: `You get full access to all 23 frequencies, unlimited session time, AI recommendations, breathing guides, and all 6 protocols for ${FREE_TRIAL_DAYS} days. No features are restricted. Your card is charged only on day ${FREE_TRIAL_DAYS + 1} if you choose to continue.` },
            { q: 'Can I cancel during the trial?', a: 'Yes. Cancel anytime before your trial ends and you won\'t be charged a single cent. No cancellation fees, no hidden charges.' },
            { q: 'What payment methods do you accept?', a: 'All major credit/debit cards, Apple Pay, and Google Pay through our secure payment partner Lemon Squeezy.' },
            { q: 'Can I cancel my subscription?', a: 'Anytime. Cancel from your dashboard or the subscription portal. Your access continues until the end of your billing period.' },
            { q: 'Is there a money-back guarantee?', a: 'Yes. If you\'re not satisfied within 30 days after your trial ends, contact us for a full refund. No questions asked.' },
            { q: 'Is FreqTherapy a medical device?', a: 'No. FreqTherapy is a wellness tool for relaxation, focus, and general wellbeing. It is not FDA-approved and does not diagnose, treat, or cure any condition. Always consult your healthcare provider.' },
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
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-sm text-gray-400 dark:text-white/20 hover:text-gray-900 dark:hover:text-white transition-colors">
            ← Back to home
          </Link>
          <p className="text-xs text-gray-400 dark:text-white/15">
            © 2026 FreqTherapy. Not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </footer>
    </div>
  )
}
