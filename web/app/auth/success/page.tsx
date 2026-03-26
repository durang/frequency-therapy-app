'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'

export default function AuthSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking')
  const [message, setMessage] = useState('Verifying authentication...')
  
  // Get any error from redirect
  const error = searchParams.get('error')
  const errorMessage = searchParams.get('message')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (error) {
          setStatus('error')
          setMessage(errorMessage || 'Authentication failed')
          setTimeout(() => router.push('/auth/login'), 3000)
          return
        }

        // Check if we have an active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Session check error:', sessionError)
          setStatus('error')
          setMessage('Failed to verify authentication. Please try again.')
          setTimeout(() => router.push('/auth/login'), 3000)
          return
        }

        if (session) {
          console.log('✅ Authentication successful for user:', session.user.email)
          setStatus('success')
          setMessage('Authentication successful! Redirecting to dashboard...')
          
          // Redirect to dashboard after successful auth
          setTimeout(() => router.push('/dashboard'), 2000)
        } else {
          setStatus('error')
          setMessage('No active session found. Please try signing in again.')
          setTimeout(() => router.push('/auth/login'), 3000)
        }
      } catch (error) {
        console.error('Auth verification error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
        setTimeout(() => router.push('/auth/login'), 3000)
      }
    }

    checkAuth()
  }, [router, error, errorMessage])

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
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
            {status === 'checking' && 'Authenticating...'}
            {status === 'success' && 'Welcome back!'}
            {status === 'error' && 'Authentication Error'}
          </h1>
          
          <p className={`text-sm ${getStatusColor()}`}>
            {message}
          </p>
          
          {(status === 'checking' || status === 'success') && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-quantum-600"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}