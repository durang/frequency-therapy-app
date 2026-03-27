'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { signInWithMagicLink, signIn } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [usePassword, setUsePassword] = useState(false)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await signInWithMagicLink(email)

      if (error) {
        toast.error(error.message || 'Failed to send magic link')
      } else {
        setMagicLinkSent(true)
        toast.success('Magic link sent! Check your email.')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await signIn(email, password)

      if (error) {
        toast.error(error.message || 'Failed to sign in')
      } else if (data?.user) {
        toast.success('Welcome back!')
        // Redirect handled by auth state change
        window.location.href = '/panel'
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-quantum-50 to-neural-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="text-3xl font-bold text-gradient mb-2">
                🎵 FreqTherapy
              </div>
            </Link>
          </div>

          <Card className="p-6 text-center">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Check Your Email</h1>
            <p className="text-slate-600 mb-6">
              We've sent a magic link to <strong>{email}</strong>. 
              Click the link in your email to sign in.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setMagicLinkSent(false)
                setEmail('')
              }}
              className="w-full"
            >
              Try Different Email
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-quantum-50 to-neural-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-3xl font-bold text-gradient mb-2">
              🎵 FreqTherapy
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-600">
            Sign in to continue your frequency therapy journey
          </p>
        </div>

        <Card className="p-6">
          <CardHeader className="p-0 mb-6">
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setUsePassword(false)}
                className={`flex-1 text-sm font-medium rounded-md py-2 px-3 transition-colors ${
                  !usePassword 
                    ? 'bg-white text-quantum-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Magic Link
              </button>
              <button
                type="button"
                onClick={() => setUsePassword(true)}
                className={`flex-1 text-sm font-medium rounded-md py-2 px-3 transition-colors ${
                  usePassword 
                    ? 'bg-white text-quantum-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Password
              </button>
            </div>
          </CardHeader>

          {!usePassword ? (
            <form onSubmit={handleMagicLink} className="space-y-6">
              <Input
                type="email"
                label="Email address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="quantum"
                size="lg"
                loading={loading}
                className="w-full"
              >
                Send Magic Link
              </Button>

              <p className="text-xs text-center text-slate-500">
                We'll send you a secure link to sign in instantly
              </p>
            </form>
          ) : (
            <form onSubmit={handlePasswordLogin} className="space-y-6">
              <Input
                type="email"
                label="Email address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-quantum-600 focus:ring-quantum-500" />
                  <span className="ml-2 text-sm text-slate-600">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-quantum-600 hover:text-quantum-500">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="quantum"
                size="lg"
                loading={loading}
                className="w-full"
              >
                Sign In
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-quantum-600 hover:text-quantum-500 font-medium">
              Sign up for free
            </Link>
          </p>
        </Card>

        {/* Demo Access */}
        <Card variant="quantum" className="mt-6 p-4 text-center">
          <p className="text-sm mb-3">Want to try without signing up?</p>
          <Link href="/panel?demo=true">
            <Button variant="outline" size="sm" className="w-full">
              🎧 Try Demo Session
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}