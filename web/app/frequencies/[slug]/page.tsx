'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { frequencies } from '@/lib/frequencies'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function FrequencyArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const freq = frequencies.find(f => f.slug === slug)
  const [expandedSection, setExpandedSection] = useState<string | null>('mechanism')

  if (!freq) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0a0a0f] flex items-center justify-center text-gray-500 dark:text-white/40">
        <div className="text-center">
          <p className="text-6xl mb-4">🔬</p>
          <h1 className="text-2xl font-light mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Frequency not found</h1>
          <Link href="/frequencies" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">← Back to Library</Link>
        </div>
      </div>
    )
  }

  const sections = [
    {
      id: 'mechanism',
      title: 'How It Works',
      icon: '⚙️',
      content: freq.mechanism || freq.scientific_backing,
    },
    {
      id: 'benefits',
      title: 'Documented Benefits',
      icon: '✅',
      content: null,
      list: freq.benefits,
    },
    {
      id: 'best-for',
      title: 'Best Used For',
      icon: '🎯',
      content: null,
      list: freq.best_for,
    },
    {
      id: 'science',
      title: 'Scientific Evidence',
      icon: '🔬',
      content: freq.scientific_backing,
    },
    {
      id: 'research',
      title: 'Research Citations',
      icon: '📄',
      content: null,
      citations: freq.research_citations,
    },
    ...(freq.clinical_trials?.length ? [{
      id: 'trials',
      title: 'Clinical Trials',
      icon: '🏥',
      content: null,
      trials: freq.clinical_trials,
    }] : []),
    ...(freq.contraindications?.length ? [{
      id: 'safety',
      title: 'Safety & Contraindications',
      icon: '⚠️',
      content: null,
      safety: freq.contraindications,
    }] : []),
    {
      id: 'dosage',
      title: 'Recommended Protocol',
      icon: '⏱️',
      content: freq.dosage || `Listen for ${freq.duration_minutes} minutes per session. Use quality headphones for best results. Consistent daily use amplifies effectiveness over time.`,
    },
  ]

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
            <Link href="/frequencies" className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">← Library</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs tracking-[0.25em] uppercase text-cyan-600 dark:text-cyan-400/60 font-medium">{freq.hz_value} Hz</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />
            <span className="text-xs text-gray-400 dark:text-white/25">{freq.duration_minutes} min sessions</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />
            <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border ${
              freq.tier === 'free' 
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border-emerald-100 dark:border-emerald-400/20' 
                : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-100 dark:border-amber-400/20'
            }`}>{freq.tier === 'free' ? 'Free' : 'Premium'}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            {freq.name}
          </h1>
          <p className="text-lg text-gray-500 dark:text-white/40 leading-relaxed max-w-2xl mb-8">
            {freq.description}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link href={`/experience/${freq.id}`}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-base hover:bg-gray-700 dark:hover:bg-gray-100 transition-all shadow-lg shadow-gray-900/10 dark:shadow-white/5">
              Start Session
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/frequencies" className="text-sm text-gray-500 dark:text-white/30 hover:text-gray-900 dark:hover:text-white transition-colors">
              Browse all frequencies →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="border-t border-gray-100 dark:border-white/[0.04]" />
      </div>

      {/* Article body — expandable sections */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-4">
          {sections.map((section, i) => {
            const isOpen = expandedSection === section.id

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <button
                  onClick={() => setExpandedSection(isOpen ? null : section.id)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? 'border-cyan-200 dark:border-cyan-500/15 bg-white dark:bg-white/[0.03]'
                      : 'border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{section.icon}</span>
                      <h2 className="text-base font-medium text-gray-900 dark:text-white/80">{section.title}</h2>
                    </div>
                    <motion.svg
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className="text-gray-400 dark:text-white/20"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </motion.svg>
                  </div>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-100 dark:border-white/[0.04]"
                    >
                      {section.content && (
                        <p className="text-sm text-gray-600 dark:text-white/40 leading-relaxed">{section.content}</p>
                      )}

                      {section.list && (
                        <ul className="space-y-2">
                          {section.list.map((item, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500 mt-0.5 flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                              <span className="text-sm text-gray-600 dark:text-white/40">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.citations && (
                        <ul className="space-y-3">
                          {section.citations.map((cite, j) => (
                            <li key={j} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04]">
                              <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400/60 mt-0.5 flex-shrink-0">[{j + 1}]</span>
                              <span className="text-xs text-gray-500 dark:text-white/30 leading-relaxed italic">{cite}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {(section as any).trials && (
                        <div className="space-y-3">
                          {(section as any).trials.map((trial: any, j: number) => (
                            <div key={j} className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04]">
                              <p className="text-sm font-medium text-gray-900 dark:text-white/70 mb-2">{trial.title}</p>
                              <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                  <p className="text-lg font-light text-gray-900 dark:text-white/80 tabular-nums">{trial.participants.toLocaleString()}</p>
                                  <p className="text-[10px] text-gray-400 dark:text-white/20">Participants</p>
                                </div>
                                <div>
                                  <p className="text-lg font-light text-gray-900 dark:text-white/80 tabular-nums">{trial.duration_weeks} wk</p>
                                  <p className="text-[10px] text-gray-400 dark:text-white/20">Duration</p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 leading-tight">{trial.results}</p>
                                  <p className="text-[10px] text-gray-400 dark:text-white/20 mt-0.5">Results</p>
                                </div>
                              </div>
                              <p className="text-[10px] text-gray-400 dark:text-white/20 mt-2">{trial.institution}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {(section as any).safety && (
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-400/5 border border-amber-100 dark:border-amber-400/10">
                          <ul className="space-y-2">
                            {(section as any).safety.map((item: string, j: number) => (
                              <li key={j} className="flex items-start gap-2">
                                <span className="text-amber-500 text-sm">⚠</span>
                                <span className="text-sm text-amber-700 dark:text-amber-400/70">{item}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="text-[10px] text-amber-600/60 dark:text-amber-400/30 mt-3">
                            Always consult a healthcare professional before starting frequency therapy, especially if you have existing medical conditions.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* CTA — Ready to start */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-gray-50 to-white dark:from-white/[0.03] dark:to-transparent border border-gray-100 dark:border-white/[0.04] text-center">
          <h3 className="text-2xl md:text-3xl font-light mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Ready to experience {freq.name}?
          </h3>
          <p className="text-sm text-gray-500 dark:text-white/30 max-w-md mx-auto mb-8">
            Put on your headphones, find a quiet space, and let the {freq.hz_value} Hz frequency guide your body and mind.
          </p>
          <Link href={`/experience/${freq.id}`}
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-lg hover:bg-gray-700 dark:hover:bg-gray-100 transition-all shadow-lg shadow-gray-900/10 dark:shadow-white/5">
            Start {freq.duration_minutes}-Minute Session
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <p className="text-xs text-gray-400 dark:text-white/15 mt-4">
            {freq.tier === 'free' ? 'Free · No account required · 5-minute preview' : 'Premium · Unlimited session length'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-white/[0.04] py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-gray-400 dark:text-white/15">
          <p>© 2026 FreqTherapy. Not intended to diagnose, treat, cure, or prevent any disease.</p>
          <Link href="/frequencies" className="hover:text-gray-600 dark:hover:text-white/30 transition-colors">All Frequencies →</Link>
        </div>
      </footer>
    </div>
  )
}
