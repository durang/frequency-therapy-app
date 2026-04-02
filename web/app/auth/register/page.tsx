'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { signUp } from '@/lib/supabase'
import toast from 'react-hot-toast'

const COUNTRIES = [
  'Mexico', 'USA', 'Canada', 'Spain', 'Colombia', 'Argentina', 'Brazil',
  'UK', 'Germany', 'France', 'India', 'Japan', 'Australia', 'Chile',
  'Peru', 'Ecuador', 'Italy', 'Portugal', 'Netherlands', 'Other'
]

const GOALS = [
  'Better sleep', 'Reduce anxiety', 'Improve focus',
  'Pain relief', 'More energy', 'General wellness', 'Other'
]

const SOURCES = [
  'Google search', 'Social media', 'Friend referral',
  'Podcast', 'YouTube', 'TikTok', 'Other'
]

const inputClass = 'w-full px-4 py-3 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/15 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm'
const labelClass = 'block text-xs text-gray-500 dark:text-white/30 uppercase tracking-wider mb-2'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [country, setCountry] = useState('')
  const [goal, setGoal] = useState('')
  const [source, setSource] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const metadata: Record<string, string> = {
        first_name: firstName,
        country,
        primary_goal: goal,
      }
      if (dateOfBirth) metadata.date_of_birth = dateOfBirth
      if (source) metadata.referral_source = source

      const { error } = await signUp(email, password, metadata)
      if (error) toast.error(error.message || 'Failed to create account')
      else { setSuccess(true); toast.success('Account created! Check your email to confirm.') }
    } catch { toast.error('An unexpected error occurred') }
    finally { setLoading(false) }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
          <div className="text-5xl mb-6">✅</div>
          <h1 className="text-2xl font-light mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Account created
          </h1>
          <p className="text-sm text-gray-500 dark:text-white/35 mb-8">
            Check <strong className="text-gray-700 dark:text-white/60">{email}</strong> to confirm, then sign in.
          </p>
          <Link href="/auth/login" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">
            Go to Sign In →
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center px-6 py-24">
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
            Create account
          </h1>
          <p className="text-sm text-gray-500 dark:text-white/35">
            Start your frequency therapy journey
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              minLength={8}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>First name</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Your first name"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Birthday (optional)</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={e => setDateOfBirth(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              required
              className={inputClass + ' appearance-none'}
            >
              <option value="">Select your country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Primary goal</label>
            <select
              value={goal}
              onChange={e => setGoal(e.target.value)}
              required
              className={inputClass + ' appearance-none'}
            >
              <option value="">What brings you here?</option>
              {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>How did you hear about us?</label>
            <select
              value={source}
              onChange={e => setSource(e.target.value)}
              className={inputClass + ' appearance-none'}
            >
              <option value="">Select (optional)</option>
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-gray-400 dark:text-white/20 text-center mt-8">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-cyan-600 dark:text-cyan-400 hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-xs text-gray-400 dark:text-white/15 text-center mt-6">
          By creating an account you agree that this is not a medical device.
        </p>
      </motion.div>
    </div>
  )
}
