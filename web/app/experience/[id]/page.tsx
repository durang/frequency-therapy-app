'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { frequencies } from '@/lib/frequencies'
import { useSubscription } from '@/lib/useSubscription'
import { useAuth } from '@/lib/authState'
import ImmersiveExperience from '@/components/immersive/ImmersiveExperience'

export default function ExperiencePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isSuperadmin } = useAuth()
  const { isActive: isSubscribed, isLoading } = useSubscription()
  const [frequency, setFrequency] = useState<typeof frequencies[0] | null>(null)

  // Check demo mode synchronously from URL on every render (no useEffect delay)
  const isDemoMode = useMemo(() => {
    if (typeof window === 'undefined') return false
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('demo') === 'true'
  }, [])

  useEffect(() => {
    const id = params.id as string
    const found = frequencies.find(f => f.id === id)
    if (found) {
      setFrequency(found)
    } else {
      router.push('/frequencies')
    }
  }, [params.id, router])

  if (!frequency || isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  // Admin and subscribers get full access
  const hasFullAccess = isSubscribed || isDemoMode || isSuperadmin
  const isFreeUser = !hasFullAccess

  // If free user tries to access a non-free frequency, redirect
  if (isFreeUser && frequency.tier !== 'free') {
    // Use useEffect for redirect to avoid React warnings
    return <RedirectToPricing />
  }

  return (
    <ImmersiveExperience
      frequency={frequency}
      onExit={() => router.push('/frequencies')}
      isFreeUser={isFreeUser}
    />
  )
}

// Separate component to handle redirect cleanly
function RedirectToPricing() {
  const router = useRouter()
  useEffect(() => {
    router.push('/pricing?from=experience')
  }, [router])
  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center">
      <p className="text-gray-400 dark:text-white/30 text-sm">This frequency requires a subscription. Redirecting...</p>
    </div>
  )
}
