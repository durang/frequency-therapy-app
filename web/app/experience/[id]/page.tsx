'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { frequencies } from '@/lib/frequencies'
import { useSubscription } from '@/lib/useSubscription'
import ImmersiveExperience from '@/components/immersive/ImmersiveExperience'

// Free-tier frequency IDs (Anxiety Liberation 432Hz, Gamma Focus 40Hz)
const FREE_FREQUENCY_IDS = ['2', '3']

export default function ExperiencePage() {
  const params = useParams()
  const router = useRouter()
  const { isActive: isSubscribed, isLoading } = useSubscription()
  const [frequency, setFrequency] = useState<typeof frequencies[0] | null>(null)

  useEffect(() => {
    const id = params.id as string
    const found = frequencies.find(f => f.id === id)
    if (found) {
      setFrequency(found)
    } else {
      router.push('/frequencies')
    }
  }, [params.id, router])

  // Check if URL has bypass params
  const [isBypass, setIsBypass] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      setIsBypass(urlParams.get('demo') === 'true' || urlParams.get('superadmin') === 'true')
    }
  }, [])

  if (!frequency || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  // Determine if user is free (not subscribed and not bypassing)
  const isFreeUser = !isSubscribed && !isBypass

  // If free user tries to access a non-free frequency, redirect to pricing
  if (isFreeUser && !FREE_FREQUENCY_IDS.includes(frequency.id)) {
    router.push('/pricing?from=experience')
    return null
  }

  return (
    <ImmersiveExperience
      frequency={frequency}
      onExit={() => router.push('/frequencies')}
      isFreeUser={isFreeUser}
    />
  )
}
