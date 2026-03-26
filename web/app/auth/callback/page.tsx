'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback from Supabase
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setMessage('Authentication failed. Please try again.')
          setTimeout(() => router.push('/auth/login'), 3000)
          return
        }

        if (data.session) {
          console.log('✅ Authentication successful')
          setStatus('success')
          setMessage('Authentication successful! Redirecting to dashboard...')
          
          // Redirect to dashboard after successful auth
          setTimeout(() => router.push('/dashboard'), 2000)
        } else {
          setStatus('error')
          setMessage('No session found. Please try signing in again.')
          setTimeout(() => router.push('/auth/login'), 3000)
        }
      } catch (error) {
        console.error('Unexpected auth callback error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
        setTimeout(() => router.push('/auth/login'), 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return '⏳'
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      default:
        return '⏳'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-quantum-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-quantum-50 to-neural-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <CardContent className="space-y-6">
          <div className="text-6xl mb-4">{getStatusIcon()}</div>
          
          <h1 className="text-2xl font-bold text-slate-900">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Welcome back!'}
            {status === 'error' && 'Authentication Error'}
          </h1>
          
          <p className={`text-sm ${getStatusColor()}`}>
            {message}
          </p>
          
          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-quantum-600"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-quantum-50 to-neural-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <CardContent className="space-y-6">
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-slate-900">Loading...</h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-quantum-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}