'use client'

import { useAuth } from '@/lib/authState'
import { useSubscription } from '@/lib/useSubscription'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { frequencies } from '@/lib/frequencies'

export default function PanelPage() {
  const { user, initializing, isSuperadmin } = useAuth()
  const { isActive, isLoading } = useSubscription()
  const router = useRouter()
  const [isBypass, setIsBypass] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setIsBypass(params.get('demo') === 'true' || params.get('superadmin') === 'true')
    }
  }, [])

  const hasAccess = (!!user && isActive) || isBypass || isSuperadmin

  // Redirects
  useEffect(() => {
    if (!initializing && !user && !isBypass) router.push('/auth/login?from=panel')
  }, [user, initializing, router, isBypass])

  useEffect(() => {
    if (!initializing && !isLoading && user && !isActive && !isBypass && !isSuperadmin) router.push('/pricing?from=panel')
  }, [user, initializing, isLoading, isActive, router, isBypass, isSuperadmin])

  if ((initializing || isLoading) && !isBypass) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-gray-400 dark:text-white/30">Redirecting...</p>
      </div>
    )
  }

  // Group frequencies by category
  const byCategory: Record<string, typeof frequencies> = {}
  for (const f of frequencies) {
    const cat = f.category
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(f)
  }

  const categoryLabels: Record<string, string> = {
    dna_repair: 'DNA Repair', anxiety_relief: 'Anxiety Relief', cognitive_enhancement: 'Focus & Cognition',
    sleep_optimization: 'Sleep', grounding: 'Grounding', pain_management: 'Pain Relief',
    cardiovascular: 'Heart', neurotransmitter_optimization: 'Neurotransmitters', mood_enhancement: 'Mood',
    relaxation: 'Relaxation', neural_repair: 'Neural', anti_aging: 'Anti-Aging',
    immune_enhancement: 'Immune', hormonal_balance: 'Hormones', cellular_energy: 'Energy',
    regenerative_medicine: 'Regenerative', vascular_health: 'Vascular', epigenetic_therapy: 'Epigenetic',
    quantum_medicine: 'Quantum', metabolic_enhancement: 'Metabolic',
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      {/* Admin banner */}
      {isSuperadmin && (
        <div className="bg-amber-50 dark:bg-amber-400/5 border-b border-amber-200 dark:border-amber-400/10 text-center py-2 px-4 text-xs text-amber-700 dark:text-amber-400">
          🔑 Superadmin — All frequencies unlocked, clinical tier access
        </div>
      )}
      {isBypass && !isSuperadmin && (
        <div className="bg-cyan-50 dark:bg-cyan-400/5 border-b border-cyan-200 dark:border-cyan-400/10 text-center py-2 px-4 text-xs text-cyan-700 dark:text-cyan-400">
          🧪 Demo Mode — Full access without authentication
        </div>
      )}

      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf9]/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/50 dark:border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight">FreqTherapy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link>
            <ThemeToggle />
            {user && <span className="text-xs text-gray-400 dark:text-white/20">{user.email}</span>}
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-3 font-medium">All Frequencies</p>
        <h1 className="text-3xl md:text-4xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Frequency Panel
        </h1>
        <p className="text-sm text-gray-500 dark:text-white/35 mt-2">
          {frequencies.length} frequencies · Select any to start an immersive session
        </p>
      </div>

      {/* Frequencies by category */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {Object.entries(byCategory).map(([cat, freqs]) => (
          <div key={cat} className="mb-10">
            <h2 className="text-sm font-medium text-gray-700 dark:text-white/50 uppercase tracking-wider mb-4">
              {categoryLabels[cat] || cat}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {freqs.map(freq => (
                <Link
                  key={freq.id}
                  href={`/experience/${freq.id}`}
                  className="group p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08] transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 dark:text-white/25 tabular-nums">{freq.hz_value} Hz</span>
                    <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                      freq.tier === 'free' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border-emerald-100 dark:border-emerald-400/20' :
                      freq.tier === 'clinical' ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-400/10 border-rose-100 dark:border-rose-400/20' :
                      'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-100 dark:border-amber-400/20'
                    }`}>
                      {freq.tier === 'free' ? 'Free' : freq.tier === 'clinical' ? 'Clinical' : 'Premium'}
                    </span>
                  </div>
                  <h3 className="text-base font-light text-gray-900 dark:text-white/80 group-hover:text-gray-700 dark:group-hover:text-white mb-1"
                      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                    {freq.name}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-white/25 line-clamp-1">{freq.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
