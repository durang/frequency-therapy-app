'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { getProtocolBySlug } from '@/lib/protocols'
import { frequencies } from '@/lib/frequencies'
import { useAuth } from '@/lib/authState'

export default function ProtocolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [protocol, setProtocol] = useState<ReturnType<typeof getProtocolBySlug>>(undefined)

  useEffect(() => {
    const slug = params.slug as string
    const found = getProtocolBySlug(slug)
    if (found) setProtocol(found)
    else router.push('/protocols')
  }, [params.slug, router])

  if (!protocol) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  const getFreqName = (id: string) => frequencies.find(f => f.id === id)?.name || 'Unknown'
  const getFreqHz = (id: string) => frequencies.find(f => f.id === id)?.hz_value || 0

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf9]/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/50 dark:border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/protocols" className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            All Protocols
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Link href="/dashboard" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link>
            ) : (
              <Link href="/auth/login" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{protocol.icon}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/30">{protocol.duration_days} days</span>
                <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                  protocol.difficulty === 'beginner' ? 'border-emerald-100 dark:border-emerald-400/20 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10' :
                  'border-amber-100 dark:border-amber-400/20 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10'
                }`}>{protocol.difficulty}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              {protocol.name}
            </h1>
            <p className="text-gray-500 dark:text-white/35 text-lg leading-relaxed max-w-2xl">{protocol.description}</p>
          </div>

          {/* For */}
          <div className="p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] mb-8">
            <p className="text-[10px] text-gray-400 dark:text-white/25 uppercase tracking-wider mb-2">Best for</p>
            <p className="text-sm text-gray-700 dark:text-white/50">{protocol.condition}</p>
          </div>

          {/* Science */}
          <div className="p-5 rounded-2xl border border-cyan-100 dark:border-cyan-500/10 bg-cyan-50 dark:bg-cyan-500/[0.03] mb-8">
            <p className="text-[10px] text-cyan-700 dark:text-cyan-400/60 uppercase tracking-wider mb-2">The science</p>
            <p className="text-sm text-cyan-800 dark:text-cyan-300/40 leading-relaxed mb-4">{protocol.science}</p>
            <details className="text-xs">
              <summary className="text-cyan-600 dark:text-cyan-400/50 cursor-pointer hover:underline">View citations ({protocol.citations.length})</summary>
              <div className="mt-3 space-y-1.5 text-cyan-700 dark:text-cyan-400/30">
                {protocol.citations.map((c, i) => (
                  <p key={i} className="text-[11px] italic">{c}</p>
                ))}
              </div>
            </details>
          </div>

          {/* Phases */}
          <div className="mb-12">
            <h2 className="text-xl font-light mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              The {protocol.duration_days}-Day Program
            </h2>

            <div className="space-y-6">
              {protocol.phases.map((phase, pi) => (
                <div key={pi} className="p-6 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white/70">Phase {pi + 1}: {phase.name}</p>
                      <p className="text-xs text-gray-400 dark:text-white/25">Days {phase.days}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-xs font-medium text-gray-500 dark:text-white/30">{pi + 1}</div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-white/35 mb-5">{phase.description}</p>

                  <div className="space-y-3">
                    {phase.sessions.map((session, si) => {
                      const freqName = getFreqName(session.frequencyId)
                      const freqHz = getFreqHz(session.frequencyId)
                      return (
                        <div key={si} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.03]">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-400/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400 tabular-nums">{freqHz}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900 dark:text-white/70">{freqName}</span>
                              <span className="text-[10px] text-gray-400 dark:text-white/20">{session.duration} min · {session.timeOfDay}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-white/30">{session.notes}</p>
                            <Link href={`/experience/${session.frequencyId}`} className="inline-flex items-center gap-1 mt-2 text-[10px] text-cyan-600 dark:text-cyan-400/60 hover:underline">
                              Start this session →
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expected outcomes */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02]">
              <p className="text-[10px] text-gray-400 dark:text-white/25 uppercase tracking-wider mb-3">Expected outcomes</p>
              <div className="space-y-2">
                {protocol.expectedOutcomes.map(o => (
                  <div key={o} className="flex items-start gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500 mt-0.5 flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="text-xs text-gray-600 dark:text-white/35">{o}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {/* Tips */}
              <div className="p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] mb-6">
                <p className="text-[10px] text-gray-400 dark:text-white/25 uppercase tracking-wider mb-3">Tips for success</p>
                <div className="space-y-2">
                  {protocol.tips.map(t => (
                    <div key={t} className="flex items-start gap-2">
                      <span className="text-cyan-500 text-xs mt-0.5">💡</span>
                      <span className="text-xs text-gray-600 dark:text-white/35">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contraindications */}
              <div className="p-5 rounded-2xl border border-amber-100 dark:border-amber-400/10 bg-amber-50 dark:bg-amber-400/[0.03]">
                <p className="text-[10px] text-amber-700 dark:text-amber-400/60 uppercase tracking-wider mb-3">⚠ Contraindications</p>
                <div className="space-y-1.5">
                  {protocol.contraindications.map(c => (
                    <p key={c} className="text-xs text-amber-700 dark:text-amber-400/40">{c}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-8 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02]">
            <h3 className="text-xl font-light mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Ready to start?</h3>
            <p className="text-sm text-gray-500 dark:text-white/30 mb-6">Begin Phase 1 with your first frequency session</p>
            <Link
              href={`/experience/${protocol.phases[0].sessions[0].frequencyId}`}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-all"
            >
              Start Day 1
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {/* Medical disclaimer */}
          <p className="text-[10px] text-gray-400 dark:text-white/10 text-center mt-8 leading-relaxed max-w-xl mx-auto">
            This protocol is for wellness purposes only. It does not diagnose, treat, cure, or prevent any disease.
            Consult a qualified healthcare provider before starting. Do not discontinue prescribed medications without medical supervision.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
