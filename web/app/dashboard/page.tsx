'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/lib/authState'
import { useSubscription } from '@/lib/useSubscription'
import { frequencies } from '@/lib/frequencies'
import { protocols } from '@/lib/protocols'
import { getAllProgress, ProtocolProgress } from '@/lib/protocolProgress'
import { useSessionHistory } from '@/lib/sessionHistory'
import { ProtocolTimeline } from '@/components/library/ProtocolTimeline'

export default function DashboardPage() {
  const { user, initializing, isSuperadmin, signOut } = useAuth()
  const { subscription, isActive, isLoading } = useSubscription()
  const router = useRouter()
  const [activeProtocols, setActiveProtocols] = useState<ProtocolProgress[]>([])
  const { getInsights, getRecentSessions } = useSessionHistory()
  const insights = getInsights()
  const recentSessions = getRecentSessions(5)

  useEffect(() => {
    if (!initializing && !user) router.push('/auth/login?from=dashboard')
  }, [user, initializing, router])

  // Load protocol progress
  useEffect(() => {
    setActiveProtocols(getAllProgress())
  }, [])

  if (initializing) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const freeCount = frequencies.filter(f => f.tier === 'free').length
  const totalCount = frequencies.length
  const hasAccess = isActive || isSuperadmin

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf9]/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/50 dark:border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight">FreqTherapy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/frequencies" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Frequencies</Link>
            <Link href="/protocols" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Protocols</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          {/* Header */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-2 font-medium">Dashboard</p>
              <h1 className="text-3xl md:text-4xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Welcome back
              </h1>
              <p className="text-sm text-gray-500 dark:text-white/35 mt-1">{user.email}</p>
              {isSuperadmin && (
                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-[10px] tracking-wider uppercase bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-400/20">
                  🔑 Admin
                </span>
              )}
            </div>
            <button
              onClick={() => { signOut(); router.push('/') }}
              className="text-xs text-gray-400 dark:text-white/20 hover:text-gray-700 dark:hover:text-white/50 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Active Protocols — most important section */}
          {activeProtocols.length > 0 && (
            <div className="mb-10">
              <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-4">Your Active Protocols</p>
              <div className="space-y-4">
                {activeProtocols.map(prog => {
                  const proto = protocols.find(p => p.id === prog.protocolId)
                  if (!proto) return null
                  const pct = Math.min((prog.currentDay / proto.duration_days) * 100, 100)
                  return (
                    <Link key={prog.protocolId} href={`/protocols/${proto.slug}`}
                      className="block p-5 rounded-2xl border border-cyan-200 dark:border-cyan-500/15 bg-cyan-50 dark:bg-cyan-500/[0.03] hover:border-cyan-300 dark:hover:border-cyan-500/25 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{proto.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white/70">{proto.name}</p>
                            <p className="text-xs text-gray-500 dark:text-white/30">
                              {prog.completed ? '✅ Completed' : `Day ${prog.currentDay} of ${proto.duration_days} · Phase ${prog.currentPhase + 1}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-light text-cyan-700 dark:text-cyan-400 tabular-nums">{Math.round(pct)}%</p>
                          <p className="text-[10px] text-gray-400 dark:text-white/20">🔥 {prog.streak} day streak</p>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-cyan-100 dark:bg-cyan-400/10 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 dark:bg-cyan-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400 dark:text-white/20">
                        <span>{prog.completedSessions.length} sessions · {prog.totalMinutes} min total</span>
                        <span className="text-cyan-600 dark:text-cyan-400/60">Continue →</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="p-4 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] text-center">
              <p className="text-2xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{hasAccess ? totalCount : freeCount}</p>
              <p className="text-[10px] text-gray-400 dark:text-white/20 mt-1">Frequencies</p>
            </div>
            <div className="p-4 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] text-center">
              <p className="text-2xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{activeProtocols.length}</p>
              <p className="text-[10px] text-gray-400 dark:text-white/20 mt-1">Protocols</p>
            </div>
            <div className="p-4 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] text-center">
              <p className="text-2xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                {Math.max(insights.totalMinutes, activeProtocols.reduce((sum, p) => sum + p.totalMinutes, 0))}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-white/20 mt-1">Minutes</p>
            </div>
            <div className="p-4 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] text-center">
              <p className="text-2xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                {Math.max(insights.streakDays, ...activeProtocols.map(p => p.streak), 0)}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-white/20 mt-1">
                {insights.streakDays > 0 ? '🔥 Streak' : 'Best Streak'}
              </p>
            </div>
          </div>

          {/* ─── SELLING FEATURE 1: Wellness Journey Visualization ─── */}
          {activeProtocols.length > 0 && (
            <div className="mb-10">
              <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-4">Your Healing Journey</p>
              {activeProtocols.map(prog => {
                const proto = protocols.find(p => p.id === prog.protocolId)
                if (!proto) return null
                return (
                  <div key={prog.protocolId} className="p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] mb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{proto.icon}</span>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white/70">{proto.name}</h3>
                        <p className="text-xs text-gray-400 dark:text-white/25">
                          {prog.completed ? '✅ Completed!' : `Day ${prog.currentDay} of ${proto.duration_days}`}
                        </p>
                      </div>
                    </div>
                    <ProtocolTimeline currentDay={prog.currentDay} />
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[10px] text-gray-400 dark:text-white/20">
                        <span>🔥 {prog.streak} day streak</span>
                        <span>{prog.completedSessions.length} sessions</span>
                        <span>{prog.totalMinutes} min total</span>
                      </div>
                      <Link href={`/protocols/${proto.slug}`}
                        className="text-xs text-cyan-600 dark:text-cyan-400/60 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors">
                        Continue →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ─── SELLING FEATURE 2: Personal Frequency Insights ──── */}
          {insights.totalSessions > 0 && (
            <div className="mb-10">
              <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-4">Your Frequency Insights</p>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Most Effective */}
                {insights.mostEffectiveFrequency && (
                  <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-500/15 bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-500/[0.04]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-400/10 flex items-center justify-center">
                        <span className="text-sm">✨</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400/60 uppercase tracking-wider">Your Best Frequency</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white/70">{insights.mostEffectiveFrequency.frequencyName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/30">
                      <span>{insights.mostEffectiveFrequency.frequencyHz} Hz</span>
                      <span>·</span>
                      <span>{insights.mostEffectiveFrequency.avgRating.toFixed(1)}⭐ avg</span>
                      <span>·</span>
                      <span>{insights.mostEffectiveFrequency.totalSessions} sessions</span>
                    </div>
                    {insights.mostEffectiveFrequency.helpedWith.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {insights.mostEffectiveFrequency.helpedWith.map(h => (
                          <span key={h} className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400/60">{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Improvement Areas */}
                {insights.improvementAreas.length > 0 && (
                  <div className="p-5 rounded-2xl border border-cyan-200 dark:border-cyan-500/15 bg-gradient-to-br from-cyan-50 to-transparent dark:from-cyan-500/[0.04]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-400/10 flex items-center justify-center">
                        <span className="text-sm">📊</span>
                      </div>
                      <p className="text-[10px] text-cyan-600 dark:text-cyan-400/60 uppercase tracking-wider">Your Focus Areas</p>
                    </div>
                    <div className="space-y-2">
                      {insights.improvementAreas.slice(0, 4).map(area => (
                        <div key={area.area} className="flex items-center justify-between">
                          <span className="text-xs text-gray-700 dark:text-white/50 capitalize">{area.area}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(area.avgRating / 5) * 100}%` }} />
                            </div>
                            <span className="text-[10px] text-gray-400 dark:text-white/20 tabular-nums w-8">{area.avgRating}⭐</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── SELLING FEATURE 3: AI-Powered Next Session ──────── */}
          <div className="mb-10 p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-gradient-to-br from-white to-cyan-50/30 dark:from-white/[0.02] dark:to-cyan-500/[0.02] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-100/50 to-transparent dark:from-cyan-400/5 rounded-bl-[80px]" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z" />
                  </svg>
                </div>
                <p className="text-xs text-cyan-600 dark:text-cyan-400/60 uppercase tracking-wider font-medium">AI Recommendation</p>
              </div>
              <h3 className="text-lg font-light text-gray-900 dark:text-white/80 mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'} — ready for your session?
              </h3>
              <p className="text-sm text-gray-500 dark:text-white/35 mb-4">
                {insights.totalSessions > 0
                  ? `Based on your ${insights.totalSessions} sessions, here's what I suggest for ${new Date().getHours() < 12 ? 'this morning' : new Date().getHours() < 17 ? 'this afternoon' : 'tonight'}.`
                  : 'Tell me how you feel and I\'ll find the perfect frequency for you.'}
              </p>
              <div className="flex items-center gap-3">
                <Link href="/frequencies"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z" />
                  </svg>
                  Ask AI
                </Link>
                <Link href="/frequencies"
                  className="text-xs text-gray-500 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/50 transition-colors">
                  Browse frequencies →
                </Link>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] mb-6">
            <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-3">Subscription</p>
            {hasAccess ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Active</span>
                  {subscription?.current_period_end && (
                    <span className="text-xs text-gray-400 dark:text-white/20">· Renews {new Date(subscription.current_period_end).toLocaleDateString()}</span>
                  )}
                  {isSuperadmin && !subscription && (
                    <span className="text-xs text-amber-600 dark:text-amber-400/60">· Admin access</span>
                  )}
                </div>
                {subscription?.customer_portal_url && (
                  <a href={subscription.customer_portal_url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 dark:text-cyan-400/60 hover:underline">
                    Manage →
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-white/15" />
                  <span className="text-sm text-gray-500 dark:text-white/40">Free plan · {freeCount} frequencies · 5 min sessions</span>
                </div>
                <Link href="/pricing" className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline">Upgrade →</Link>
              </div>
            )}
          </div>

          {/* Quick Sessions */}
          <div className="mb-10">
            <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-4">Quick Sessions</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: '2', name: 'Calm', hz: '432 Hz', icon: '😌', desc: 'Anxiety relief' },
                { id: '4', name: 'Sleep', hz: '1.5 Hz', icon: '🌙', desc: 'Deep delta' },
                { id: '3', name: 'Focus', hz: '40 Hz', icon: '🧠', desc: 'Gamma boost' },
                { id: '21', name: 'Heal', hz: '10K Hz', icon: '✨', desc: 'Universal' },
              ].map(q => (
                <Link key={q.id} href={`/experience/${q.id}`}
                  className="group p-4 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/[0.1] transition-all text-center">
                  <span className="text-xl block mb-1">{q.icon}</span>
                  <p className="text-xs font-medium text-gray-700 dark:text-white/60">{q.name}</p>
                  <p className="text-[10px] text-gray-400 dark:text-white/20">{q.hz} · {q.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mb-10">
            <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-4">Explore</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="/frequencies" className="group p-4 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/[0.1] transition-all text-center">
                <span className="text-xl block mb-2">🎵</span>
                <p className="text-xs font-medium text-gray-700 dark:text-white/60">All Frequencies</p>
              </Link>
              <Link href="/protocols" className="group p-4 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/[0.1] transition-all text-center">
                <span className="text-xl block mb-2">📋</span>
                <p className="text-xs font-medium text-gray-700 dark:text-white/60">Protocols</p>
              </Link>
              {!hasAccess && (
                <Link href="/pricing" className="group p-4 rounded-2xl border border-cyan-200 dark:border-cyan-500/20 bg-cyan-50 dark:bg-cyan-500/[0.04] hover:border-cyan-300 dark:hover:border-cyan-500/30 transition-all text-center">
                  <span className="text-xl block mb-2">✨</span>
                  <p className="text-xs font-medium text-cyan-700 dark:text-cyan-400">Upgrade</p>
                </Link>
              )}
              {isSuperadmin && (
                <Link href="/panel" className="group p-4 rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/[0.04] hover:border-amber-300 dark:hover:border-amber-500/30 transition-all text-center">
                  <span className="text-xl block mb-2">🔑</span>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Admin Panel</p>
                </Link>
              )}
            </div>
          </div>

          {/* Start a protocol if none active */}
          {activeProtocols.length === 0 && (
            <div className="p-8 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] text-center mb-10">
              <p className="text-3xl mb-4">🎯</p>
              <h3 className="text-lg font-light mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Start a Protocol</h3>
              <p className="text-sm text-gray-500 dark:text-white/30 mb-6 max-w-sm mx-auto">
                Choose a 25-day healing protocol designed for your specific condition.
              </p>
              <Link href="/protocols" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-all">
                Browse Protocols
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          )}

          {/* Account */}
          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]">
            <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-4">Account</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-white/35">Email</span>
                <span className="text-sm text-gray-900 dark:text-white/70">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-white/35">Member since</span>
                <span className="text-sm text-gray-900 dark:text-white/70">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-white/35">Plan</span>
                <span className="text-sm text-gray-900 dark:text-white/70">{hasAccess ? 'Unlimited' : 'Free'}</span>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
