'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { frequencies } from '@/lib/frequencies'
import { Frequency } from '@/types'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import Link from 'next/link'

const categoryLabels: Record<string, string> = {
  dna_repair: 'DNA Repair',
  anxiety_relief: 'Anxiety Relief',
  cognitive_enhancement: 'Focus & Cognition',
  sleep_optimization: 'Sleep',
  grounding: 'Grounding',
  pain_management: 'Pain Relief',
  cardiovascular: 'Heart & Circulation',
  neurotransmitter_optimization: 'Neurotransmitters',
  mood_enhancement: 'Mood',
  relaxation: 'Relaxation',
  neural_repair: 'Neural Repair',
  anti_aging: 'Anti-Aging',
  immune_enhancement: 'Immune',
  hormonal_balance: 'Hormones',
  cellular_energy: 'Cellular Energy',
}

const tierConfig = {
  free: { label: 'Free', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  basic: { label: 'Premium', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  pro: { label: 'Premium', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  clinical: { label: 'Clinical', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
}

export default function FrequenciesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

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

  const handleSelect = (freq: Frequency) => {
    // Free frequencies go directly to experience
    // Paid frequencies also go — freemium timer handles limit (S03)
    router.push(`/experience/${freq.id}`)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center border border-cyan-500/10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
                <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              </svg>
            </div>
            <span className="text-sm font-medium text-white/60 group-hover:text-white/90 transition-colors"
                  style={{ fontFamily: 'var(--font-instrument), Georgia, serif' }}>
              FreqTherapy
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/pricing"
              className="text-xs tracking-widest uppercase px-4 py-2 rounded-full border border-cyan-500/20 text-cyan-400/70 hover:text-cyan-300 hover:border-cyan-500/40 transition-all duration-300"
            >
              Upgrade
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-light text-white/90 mb-4"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Frequency Library
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-white/40 text-lg max-w-lg mx-auto"
          style={{ fontFamily: 'var(--font-instrument), Georgia, serif' }}
        >
          Select a frequency to begin your immersive session
        </motion.p>
      </div>

      {/* Search + Filters */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        {/* Search */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search frequencies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/80 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/30 focus:bg-white/[0.05] transition-all duration-300 text-sm"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs tracking-wide transition-all duration-300 border ${
              !activeCategory
                ? 'bg-white/10 border-white/20 text-white/80'
                : 'bg-transparent border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/10'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-xs tracking-wide transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-white/10 border-white/20 text-white/80'
                  : 'bg-transparent border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/10'
              }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Frequency Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((freq, i) => {
            const tier = tierConfig[freq.tier]
            const isFree = freq.tier === 'free'

            return (
              <motion.button
                key={freq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                onClick={() => handleSelect(freq)}
                className="group text-left p-5 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-500 relative overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-cyan-500/[0.03] to-transparent rounded-2xl" />

                <div className="relative z-10">
                  {/* Top row: Hz + tier */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-white/30 tabular-nums">{freq.hz_value} Hz</span>
                    <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border ${tier.color}`}>
                      {tier.label}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-light text-white/80 group-hover:text-white transition-colors duration-300 mb-2"
                      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                    {freq.name}
                  </h3>

                  {/* Description truncated */}
                  <p className="text-xs text-white/30 leading-relaxed line-clamp-2 mb-3">
                    {freq.description}
                  </p>

                  {/* Category + duration */}
                  <div className="flex items-center gap-3 text-[10px] text-white/20">
                    <span>{categoryLabels[freq.category] || freq.category}</span>
                    <span>·</span>
                    <span>{freq.duration_minutes} min</span>
                  </div>

                  {/* Lock icon for paid */}
                  {!isFree && (
                    <div className="absolute top-5 right-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400/40">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/20">
            <p className="text-lg mb-2">No frequencies found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  )
}
