'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { frequencies } from '@/lib/frequencies'
import { Frequency } from '@/types'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/lib/authState'
import Link from 'next/link'

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
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedFreq, setSelectedFreq] = useState<Frequency | null>(null)
  const detailRef = useRef<HTMLDivElement>(null)

  const categories = useMemo(() => {
    const cats = new Set(frequencies.map(f => f.category))
    return Array.from(cats)
  }, [])

  const filtered = useMemo(() => {
    return frequencies.filter(f => {
      const matchesSearch = !search ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase())
      const matchesCat = !activeCategory || f.category === activeCategory
      return matchesSearch && matchesCat
    })
  }, [search, activeCategory])

  // Scroll to top when selecting a frequency
  const handleSelect = (freq: Frequency) => {
    if (selectedFreq?.id === freq.id) {
      setSelectedFreq(null)
    } else {
      setSelectedFreq(freq)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

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
            <Link href="/pricing" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
            <ThemeToggle />
            {user ? (
              <Link href="/dashboard" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/login" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-light mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Frequency Library
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
          className="text-gray-500 dark:text-white/40 text-base max-w-lg mx-auto">
          {user ? `Welcome back · ${frequencies.length} frequencies available` : 'Select a frequency to begin your immersive session'}
        </motion.p>
      </div>

      {/* Search + Filters */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <div className="relative mb-4">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/20" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text" placeholder="Search frequencies..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-gray-900 dark:text-white/80 placeholder:text-gray-300 dark:placeholder:text-white/20 focus:outline-none focus:border-cyan-500/30 transition-all text-sm"
          />
        </div>
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

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex gap-6 items-start">
          {/* Frequency grid — always fills available space */}
          <div className={`flex-1 grid gap-4 ${
            filtered.length <= 2
              ? 'grid-cols-1'
              : selectedFreq
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {filtered.map((freq, i) => {
              const tier = tierConfig[freq.tier]
              const isSelected = selectedFreq?.id === freq.id

              return (
                <motion.button
                  key={freq.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                  onClick={() => handleSelect(freq)}
                  className={`group text-left p-5 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? 'border-cyan-500/30 dark:border-cyan-500/20 bg-cyan-50 dark:bg-cyan-500/[0.04] ring-1 ring-cyan-500/20'
                      : 'border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400 dark:text-white/30 tabular-nums">{freq.hz_value} Hz</span>
                    <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border ${tier.color}`}>{tier.label}</span>
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

                <Link
                  href={`/experience/${selectedFreq.id}`}
                  className="block w-full text-center py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-all mb-2"
                >
                  Start Session
                </Link>
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

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400 dark:text-white/20">
            <p className="text-lg mb-2">No frequencies found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  )
}
