'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { getProtocolBySlug } from '@/lib/protocols'
import { getProgress, startProtocol, logSession, ProtocolProgress } from '@/lib/protocolProgress'
import { frequencies } from '@/lib/frequencies'
import { useAuth } from '@/lib/authState'

export default function ProtocolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [protocol, setProtocol] = useState<ReturnType<typeof getProtocolBySlug>>(undefined)
  const [progress, setProgress] = useState<ProtocolProgress | null>(null)

  useEffect(() => {
    const slug = params.slug as string
    const found = getProtocolBySlug(slug)
    if (found) {
      setProtocol(found)
      setProgress(getProgress(found.id))
    } else {
      router.push('/protocols')
    }
  }, [params.slug, router])

  const handleStartProtocol = () => {
    if (!protocol) return
    const p = startProtocol(protocol.id)
    setProgress(p)
    // Navigate to first session immediately
    const firstSession = protocol.phases[0]?.sessions[0]
    if (firstSession) {
      handleStartSession(0, 0, firstSession.frequencyId, firstSession.duration)
    }
  }

  const handleStartSession = (phaseIndex: number, sessionIndex: number, freqId: string, duration: number) => {
    if (!protocol) return
    
    // Ensure protocol is started
    let currentProgress = progress
    if (!currentProgress) {
      currentProgress = startProtocol(protocol.id)
      setProgress(currentProgress)
    }
    
    // Store pending session in sessionStorage — will be logged when user returns
    const freqName = frequencies.find(f => f.id === freqId)?.name || 'Unknown'
    sessionStorage.setItem('pending-session', JSON.stringify({
      protocolId: protocol.id,
      day: currentProgress.currentDay || 1,
      phase: phaseIndex,
      sessionIndex,
      frequencyId: freqId,
      frequencyName: freqName,
      duration,
    }))
    
    // Navigate to experience
    router.push(`/experience/${freqId}`)
  }

  // Log pending session when user returns from experience
  useEffect(() => {
    const pending = sessionStorage.getItem('pending-session')
    if (pending && protocol) {
      try {
        const session = JSON.parse(pending)
        if (session.protocolId === protocol.id) {
          const p = logSession(protocol.id, session)
          setProgress(p)
          sessionStorage.removeItem('pending-session')
        }
      } catch {}
    }
  }, [protocol])

  if (!protocol) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  const getFreqName = (id: string) => frequencies.find(f => f.id === id)?.name || 'Unknown'
  const getFreqHz = (id: string) => frequencies.find(f => f.id === id)?.hz_value || 0
  const isStarted = !!progress
  const currentPhase = progress?.currentPhase || 0
  const currentDay = progress?.currentDay || 0

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
          <div className="mb-8">
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

          {/* Progress card — if started */}
          {isStarted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl border border-cyan-200 dark:border-cyan-500/20 bg-gradient-to-r from-cyan-50 to-teal-50/50 dark:from-cyan-500/[0.04] dark:to-teal-500/[0.02] mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-cyan-700 dark:text-cyan-400">
                    {progress?.completed ? '🎉 Protocol Complete!' : `Day ${currentDay} of ${protocol.duration_days}`}
                  </p>
                  <p className="text-xs text-cyan-600/60 dark:text-cyan-400/40 mt-0.5">
                    {progress?.completed
                      ? `${progress.completedSessions.length} sessions · ${progress.totalMinutes} min total`
                      : `Phase ${currentPhase + 1}: ${protocol.phases[currentPhase]?.name || ''}`
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {(progress?.streak || 0) > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-400/20">
                      🔥 {progress?.streak} day streak
                    </span>
                  )}
                </div>
              </div>
              {/* Progress bar with day markers */}
              <div className="relative w-full h-2.5 bg-cyan-100 dark:bg-cyan-400/10 rounded-full mb-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((currentDay / protocol.duration_days) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-400 dark:to-teal-400 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-cyan-600/40 dark:text-cyan-400/25">
                <span>Day 1</span>
                <span>Day {Math.ceil(protocol.duration_days / 2)}</span>
                <span>Day {protocol.duration_days}</span>
              </div>
            </motion.div>
          )}

          {/* ─── Today's Session CTA ─── */}
          {isStarted && !progress?.completed && (() => {
            const phase = protocol.phases[currentPhase]
            if (!phase) return null
            const todayStr = new Date().toDateString()
            const nextSessionIdx = phase.sessions.findIndex((s, si) =>
              !progress?.completedSessions.some(
                cs => cs.phase === currentPhase && cs.sessionIndex === si && new Date(cs.completedAt).toDateString() === todayStr
              )
            )
            if (nextSessionIdx < 0) return null // All done for today
            const nextSession = phase.sessions[nextSessionIdx]
            const freqName = getFreqName(nextSession.frequencyId)
            const freqHz = getFreqHz(nextSession.frequencyId)

            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <div className="relative p-6 sm:p-8 rounded-2xl overflow-hidden">
                  {/* Dark immersive background */}
                  <div className="absolute inset-0 bg-gray-900 dark:bg-[#0e0e18]" />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/5" />
                  <div className="relative flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-mono tabular-nums font-medium">{freqHz}<span className="text-[8px] ml-0.5 opacity-60">Hz</span></span>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-[10px] tracking-[0.25em] uppercase text-cyan-400/60 mb-1">Today&apos;s Session</p>
                      <p className="text-lg font-light text-white/90 mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                        {freqName}
                      </p>
                      <p className="text-xs text-white/30">
                        {nextSession.duration} min · {nextSession.timeOfDay} · Phase {currentPhase + 1}
                      </p>
                    </div>
                    <button
                      onClick={() => handleStartSession(currentPhase, nextSessionIdx, nextSession.frequencyId, nextSession.duration)}
                      className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-900 font-medium text-sm hover:bg-gray-100 transition-all shadow-lg shadow-white/10 flex-shrink-0"
                    >
                      Begin Session
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })()}

          {/* All sessions done for today */}
          {isStarted && !progress?.completed && (() => {
            const phase = protocol.phases[currentPhase]
            if (!phase) return null
            const todayStr = new Date().toDateString()
            const allDoneToday = phase.sessions.every((s, si) =>
              progress?.completedSessions.some(
                cs => cs.phase === currentPhase && cs.sessionIndex === si && new Date(cs.completedAt).toDateString() === todayStr
              )
            )
            if (!allDoneToday) return null

            return (
              <div className="mb-8 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/[0.03] text-center">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">All sessions complete for today!</p>
                <p className="text-xs text-emerald-600/60 dark:text-emerald-400/40">Come back tomorrow for Day {Math.min(currentDay + 1, protocol.duration_days)}. Rest well.</p>
              </div>
            )
          })()}

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
              {protocol.phases.map((phase, pi) => {
                const isCurrentPhase = isStarted && pi === currentPhase
                const isPastPhase = isStarted && pi < currentPhase
                const isFuturePhase = isStarted && pi > currentPhase

                return (
                  <div key={pi} className={`p-6 rounded-2xl border transition-all ${
                    isCurrentPhase ? 'border-cyan-300 dark:border-cyan-500/30 bg-white dark:bg-cyan-500/[0.02] ring-1 ring-cyan-200 dark:ring-cyan-500/10' :
                    isPastPhase ? 'border-emerald-200 dark:border-emerald-500/10 bg-emerald-50/50 dark:bg-emerald-500/[0.02]' :
                    'border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02]'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white/70">Phase {pi + 1}: {phase.name}</p>
                          {isPastPhase && <span className="text-emerald-500 text-xs">✓</span>}
                          {isCurrentPhase && <span className="text-[10px] px-2 py-0.5 bg-cyan-100 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-400 rounded-full">Current</span>}
                        </div>
                        <p className="text-xs text-gray-400 dark:text-white/25">Days {phase.days}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        isPastPhase ? 'bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400' :
                        isCurrentPhase ? 'bg-cyan-100 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-400' :
                        'bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-white/30'
                      }`}>{pi + 1}</div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-white/35 mb-5">{phase.description}</p>

                    <div className="space-y-3">
                      {phase.sessions.map((session, si) => {
                        const freqName = getFreqName(session.frequencyId)
                        const freqHz = getFreqHz(session.frequencyId)
                        // Check if this specific session was completed today
                        const todayStr = new Date().toDateString()
                        const completedToday = progress?.completedSessions.some(
                          s => s.phase === pi && s.sessionIndex === si && new Date(s.completedAt).toDateString() === todayStr
                        )

                        return (
                          <div key={si} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                            completedToday ? 'bg-emerald-50 dark:bg-emerald-500/[0.03] border-emerald-200 dark:border-emerald-500/10' :
                            'bg-gray-50 dark:bg-white/[0.02] border-gray-100 dark:border-white/[0.03]'
                          }`}>
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-400/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400 tabular-nums">{freqHz}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900 dark:text-white/70">{freqName}</span>
                                <span className="text-[10px] text-gray-400 dark:text-white/20">{session.duration} min · {session.timeOfDay}</span>
                                {completedToday && <span className="text-emerald-500 text-xs">✓ Done today</span>}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-white/30">{session.notes}</p>
                              <button
                                onClick={() => handleStartSession(pi, si, session.frequencyId, session.duration)}
                                className={`inline-flex items-center gap-1 mt-2 text-xs font-medium transition-colors ${
                                  completedToday 
                                    ? 'text-emerald-600 dark:text-emerald-400/60 hover:text-emerald-700'
                                    : 'text-cyan-600 dark:text-cyan-400/60 hover:text-cyan-700 dark:hover:text-cyan-300'
                                }`}
                              >
                                {completedToday ? 'Repeat session →' : 'Start this session →'}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
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
          <div className="text-center">
            {!isStarted ? (
              <div className="relative p-10 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gray-900 dark:bg-[#0e0e18]" />
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-teal-500/5" />
                <div className="relative">
                  <p className="text-xs tracking-[0.3em] uppercase text-cyan-400/60 mb-4">Ready?</p>
                  <h3 className="text-2xl md:text-3xl font-light text-white mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                    Start your {protocol.duration_days}-day journey
                  </h3>
                  <p className="text-sm text-white/30 mb-8 max-w-md mx-auto">
                    Phase 1 begins today. Put on your headphones, find a quiet space, and let the frequencies guide you.
                  </p>
                  <button
                    onClick={handleStartProtocol}
                    className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-white text-gray-900 font-medium text-base hover:bg-gray-100 transition-all shadow-lg shadow-white/10"
                  >
                    Begin Day 1
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                  <p className="text-[10px] text-white/15 mt-4">Headphones recommended · {protocol.phases[0]?.sessions[0]?.duration || 20} min first session</p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02]">
                <h3 className="text-lg font-light mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {progress?.completed ? '🎉 Protocol Complete!' : `Day ${currentDay} — Keep going`}
                </h3>
                <p className="text-xs text-gray-500 dark:text-white/30 mb-4">
                  {progress?.completed
                    ? `${progress.completedSessions.length} sessions · ${progress.totalMinutes} min total`
                    : `${progress?.completedSessions.length || 0} sessions done · Phase ${currentPhase + 1}`
                  }
                </p>
                <button
                  onClick={() => {
                    const phase = protocol.phases[currentPhase]
                    if (phase) {
                      const todayStr = new Date().toDateString()
                      const nextSessionIdx = phase.sessions.findIndex((s, si) => 
                        !progress?.completedSessions.some(
                          cs => cs.phase === currentPhase && cs.sessionIndex === si && new Date(cs.completedAt).toDateString() === todayStr
                        )
                      )
                      const idx = nextSessionIdx >= 0 ? nextSessionIdx : 0
                      const session = phase.sessions[idx]
                      if (session) handleStartSession(currentPhase, idx, session.frequencyId, session.duration)
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:bg-gray-700 dark:hover:bg-gray-100 transition-all"
                >
                  {progress?.completed ? 'Start Again' : 'Continue Protocol'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </div>

          {/* Session history */}
          {isStarted && (progress?.completedSessions.length || 0) > 0 && (
            <div className="mt-8 p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02]">
              <p className="text-[10px] text-gray-400 dark:text-white/25 uppercase tracking-wider mb-4">Session History</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {[...(progress?.completedSessions || [])].reverse().map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/[0.03] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center text-[10px] text-gray-500 dark:text-white/30 tabular-nums">
                        D{s.day}
                      </div>
                      <div>
                        <p className="text-xs text-gray-700 dark:text-white/50">{s.frequencyName}</p>
                        <p className="text-[10px] text-gray-400 dark:text-white/20">{s.duration} min · Phase {s.phase + 1}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-white/15">
                      {new Date(s.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
