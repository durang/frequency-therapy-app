/**
 * ConnectedFrequencies — Shows scientific relationships between frequencies
 * 
 * Displays at the bottom of frequency articles, explaining WHY
 * certain frequencies work together and linking to their articles.
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { getConnectionsForFrequency, FrequencyConnection } from '@/lib/frequencyConnections'

const relationshipConfig: Record<string, { color: string; icon: string; label: string }> = {
  Harmonic: { color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-400/10 border-violet-200 dark:border-violet-400/20', icon: '🔗', label: 'Harmonic relationship' },
  Synergistic: { color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/20', icon: '⚡', label: 'Amplify each other' },
  Sequential: { color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-400/10 border-cyan-200 dark:border-cyan-400/20', icon: '→', label: 'Use in sequence' },
  Complementary: { color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-200 dark:border-amber-400/20', icon: '∞', label: 'Different pathways, same goal' },
}

interface ConnectedFrequenciesProps {
  frequencySlug: string
  frequencyName: string
}

export function ConnectedFrequencies({ frequencySlug, frequencyName }: ConnectedFrequenciesProps) {
  const connections = getConnectionsForFrequency(frequencySlug)

  if (connections.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="my-16"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-500 dark:text-violet-400">
            <circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><circle cx="18" cy="6" r="3" />
            <path d="M8.5 8.5L15.5 15.5M8.5 6H15M6 8.5V15.5" strokeDasharray="2 2" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white/90" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Connected frequencies
        </h2>
      </div>
      <p className="text-sm text-gray-500 dark:text-white/35 mb-8 ml-11">
        {frequencyName} works with these frequencies — here&apos;s the science behind each connection.
      </p>

      <div className="space-y-4">
        {connections.map((conn, i) => {
          const config = relationshipConfig[conn.relationship] || relationshipConfig.Complementary

          return (
            <motion.div
              key={`${conn.toSlug}-${i}`}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link
                href={`/frequencies/${conn.toSlug}`}
                className="group block p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.08] transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Connection line indicator */}
                  <div className="flex flex-col items-center flex-shrink-0 mt-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm border ${config.color}`}>
                      {config.icon}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="text-base font-medium text-gray-900 dark:text-white/80 group-hover:text-gray-700 dark:group-hover:text-white transition-colors"
                            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                        {conn.toName}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-white/25 tabular-nums">{conn.toHz} Hz</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${config.color}`}>
                        {conn.relationship}
                      </span>
                    </div>

                    {/* Explanation */}
                    <p className="text-sm text-gray-500 dark:text-white/35 leading-relaxed">
                      {conn.explanation}
                    </p>

                    {/* Protocol link */}
                    {conn.protocol && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] text-cyan-600 dark:text-cyan-400/50">
                          Used together in:
                        </span>
                        <Link
                          href={`/protocols/${conn.protocol}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
                        >
                          {conn.protocol.charAt(0).toUpperCase() + conn.protocol.slice(1)} Protocol →
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 dark:text-white/20">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
