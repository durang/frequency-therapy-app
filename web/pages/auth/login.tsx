import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
      } else {
        router.push('/')
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-8">
            <span>← Back to Home</span>
          </Link>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-slate-400">
            Sign in to continue your frequency therapy journey
          </p>
        </div>

        <div className="category-card">
          <form className="space-y-6" onSubmit={handleLogin}>
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-quantum-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {message && (
              <div className="text-sm text-red-300 bg-red-900/50 border border-red-800 p-3 rounded-lg">
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="frequency-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-slate-400">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-quantum-400 hover:text-quantum-300">
                  Start free trial
                </Link>
              </p>
              <p className="text-sm">
                <Link href="/auth/reset" className="text-slate-400 hover:text-white">
                  Forgot your password?
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Quick Demo Access */}
        <div className="category-card">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Try Before You Sign Up
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Experience our frequencies with 2-minute demos (no account required)
            </p>
            <Link href="/" className="text-quantum-400 hover:text-quantum-300 text-sm">
              Browse Frequency Categories →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}