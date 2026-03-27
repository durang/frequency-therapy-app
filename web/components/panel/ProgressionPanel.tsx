'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useProgression } from '@/lib/progressionState'
import {
  LEVEL_THRESHOLDS,
  UNLOCK_DEFINITIONS,
  getLevelLabel,
  XP_PER_SECOND,
} from '@/lib/progressionConfig'
import { Button } from '@/components/ui/button'

interface ProgressionPanelProps {
  open: boolean
  onClose: () => void
}

/** Format seconds → "Xh Ym" */
function formatPlaytime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function ProgressionPanel({ open, onClose }: ProgressionPanelProps) {
  const {
    level,
    levelLabel,
    xp,
    xpProgress,
    xpToNext,
    totalPlaytime,
    streakDays,
    longestStreak,
    unlockedEffects,
    maxLevel,
  } = useProgression()

  const progress = Math.max(0, Math.min(1, xpProgress))

  // Compute XP numbers for display
  const currentLevelThreshold =
    LEVEL_THRESHOLDS.find((t) => t.level === level)?.playtimeRequired ?? 0
  const xpAtLevelStart = currentLevelThreshold * XP_PER_SECOND
  const xpInLevel = Math.round(xp - xpAtLevelStart)
  const xpNeeded = xpToNext === Infinity ? null : Math.round(xpToNext)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            className="fixed top-0 right-0 z-50 h-full w-80 sm:w-96 bg-slate-900/95 backdrop-blur-lg border-l border-white/10 shadow-2xl flex flex-col overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Progression</h2>
              <Button variant="outline" size="sm" onClick={onClose} className="p-1.5">
                <XMarkIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Level hero */}
            <div className="p-6 text-center border-b border-white/5">
              <div
                className="mx-auto mb-3 flex items-center justify-center w-20 h-20 rounded-full text-3xl font-extrabold border-4"
                style={{
                  borderColor: 'var(--progression-primary)',
                  color: 'var(--progression-primary)',
                  boxShadow: '0 0 24px var(--progression-glow)',
                }}
              >
                {level}
              </div>
              <p className="text-white text-base font-semibold">{levelLabel}</p>
              <p className="text-white/50 text-xs mt-1">
                {maxLevel ? 'Max level reached!' : `Level ${level + 1} — ${getLevelLabel(level + 1)}`}
              </p>

              {/* XP bar */}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-white/40 mb-1">
                  <span>XP</span>
                  <span>
                    {maxLevel
                      ? 'MAX'
                      : `${xpInLevel} / ${xpNeeded}`}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: 'var(--progression-primary)' }}
                    initial={false}
                    animate={{ width: `${maxLevel ? 100 : progress * 100}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 p-4 border-b border-white/5">
              <StatCard label="Playtime" value={formatPlaytime(totalPlaytime)} />
              <StatCard label="Streak" value={`${streakDays}d`} />
              <StatCard label="Best Streak" value={`${longestStreak}d`} />
            </div>

            {/* Unlocks list */}
            <div className="flex-1 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                Unlocks
              </h3>
              <ul className="space-y-2">
                {UNLOCK_DEFINITIONS.map((unlock) => {
                  const isUnlocked = unlockedEffects.includes(unlock.effectId)
                  return (
                    <li
                      key={unlock.effectId}
                      className={`flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isUnlocked ? 'bg-white/5' : 'opacity-40'
                      }`}
                    >
                      <span className="text-base leading-none mt-0.5">
                        {isUnlocked ? '🔓' : '🔒'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${isUnlocked ? 'text-white' : 'text-white/60'}`}>
                          {unlock.label}
                        </p>
                        <p className="text-white/40 text-xs truncate">{unlock.description}</p>
                      </div>
                      {!isUnlocked && (
                        <span className="text-[10px] text-white/30 whitespace-nowrap mt-0.5">
                          Lv.{unlock.level}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center rounded-lg bg-white/5 px-2 py-3">
      <p className="text-base font-bold text-white">{value}</p>
      <p className="text-[10px] text-white/40 mt-0.5">{label}</p>
    </div>
  )
}
