'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { protocols } from '@/lib/protocols'
import { useAuth } from '@/lib/authState'
import { ProtocolChat } from '@/components/library/ProtocolChat'
import { ProtocolTimeline } from '@/components/library/ProtocolTimeline'

export default function ProtocolsPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fafaf9] dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-500">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#fafaf9]/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/50 dark:border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-4 font-medium">25-day programs</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Healing Protocols
          </h1>
          <p className="text-gray-500 dark:text-white/35 text-lg max-w-lg mx-auto">
            Structured frequency programs designed for specific conditions. Each backed by research and optimized for results.
          </p>
        </motion.div>
      </div>

      {/* ─── AI Protocol Advisor ─────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <ProtocolChat />
        </motion.div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-3 gap-4">
          {[
            { num: '1', label: 'Choose your protocol', desc: 'Ask the AI or browse below' },
            { num: '2', label: 'Follow daily sessions', desc: '2-3 sessions per day, 15-40 minutes each' },
            { num: '3', label: 'Complete 25 days', desc: 'Consistency is the key to results' },
          ].map((step, i) => (
            <motion.div key={step.num} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              className="text-center p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02]">
              <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-400 flex items-center justify-center text-sm font-medium mx-auto mb-3">{step.num}</div>
              <p className="text-sm font-medium text-gray-900 dark:text-white/70 mb-1">{step.label}</p>
              <p className="text-xs text-gray-400 dark:text-white/25">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── 25-Day Journey Timeline ─────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 mb-20">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 mb-2 font-medium">The Science of Consistency</p>
            <h2 className="text-2xl md:text-3xl font-light" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Your 25-Day Journey
            </h2>
            <p className="text-sm text-gray-500 dark:text-white/30 mt-2 max-w-md mx-auto">
              Every protocol follows this proven progression. Your brain needs time to adapt and respond — here&apos;s what happens at each stage.
            </p>
          </div>
          <div className="p-8 rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]">
            <ProtocolTimeline />
          </div>
        </motion.div>
      </div>

      {/* Protocols grid */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-xl font-light text-gray-900 dark:text-white/60 mb-6 text-center" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          All Protocols
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {protocols.map((protocol, i) => (
            <motion.div key={protocol.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i, duration: 0.5 }}>
              <Link
                href={`/protocols/${protocol.slug}`}
                className="group block p-6 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08] hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-none transition-all duration-500 h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{protocol.icon}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/30">{protocol.duration_days} days</span>
                    <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                      protocol.difficulty === 'beginner' ? 'border-emerald-100 dark:border-emerald-400/20 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10' :
                      'border-amber-100 dark:border-amber-400/20 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10'
                    }`}>{protocol.difficulty}</span>
                  </div>
                </div>

                <h2 className="text-xl font-light text-gray-900 dark:text-white/80 group-hover:text-gray-700 dark:group-hover:text-white mb-2"
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {protocol.name}
                </h2>

                <p className="text-sm text-gray-500 dark:text-white/30 leading-relaxed mb-4 line-clamp-2">{protocol.description}</p>

                {/* Expected outcomes preview */}
                <div className="space-y-1 mb-4">
                  {protocol.expectedOutcomes.slice(0, 2).map((outcome, j) => (
                    <div key={j} className="flex items-start gap-1.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500 mt-0.5 flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                      <span className="text-xs text-gray-400 dark:text-white/25">{outcome}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400 dark:text-white/20">{protocol.condition.split(',')[0]}</p>
                  <span className="text-xs text-cyan-600 dark:text-cyan-400/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    View protocol
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <p className="text-xs text-gray-400 dark:text-white/15 leading-relaxed">
          These protocols are for wellness purposes only. They are not medical advice and do not diagnose, treat, cure, or prevent any disease.
          Always consult a qualified healthcare provider before starting any wellness program. Do not discontinue prescribed medications without medical supervision.
        </p>
      </div>
    </div>
  )
}
