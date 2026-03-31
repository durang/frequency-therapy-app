'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { frequencies } from '@/lib/frequencies'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/lib/authState'

const categoryLabel: Record<string, string> = {
  dna_repair: 'Cellular Biology', anxiety_relief: 'Neuroscience', cognitive_enhancement: 'Cognitive Science',
  sleep_optimization: 'Sleep Research', grounding: 'Biophysics', pain_management: 'Pain Science',
  cardiovascular: 'Cardiology', neurotransmitter_optimization: 'Neurochemistry', mood_enhancement: 'Psychology',
  relaxation: 'Psychophysiology', neural_repair: 'Neuroscience', anti_aging: 'Longevity Science',
  immune_enhancement: 'Immunology', hormonal_balance: 'Endocrinology', cellular_energy: 'Bioenergetics',
  regenerative_medicine: 'Regenerative Medicine', epigenetic_therapy: 'Epigenetics', quantum_medicine: 'Quantum Biology',
  vascular_health: 'Vascular Science', metabolic_enhancement: 'Metabolic Science',
}

const categoryEmoji: Record<string, string> = {
  dna_repair: '🧬', anxiety_relief: '🧘', cognitive_enhancement: '⚡', sleep_optimization: '🌙',
  grounding: '🌍', pain_management: '💊', cardiovascular: '❤️', neurotransmitter_optimization: '🧠',
  mood_enhancement: '✨', relaxation: '🌊', neural_repair: '🔬', anti_aging: '⏳',
  immune_enhancement: '🛡️', hormonal_balance: '⚖️', cellular_energy: '🔋', regenerative_medicine: '🌱',
  epigenetic_therapy: '🧪', quantum_medicine: '🔮', vascular_health: '💓', metabolic_enhancement: '🔥',
}

// Featured articles — the ones with the most research
const FEATURED_SLUGS = ['dna-repair', 'anxiety-liberation', 'gamma-focus', 'deep-sleep-delta']

export default function BlogPage() {
  const { user } = useAuth()

  const featured = FEATURED_SLUGS
    .map(slug => frequencies.find(f => f.slug === slug))
    .filter(Boolean) as typeof frequencies

  const allArticles = frequencies.filter(f => f.scientific_backing)

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf9]/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/50 dark:border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /></svg>
            </div>
            <span className="text-base font-semibold tracking-tight">FreqTherapy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/frequencies" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Frequencies</Link>
            <Link href="/pricing" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
            <ThemeToggle />
            {user ? (
              <Link href="/dashboard" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link>
            ) : (
              <Link href="/auth/login" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-xs tracking-[0.3em] uppercase text-cyan-600 dark:text-cyan-400/60 font-medium mb-4">The Science</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-5" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Research &amp; Articles
          </h1>
          <p className="text-lg text-gray-500 dark:text-white/35 max-w-xl mx-auto leading-relaxed">
            Peer-reviewed research, clinical trials, and the neuroscience behind every frequency we offer. No hype — just evidence.
          </p>
        </motion.div>
      </div>

      {/* ─── Featured: Breathing Guide (master article) ─── */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <Link href="/blog/breathing-guide" className="group block">
            <div className="relative p-8 md:p-10 rounded-3xl border border-cyan-200/50 dark:border-cyan-500/10 bg-gradient-to-r from-cyan-50/50 via-white to-teal-50/30 dark:from-cyan-500/[0.04] dark:via-transparent dark:to-teal-500/[0.03] overflow-hidden hover:border-cyan-300/50 dark:hover:border-cyan-500/20 transition-all duration-500">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 font-medium">Featured Guide</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-400/20">New</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-light mb-3 text-gray-900 dark:text-white/90 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                    The Breathing Prescription
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-white/35 leading-relaxed mb-4 max-w-lg">
                    Every frequency has a scientifically-matched breathing pattern. This is the complete reference — 6 patterns, 23 frequencies, and the neuroscience behind each pairing.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-white/30 border border-gray-200 dark:border-white/[0.06]">23 frequencies</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-white/30 border border-gray-200 dark:border-white/[0.06]">6 patterns</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-white/30 border border-gray-200 dark:border-white/[0.06]">12 min read</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-4xl md:text-5xl">
                  🫁
                </div>
              </div>
              <div className="absolute bottom-4 right-6 text-xs text-gray-400 dark:text-white/20 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                Read guide
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* ─── Featured Articles ─── */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <h2 className="text-xl font-light mb-6 text-gray-900 dark:text-white/70" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Most researched
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {featured.map((freq, i) => (
            <motion.div key={freq.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
              <Link href={`/frequencies/${freq.slug}`} className="group block p-6 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08] hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-black/10 transition-all duration-300 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base">{categoryEmoji[freq.category] || '🔬'}</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-white/25 font-medium">{categoryLabel[freq.category] || freq.category}</span>
                  <div className="ml-auto flex items-center gap-2">
                    {freq.research_citations && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-400/20">{freq.research_citations.length} studies</span>
                    )}
                    {freq.clinical_trials && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-400/20">{freq.clinical_trials.length} trials</span>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-light text-gray-900 dark:text-white/85 mb-2 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {freq.name}
                  <span className="text-sm text-gray-400 dark:text-white/25 font-mono ml-2">{freq.hz_value} Hz</span>
                </h3>
                <p className="text-sm text-gray-500 dark:text-white/30 leading-relaxed line-clamp-2 mb-4">{freq.scientific_backing?.substring(0, 180)}…</p>
                {freq.breathing && (
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-white/20">
                    <span>🫁</span>
                    <span>Breathing: {freq.breathing.inhale}-{freq.breathing.hold}-{freq.breathing.exhale}</span>
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── All Articles ─── */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light text-gray-900 dark:text-white/70" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            All frequency articles
          </h2>
          <span className="text-xs text-gray-400 dark:text-white/20">{allArticles.length} articles</span>
        </div>

        <div className="space-y-3">
          {allArticles.map((freq, i) => (
            <motion.div key={freq.slug} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.3 }}>
              <Link href={`/frequencies/${freq.slug}`}
                className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08] transition-all">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center flex-shrink-0 text-lg">
                  {categoryEmoji[freq.category] || '🔬'}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-gray-900 dark:text-white/70 group-hover:text-gray-700 dark:group-hover:text-white transition-colors truncate">
                      {freq.name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-white/25 font-mono flex-shrink-0">{freq.hz_value} Hz</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-white/25 truncate">{categoryLabel[freq.category]} · {freq.duration_minutes} min · {freq.breathing ? `Breathing ${freq.breathing.inhale}-${freq.breathing.hold}-${freq.breathing.exhale}` : ''}</p>
                </div>
                {/* Badges */}
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                  {freq.research_citations && freq.research_citations.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-400/20">
                      {freq.research_citations.length} studies
                    </span>
                  )}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    freq.tier === 'free'
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border-emerald-100 dark:border-emerald-400/20'
                      : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-100 dark:border-amber-400/20'
                  }`}>{freq.tier === 'free' ? 'Free' : 'Premium'}</span>
                </div>
                {/* Arrow */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 dark:text-white/10 group-hover:text-gray-500 dark:group-hover:text-white/30 transition-colors flex-shrink-0">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-white/[0.04] py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-white/15">
          <p>© 2026 FreqTherapy. Not intended to diagnose, treat, cure, or prevent any disease.</p>
          <div className="flex items-center gap-4">
            <Link href="/frequencies" className="hover:text-gray-600 dark:hover:text-white/30 transition-colors">Frequencies</Link>
            <Link href="/protocols" className="hover:text-gray-600 dark:hover:text-white/30 transition-colors">Protocols</Link>
            <Link href="/pricing" className="hover:text-gray-600 dark:hover:text-white/30 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
