'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/lib/authState'
import { useSubscription } from '@/lib/useSubscription'

export default function DashboardPage() {
  const { user, initializing, isSuperadmin } = useAuth()
  const { subscription, isActive, isLoading } = useSubscription()
  const router = useRouter()

  useEffect(() => {
    if (!initializing && !user) {
      router.push('/auth/login?from=dashboard')
    }
  }, [user, initializing, router])

  if (initializing || isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf9]/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/50 dark:border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight">FreqTherapy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/frequencies" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">
              Frequencies
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="mb-12">
            <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-3 font-medium">Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/35 mt-2">{user.email}</p>
            {isSuperadmin && (
              <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-[10px] tracking-wider uppercase bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-400/20">
                🔑 Superadmin
              </span>
            )}
          </div>

          {/* Subscription status */}
          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]">
              <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-3">Subscription</p>
              {isActive || isSuperadmin ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Active</span>
                  </div>
                  {subscription?.current_period_end && (
                    <p className="text-xs text-gray-400 dark:text-white/20">
                      Renews {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  )}
                  {isSuperadmin && !subscription && (
                    <p className="text-xs text-amber-600 dark:text-amber-400/60">Superadmin bypass</p>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-white/15" />
                    <span className="text-sm text-gray-500 dark:text-white/40">Free plan</span>
                  </div>
                  <Link href="/pricing" className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline">
                    Upgrade for unlimited access →
                  </Link>
                </>
              )}
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]">
              <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-3">Access</p>
              <p className="text-2xl font-light mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                {isActive || isSuperadmin ? '20' : '2'}
              </p>
              <p className="text-xs text-gray-400 dark:text-white/20">
                {isActive || isSuperadmin ? 'All frequencies unlocked' : 'Free frequencies available'}
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mb-12">
            <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-4">Quick Actions</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link href="/frequencies" className="group p-5 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/[0.1] transition-all">
                <div className="text-2xl mb-3">🎵</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white/80 group-hover:text-gray-700 dark:group-hover:text-white">Browse Frequencies</p>
                <p className="text-xs text-gray-400 dark:text-white/20 mt-1">Start an immersive session</p>
              </Link>
              <Link href="/experience/2" className="group p-5 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/[0.1] transition-all">
                <div className="text-2xl mb-3">🧘</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white/80 group-hover:text-gray-700 dark:group-hover:text-white">Quick Session</p>
                <p className="text-xs text-gray-400 dark:text-white/20 mt-1">Anxiety Liberation · 432 Hz</p>
              </Link>
              {!isActive && !isSuperadmin && (
                <Link href="/pricing" className="group p-5 rounded-2xl border border-cyan-200 dark:border-cyan-500/20 bg-cyan-50 dark:bg-cyan-500/[0.04] hover:border-cyan-300 dark:hover:border-cyan-500/30 transition-all">
                  <div className="text-2xl mb-3">✨</div>
                  <p className="text-sm font-medium text-cyan-700 dark:text-cyan-400">Upgrade</p>
                  <p className="text-xs text-cyan-600/60 dark:text-cyan-400/40 mt-1">Unlock all 20 frequencies</p>
                </Link>
              )}
              {(isActive || isSuperadmin) && subscription?.customer_portal_url && (
                <a href={subscription.customer_portal_url} target="_blank" rel="noopener noreferrer" className="group p-5 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/[0.1] transition-all">
                  <div className="text-2xl mb-3">⚙️</div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white/80">Manage Subscription</p>
                  <p className="text-xs text-gray-400 dark:text-white/20 mt-1">Billing & plan details</p>
                </a>
              )}
            </div>
          </div>

          {/* Account info */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]">
            <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-4">Account</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-white/35">Email</span>
                <span className="text-sm text-gray-900 dark:text-white/70">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-white/35">Member since</span>
                <span className="text-sm text-gray-900 dark:text-white/70">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
