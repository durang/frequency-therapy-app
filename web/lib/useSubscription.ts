'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Subscription } from '@/types'

interface UseSubscriptionResult {
  subscription: Subscription | null
  isActive: boolean
  isLoading: boolean
  error: Error | null
}

/**
 * React hook that queries the current user's most recent subscription
 * from the Supabase `subscriptions` table.
 *
 * - Returns `isActive: true` only when the subscription status is `'active'`
 * - Refetches automatically when the auth state changes (sign-in / sign-out)
 * - Cleans up the auth listener on unmount
 */
export function useSubscription(): UseSubscriptionResult {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSubscription = useCallback(async (isRefetch = false) => {
    // Only show loading state on initial fetch, not on refetches (e.g. tab-focus token refresh)
    // Refetch-triggered loading would unmount the immersive experience
    if (!isRefetch) {
      setIsLoading(true)
    }
    setError(null)

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        throw new Error(`Auth error: ${authError.message}`)
      }

      if (!user) {
        // No authenticated user — clear subscription state
        setSubscription(null)
        setIsLoading(false)
        return
      }

      const { data, error: queryError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (queryError) {
        // PGRST116 = row not found — not an error, just no subscription
        if (queryError.code === 'PGRST116') {
          setSubscription(null)
        } else {
          throw new Error(`Query error: ${queryError.message}`)
        }
      } else {
        setSubscription(data as Subscription)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setSubscription(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial fetch
    fetchSubscription()

    // Re-fetch when auth state changes (sign-in, sign-out) but NOT on token refresh
    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event) => {
      // Token refresh happens on tab-focus — skip it to avoid resetting active experiences
      if (event === 'TOKEN_REFRESHED') return
      fetchSubscription(true)
    })

    return () => {
      authListener.unsubscribe()
    }
  }, [fetchSubscription])

  // Admin with clinical tier from auth store bypasses subscription check
  const isActive = subscription?.status === 'active'

  return { subscription, isActive, isLoading, error }
}
