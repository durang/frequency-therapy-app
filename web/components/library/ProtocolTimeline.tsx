/**
 * ProtocolTimeline — Visual 25-day journey timeline
 * 
 * A beautiful, always-visible progression visualization showing
 * the 5 phases of the 25-day protocol. Used on /protocols and /dashboard.
 */

'use client'

import { motion } from 'framer-motion'

const JOURNEY_PHASES = [
  {
    day: '1–3',
    title: 'Calibration',
    icon: '🎧',
    color: 'from-cyan-400 to-cyan-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-400/10',
    borderColor: 'border-cyan-200 dark:border-cyan-400/20',
    textColor: 'text-cyan-700 dark:text-cyan-400',
    desc: 'Your brain learns to recognize the frequency. Start with 10-minute sessions using headphones. You may feel subtle tingling or deep relaxation.',
    shortDesc: 'Brain calibration',
  },
  {
    day: '4–7',
    title: 'Foundation',
    icon: '🌱',
    color: 'from-emerald-400 to-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-400/10',
    borderColor: 'border-emerald-200 dark:border-emerald-400/20',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    desc: 'Brainwave entrainment begins. Sessions extend to 20 minutes. Most people report improved sleep quality by day 5.',
    shortDesc: 'Entrainment begins',
  },
  {
    day: '8–14',
    title: 'Deepening',
    icon: '🔬',
    color: 'from-violet-400 to-violet-500',
    bgColor: 'bg-violet-50 dark:bg-violet-400/10',
    borderColor: 'border-violet-200 dark:border-violet-400/20',
    textColor: 'text-violet-700 dark:text-violet-400',
    desc: 'The real changes start. Your nervous system adapts to the frequency. Add breathing exercises for 2x effectiveness.',
    shortDesc: 'Nervous system adapts',
  },
  {
    day: '15–21',
    title: 'Integration',
    icon: '📈',
    color: 'from-amber-400 to-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-400/10',
    borderColor: 'border-amber-200 dark:border-amber-400/20',
    textColor: 'text-amber-700 dark:text-amber-400',
    desc: 'Effects compound. Many users report measurable changes in stress markers, sleep patterns, and focus duration.',
    shortDesc: 'Effects compound',
  },
  {
    day: '22–25',
    title: 'Mastery',
    icon: '🏆',
    color: 'from-rose-400 to-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-400/10',
    borderColor: 'border-rose-200 dark:border-rose-400/20',
    textColor: 'text-rose-700 dark:text-rose-400',
    desc: 'Your brain now responds quickly to the frequency. You\'ve built a sustainable practice. Maintenance: 3–4 sessions per week.',
    shortDesc: 'Sustainable practice',
  },
]

interface ProtocolTimelineProps {
  /** Current day the user is on (0 = not started, 1-25 = in progress) */
  currentDay?: number
  /** Show compact version for dashboard */
  compact?: boolean
}

export function ProtocolTimeline({ currentDay = 0, compact = false }: ProtocolTimelineProps) {
  // Determine which phase the user is in
  const getPhaseStatus = (index: number) => {
    if (currentDay === 0) return 'upcoming'
    const phaseRanges = [[1, 3], [4, 7], [8, 14], [15, 21], [22, 25]]
    const [start, end] = phaseRanges[index]
    if (currentDay > end) return 'completed'
    if (currentDay >= start) return 'active'
    return 'upcoming'
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {JOURNEY_PHASES.map((phase, i) => {
          const status = getPhaseStatus(i)
          return (
            <div key={i} className="flex items-center gap-1 flex-1">
              <div className={`relative flex-1 h-1.5 rounded-full overflow-hidden ${
                status === 'completed' ? 'bg-emerald-400' :
                status === 'active' ? 'bg-gradient-to-r ' + phase.color :
                'bg-gray-200 dark:bg-white/[0.06]'
              }`}>
                {status === 'active' && (
                  <motion.div
                    className="absolute inset-0 bg-white/30"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </div>
              {i < 4 && (
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  status === 'completed' ? 'bg-emerald-400' :
                  status === 'active' ? 'bg-gradient-to-r ' + phase.color :
                  'bg-gray-200 dark:bg-white/[0.08]'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-[23px] top-8 bottom-8 w-px bg-gradient-to-b from-cyan-300 via-violet-300 to-rose-300 dark:from-cyan-400/20 dark:via-violet-400/20 dark:to-rose-400/20" />

      <div className="space-y-0">
        {JOURNEY_PHASES.map((phase, i) => {
          const status = getPhaseStatus(i)

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative flex items-start gap-5 py-5 group"
            >
              {/* Phase node */}
              <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl border-2 transition-all ${
                status === 'completed'
                  ? 'bg-emerald-50 dark:bg-emerald-400/10 border-emerald-300 dark:border-emerald-400/30'
                  : status === 'active'
                    ? `${phase.bgColor} ${phase.borderColor} ring-4 ring-offset-2 ring-offset-[#fafaf9] dark:ring-offset-[#0a0a0f] ${phase.borderColor}`
                    : `bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.06] opacity-60`
              }`}>
                {status === 'completed' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>{phase.icon}</span>
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 min-w-0 transition-opacity ${status === 'upcoming' && currentDay > 0 ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className={`text-xs font-mono tabular-nums px-2 py-0.5 rounded-md ${
                    status === 'active' ? `${phase.bgColor} ${phase.textColor}` : 'bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-white/30'
                  }`}>
                    Day {phase.day}
                  </span>
                  <h3 className={`text-base font-medium ${
                    status === 'active' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-white/60'
                  }`} style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                    {phase.title}
                  </h3>
                  {status === 'active' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-400 animate-pulse">
                      You are here
                    </span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed ${
                  status === 'active' ? 'text-gray-600 dark:text-white/50' : 'text-gray-400 dark:text-white/30'
                }`}>
                  {phase.desc}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom CTA if not started */}
      {currentDay === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 ml-[68px] p-4 rounded-xl border border-dashed border-cyan-300 dark:border-cyan-500/20 bg-cyan-50/50 dark:bg-cyan-500/[0.03]"
        >
          <p className="text-sm text-cyan-700 dark:text-cyan-400/60">
            Every protocol follows this journey. Choose one above to begin your 25-day transformation.
          </p>
        </motion.div>
      )}
    </div>
  )
}
