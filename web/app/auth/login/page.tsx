'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { signInWithMagicLink } from '@/lib/supabase'
import { useAuthStore } from '@/lib/authState'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [usePassword, setUsePassword] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await signInWithMagicLink(email)
      if (error) toast.error(error.message || 'Failed to send magic link')
      else { setMagicLinkSent(true); toast.success('Magic link sent! Check your email.') }
    } catch { toast.error('An unexpected error occurred') }
    finally { setLoading(false) }
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await useAuthStore.getState().signInWithPassword(email, password)
      if (error) toast.error(error.message || 'Failed to sign in')
      else if (data?.user) {
        toast.success('Welcome back!')
        window.location.href = '/frequencies'
      }
    } catch { toast.error('An unexpected error occurred') }
    finally { setLoading(false) }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
          <div className="text-5xl mb-6">📧</div>
          <h1 className="text-2xl font-light mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Check your email
          </h1>
          <p className="text-sm text-gray-500 dark:text-white/35 mb-8">
            We sent a magic link to <strong className="text-gray-700 dark:text-white/60">{email}</strong>
          </p>
          <button
            onClick={() => { setMagicLinkSent(false); setEmail('') }}
            className="text-sm text-gray-500 dark:text-white/30 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Try different email
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center px-6">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">FreqTherapy</span>
        </Link>
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 dark:text-white/35">
            Sign in to continue your therapy
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 dark:bg-white/[0.04] rounded-lg p-1 mb-8 border border-gray-200 dark:border-white/[0.06]">
          <button
            onClick={() => setUsePassword(false)}
            className={`flex-1 text-sm py-2 rounded-md transition-all ${
              !usePassword
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm font-medium'
                : 'text-gray-500 dark:text-white/30'
            }`}
          >
            Magic Link
          </button>
          <button
            onClick={() => setUsePassword(true)}
            className={`flex-1 text-sm py-2 rounded-md transition-all ${
              usePassword
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm font-medium'
                : 'text-gray-500 dark:text-white/30'
            }`}
          >
            Password
          </button>
        </div>

        {!usePassword ? (
          <form onSubmit={handleMagicLink} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-500 dark:text-white/30 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/15 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
            <p className="text-xs text-gray-400 dark:text-white/20 text-center">
              We'll send a secure link to sign in instantly
            </p>
          </form>
        ) : (
          <form onSubmit={handlePasswordLogin} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-500 dark:text-white/30 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/15 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-white/30 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/15 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        <p className="text-sm text-gray-400 dark:text-white/20 text-center mt-8">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-cyan-600 dark:text-cyan-400 hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
