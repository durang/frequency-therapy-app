'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/authState'
import { useSubscription } from '@/lib/useSubscription'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { frequencies } from '@/lib/frequencies'
import { Frequency } from '@/types'

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

  const [selectedFreq, setSelectedFreq] = useState<Frequency | null>(null)

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

      {/* Frequencies by category + detail panel */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex gap-6">
          <div className="flex-1">
            {Object.entries(byCategory).map(([cat, freqs]) => (
              <div key={cat} className="mb-10">
                <h2 className="text-sm font-medium text-gray-700 dark:text-white/50 uppercase tracking-wider mb-4">
                  {categoryLabels[cat] || cat}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {freqs.map(freq => {
                    const isSelected = selectedFreq?.id === freq.id
                    return (
                      <button
                        key={freq.id}
                        onClick={() => setSelectedFreq(isSelected ? null : freq)}
                        className={`group text-left p-5 rounded-2xl border transition-all duration-300 ${
                          isSelected
                            ? 'border-cyan-500/30 dark:border-cyan-500/20 bg-cyan-50 dark:bg-cyan-500/[0.04] ring-1 ring-cyan-500/20'
                            : 'border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08]'
                        }`}
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
                        <h3 className="text-base font-light text-gray-900 dark:text-white/80 mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{freq.name}</h3>
                        <p className="text-xs text-gray-400 dark:text-white/25 line-clamp-1">{freq.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {selectedFreq && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block w-[380px] flex-shrink-0 sticky top-24 h-fit p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]"
              >
                <button onClick={() => setSelectedFreq(null)} className="absolute top-4 right-4 text-gray-300 dark:text-white/15 hover:text-gray-500 dark:hover:text-white/40 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
                <span className="text-xs text-gray-400 dark:text-white/25 tabular-nums">{selectedFreq.hz_value} Hz</span>
                <h2 className="text-2xl font-light mt-2 mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{selectedFreq.name}</h2>
                <p className="text-sm text-gray-600 dark:text-white/40 leading-relaxed mb-6">{selectedFreq.description}</p>
                {selectedFreq.benefits?.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs text-gray-400 dark:text-white/25 uppercase tracking-wider mb-3">Benefits</p>
                    <div className="space-y-2">
                      {selectedFreq.benefits.slice(0, 4).map((b: string) => (
                        <div key={b} className="flex items-start gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500 mt-0.5 flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                          <span className="text-xs text-gray-600 dark:text-white/35">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedFreq.mechanism && (
                  <div className="mb-6">
                    <p className="text-xs text-gray-400 dark:text-white/25 uppercase tracking-wider mb-2">How It Works</p>
                    <p className="text-xs text-gray-500 dark:text-white/30 leading-relaxed">{selectedFreq.mechanism}</p>
                  </div>
                )}
                {selectedFreq.dosage && (
                  <div className="mb-8">
                    <p className="text-xs text-gray-400 dark:text-white/25 uppercase tracking-wider mb-2">Recommended Use</p>
                    <p className="text-xs text-gray-500 dark:text-white/30 leading-relaxed">{selectedFreq.dosage}</p>
                  </div>
                )}
                <Link href={`/experience/${selectedFreq.id}`} className="block w-full text-center py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-all">
                  Start Session
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
