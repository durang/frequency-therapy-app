'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { frequencies } from '@/lib/frequencies'
import { Frequency } from '@/types'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/lib/authState'
import { useSubscription } from '@/lib/useSubscription'
import { smartSearch, detectIntent, POPULAR_SEARCHES, getMatchLabel, SmartSearchResult } from '@/lib/smartSearch'
import { useSessionHistory } from '@/lib/sessionHistory'
import { LibraryChat } from '@/components/library/LibraryChat'
import { PostSessionFeedback } from '@/components/library/PostSessionFeedback'
import Link from 'next/link'

// ─── Category labels ───────────────────────────────────────────────────
const categoryLabels: Record<string, string> = {
  dna_repair: 'DNA Repair', anxiety_relief: 'Anxiety Relief', cognitive_enhancement: 'Focus & Cognition',
  sleep_optimization: 'Sleep', grounding: 'Grounding', pain_management: 'Pain Relief',
  cardiovascular: 'Heart & Circulation', neurotransmitter_optimization: 'Neurotransmitters',
  mood_enhancement: 'Mood', relaxation: 'Relaxation', neural_repair: 'Neural Repair',
  anti_aging: 'Anti-Aging', immune_enhancement: 'Immune', hormonal_balance: 'Hormones',
  cellular_energy: 'Cellular Energy', regenerative_medicine: 'Regenerative', vascular_health: 'Vascular',
  epigenetic_therapy: 'Epigenetic', quantum_medicine: 'Quantum', metabolic_enhancement: 'Metabolic',
  detox: 'Detox & Cleansing', tissue_repair: 'Tissue Repair', universal_healing: 'Universal Healing',
}

const tierConfig = {
  free: { label: 'Free', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border-emerald-100 dark:border-emerald-400/20' },
  basic: { label: 'Premium', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-100 dark:border-amber-400/20' },
  pro: { label: 'Premium', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-100 dark:border-amber-400/20' },
  clinical: { label: 'Clinical', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-400/10 border-rose-100 dark:border-rose-400/20' },
}

export default function FrequenciesPage() {
  const router = useRouter()
  const { user, isSuperadmin } = useAuth()
  const { isActive: hasSubscription, isLoading: subLoading } = useSubscription()
  const hasFullAccess = hasSubscription || isSuperadmin || user?.subscription_tier === 'clinical'
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedFreq, setSelectedFreq] = useState<Frequency | null>(null)
  const [mode, setMode] = useState<'search' | 'chat'>('search')
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const detailRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Session history
  const { getInsights, getTimeBasedRecommendation, getRecentSessions, getProfileSummaryForAI } = useSessionHistory()
  const insights = useMemo(() => getInsights(), [getInsights])
  const timeRec = useMemo(() => getTimeBasedRecommendation(), [getTimeBasedRecommendation])
  const recentSessions = useMemo(() => getRecentSessions(3), [getRecentSessions])

  const categories = useMemo(() => {
    const cats = new Set(frequencies.map(f => f.category))
    return Array.from(cats)
  }, [])

  // ─── Smart Search ────────────────────────────────────────────────
  const searchResults: SmartSearchResult[] = useMemo(() => {
    if (!search.trim()) return []
    return smartSearch(search)
  }, [search])

  const filtered = useMemo(() => {
    // If we have smart search results, use those
    if (search.trim() && searchResults.length > 0) {
      const result = searchResults.map(r => r.frequency)
      if (activeCategory) {
        return result.filter(f => f.category === activeCategory)
      }
      return result
    }

    // Otherwise fall back to category filter
    return frequencies.filter(f => {
      const matchesCat = !activeCategory || f.category === activeCategory
      return matchesCat
    })
  }, [search, searchResults, activeCategory])

  // Map of frequency IDs to their matched fields (for highlighting)
  const matchedFieldsMap = useMemo(() => {
    const map = new Map<string, string[]>()
    searchResults.forEach(r => map.set(r.frequency.id, r.matchedFields))
    return map
  }, [searchResults])

  // ─── Intent Detection & Mode Switching ───────────────────────────
  const handleSearchInput = useCallback((value: string) => {
    setSearch(value)
    
    if (!value.trim()) {
      setMode('search')
      return
    }

    // Auto-detect intent for mode switching indicator
    const intent = detectIntent(value)
    // Don't auto-switch, just update the indicator
    // User can click the chat button to switch
  }, [])

  const activateChatMode = useCallback((initialMsg?: string) => {
    setMode('chat')
    setChatInitialMessage(initialMsg || search || undefined)
  }, [search])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      const intent = detectIntent(search)
      if (intent === 'chat') {
        e.preventDefault()
        activateChatMode(search)
      }
    }
  }, [search, activateChatMode])

  // ─── Selection ───────────────────────────────────────────────────
  const handleSelect = (freq: Frequency) => {
    if (selectedFreq?.id === freq.id) {
      setSelectedFreq(null)
    } else {
      setSelectedFreq(freq)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const currentIntent = useMemo(() => search.trim() ? detectIntent(search) : 'search', [search])

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#fafaf9]/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/50 dark:border-white/[0.04]">
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
            <Link href="/protocols" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Protocols</Link>
            <Link href="/pricing" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
            <ThemeToggle />
            {user ? (
              <Link href="/dashboard" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link>
            ) : (
              <Link href="/auth/login" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-light mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Frequency Library
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
          className="text-gray-500 dark:text-white/40 text-base max-w-lg mx-auto">
          {insights.totalSessions > 0
            ? `${frequencies.length} frequencies · ${insights.totalSessions} sessions · ${insights.streakDays > 0 ? `${insights.streakDays} day streak 🔥` : 'Start your streak today'}`
            : 'Search by frequency, symptom, or tell our AI what you need'}
        </motion.p>
      </div>

      {/* ─── Smart Search Bar ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 mb-4">
        <div className="relative">
          {/* Search icon */}
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/20" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mode === 'search' ? (
              <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>
            ) : (
              <><path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z" /></>
            )}
          </svg>

          <input
            ref={inputRef}
            type="text"
            placeholder={mode === 'chat' ? 'Tell me how you feel...' : 'Search by Hz, symptom, name, or benefit...'}
            value={mode === 'search' ? search : ''}
            onChange={e => handleSearchInput(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            className="w-full pl-12 pr-28 py-3.5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-2xl text-gray-900 dark:text-white/80 placeholder:text-gray-300 dark:placeholder:text-white/20 focus:outline-none focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/10 transition-all text-sm"
            disabled={mode === 'chat'}
          />

          {/* Mode toggle button */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {/* Intent hint */}
            {search.trim() && mode === 'search' && currentIntent === 'chat' && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-400/10 px-2 py-0.5 rounded-full"
              >
                Press Enter for AI
              </motion.span>
            )}

            <button
              onClick={() => {
                if (mode === 'chat') {
                  setMode('search')
                  setChatInitialMessage(undefined)
                } else {
                  activateChatMode()
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                mode === 'chat'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-white/40 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400'
              }`}
            >
              {mode === 'chat' ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  Search
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z" />
                  </svg>
                  Ask AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search suggestions (when empty and focused) */}
        <AnimatePresence>
          {showSuggestions && !search.trim() && mode === 'search' && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex flex-wrap gap-2 mt-2.5"
            >
              <span className="text-[10px] text-gray-400 dark:text-white/20 uppercase tracking-wider self-center mr-1">Popular:</span>
              {POPULAR_SEARCHES.map(s => (
                <button key={s.query} onClick={() => { setSearch(s.query); setShowSuggestions(false) }}
                  className="px-2.5 py-1 rounded-full text-xs border border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/50 hover:border-gray-300 dark:hover:border-white/10 transition-all">
                  {s.emoji} {s.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search results count and match info */}
        {search.trim() && mode === 'search' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-400 dark:text-white/25">
              {searchResults.length > 0 ? `${searchResults.length} results` : 'No results'} for &ldquo;{search}&rdquo;
            </span>
            {searchResults.length === 0 && (
              <button onClick={() => activateChatMode(search)}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline">
                → Try asking AI instead
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* ─── Chat Mode ────────────────────────────────────────────── */}
      <AnimatePresence>
        {mode === 'chat' && (
          <div className="max-w-6xl mx-auto px-6 mb-6">
            <LibraryChat
              onSelectFrequency={(id) => {
                const freq = frequencies.find(f => f.id === id)
                if (freq) handleSelect(freq)
              }}
              onClose={() => { setMode('search'); setChatInitialMessage(undefined) }}
              initialMessage={chatInitialMessage}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ─── Personalized Recommendation (logged in + has history) ── */}
      {timeRec && mode === 'search' && !search.trim() && (
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl border border-cyan-200/50 dark:border-cyan-500/10 bg-gradient-to-r from-cyan-50/50 to-transparent dark:from-cyan-500/[0.04]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-cyan-600 dark:text-cyan-400/60 uppercase tracking-wider mb-1">Recommended for you now</p>
                <p className="text-sm text-gray-600 dark:text-white/50">{timeRec.reason}</p>
              </div>
              <Link href={`/experience/${timeRec.frequencyId}`}
                className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white/10 text-white text-xs font-medium hover:bg-gray-700 dark:hover:bg-white/15 transition-all flex-shrink-0">
                ▶ Start Session
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── Category Filters ─────────────────────────────────────── */}
      {mode === 'search' && (
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setActiveCategory(null); setSelectedFreq(null) }}
              className={`px-3 py-1.5 rounded-full text-xs tracking-wide transition-all border ${
                !activeCategory ? 'bg-gray-900 dark:bg-white/10 border-gray-900 dark:border-white/20 text-white dark:text-white/80' : 'bg-transparent border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/50'
              }`}>All</button>
            {categories.map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(activeCategory === cat ? null : cat); setSelectedFreq(null) }}
                className={`px-3 py-1.5 rounded-full text-xs tracking-wide transition-all border ${
                  activeCategory === cat ? 'bg-gray-900 dark:bg-white/10 border-gray-900 dark:border-white/20 text-white dark:text-white/80' : 'bg-transparent border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/30 hover:text-gray-700 dark:hover:text-white/50'
                }`}>{categoryLabels[cat] || cat}</button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Main content ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex gap-6 items-start">
          {/* Frequency grid */}
          <div className={`flex-1 grid gap-4 ${
            filtered.length <= 2 ? 'grid-cols-1'
              : selectedFreq ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {filtered.map((freq, i) => {
              const tier = tierConfig[freq.tier]
              const isSelected = selectedFreq?.id === freq.id
              const matchedFields = matchedFieldsMap.get(freq.id) || []
              const isLocked = freq.tier !== 'free' && !hasFullAccess && !subLoading

              return (
                <motion.button
                  key={freq.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                  onClick={() => {
                    if (isLocked) {
                      router.push('/pricing?from=frequencies')
                    } else {
                      handleSelect(freq)
                    }
                  }}
                  className={`group relative text-left p-5 rounded-2xl border transition-all duration-300 ${
                    isLocked
                      ? 'opacity-60 border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:opacity-80'
                      : isSelected
                        ? 'border-cyan-500/30 dark:border-cyan-500/20 bg-cyan-50 dark:bg-cyan-500/[0.04] ring-1 ring-cyan-500/20'
                        : 'border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08]'
                  }`}
                >
                  {/* Lock icon overlay */}
                  {isLocked && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 dark:bg-white/[0.06] flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-white/30">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400 dark:text-white/30 tabular-nums">{freq.hz_value} Hz</span>
                    <div className={`flex items-center gap-1.5 ${isLocked ? 'mr-8' : ''}`}>
                      {/* Match highlight badge */}
                      {matchedFields.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-400/20">
                          {getMatchLabel(matchedFields[0])} match
                        </span>
                      )}
                      <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border ${tier.color}`}>
                        {freq.tier === 'free' ? '✦ Free' : tier.label}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-light text-gray-900 dark:text-white/80 group-hover:text-gray-700 dark:group-hover:text-white mb-1.5"
                      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{freq.name}</h3>
                  <p className="text-xs text-gray-400 dark:text-white/30 leading-relaxed line-clamp-2">{freq.description}</p>
                </motion.button>
              )
            })}
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {selectedFreq && (
              <motion.div
                ref={detailRef}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block w-[380px] flex-shrink-0 sticky top-20 h-fit p-6 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]"
              >
                <button onClick={() => setSelectedFreq(null)} className="absolute top-4 right-4 text-gray-300 dark:text-white/15 hover:text-gray-500 dark:hover:text-white/40 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>

                <span className="text-xs text-gray-400 dark:text-white/25 tabular-nums">{selectedFreq.hz_value} Hz · {selectedFreq.duration_minutes} min</span>
                <h2 className="text-2xl font-light mt-2 mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>{selectedFreq.name}</h2>
                <p className="text-xs text-gray-400 dark:text-white/25 mb-4">{categoryLabels[selectedFreq.category] || selectedFreq.category}</p>

                <p className="text-sm text-gray-600 dark:text-white/40 leading-relaxed mb-6">{selectedFreq.description}</p>

                {selectedFreq.benefits?.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[10px] text-gray-400 dark:text-white/25 uppercase tracking-wider mb-2">Benefits</p>
                    <div className="space-y-1.5">
                      {selectedFreq.benefits.slice(0, 5).map(b => (
                        <div key={b} className="flex items-start gap-2">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500 mt-0.5 flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                          <span className="text-xs text-gray-600 dark:text-white/35">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFreq.best_for?.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[10px] text-gray-400 dark:text-white/25 uppercase tracking-wider mb-2">Best For</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFreq.best_for.slice(0, 4).map(b => (
                        <span key={b} className="text-[10px] px-2 py-0.5 rounded-full border border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/30">{b}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFreq.mechanism && (
                  <div className="mb-5">
                    <p className="text-[10px] text-gray-400 dark:text-white/25 uppercase tracking-wider mb-1.5">How It Works</p>
                    <p className="text-xs text-gray-500 dark:text-white/30 leading-relaxed">{selectedFreq.mechanism}</p>
                  </div>
                )}

                {selectedFreq.dosage && (
                  <div className="mb-6">
                    <p className="text-[10px] text-gray-400 dark:text-white/25 uppercase tracking-wider mb-1.5">Recommended Use</p>
                    <p className="text-xs text-gray-500 dark:text-white/30 leading-relaxed">{selectedFreq.dosage}</p>
                  </div>
                )}

                {selectedFreq.contraindications && selectedFreq.contraindications.length > 0 && (
                  <div className="mb-6 p-3 rounded-lg bg-amber-50 dark:bg-amber-400/5 border border-amber-100 dark:border-amber-400/10">
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1.5">⚠ Contraindications</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400/60">{selectedFreq.contraindications.join(', ')}</p>
                  </div>
                )}

                {(() => {
                  const detailLocked = selectedFreq.tier !== 'free' && !hasFullAccess && !subLoading
                  return detailLocked ? (
                    <Link
                      href="/pricing?from=frequencies"
                      className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-teal-700 transition-all mb-2"
                    >
                      🔒 Unlock with Premium
                    </Link>
                  ) : (
                    <Link
                      href={`/experience/${selectedFreq.id}`}
                      className="block w-full text-center py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-all mb-2"
                    >
                      Start Session
                    </Link>
                  )
                })()}
                <Link
                  href={`/frequencies/${selectedFreq.slug}`}
                  className="block w-full text-center py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.06] text-sm text-gray-500 dark:text-white/30 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/15 transition-all"
                >
                  Read Full Article →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && mode === 'search' && (
          <div className="text-center py-20 text-gray-400 dark:text-white/20">
            <p className="text-lg mb-2">No frequencies found</p>
            <p className="text-sm mb-4">Try a different search or category</p>
            <button
              onClick={() => activateChatMode(search)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-teal-700 transition-all"
            >
              ✨ Ask AI for recommendations
            </button>
          </div>
        )}
      </div>

      {/* Post-session feedback modal */}
      <PostSessionFeedback />
    </div>
  )
}
