'use client'

import { motion } from 'framer-motion'
import { useProgression } from '@/lib/progressionState'

interface LevelIndicatorProps {
  onClick?: () => void
}

export function LevelIndicator({ onClick }: LevelIndicatorProps) {
  const { level, levelLabel, xpProgress, maxLevel, isLevelingUp } = useProgression()

  // Clamp progress between 0 and 1
  const progress = Math.max(0, Math.min(1, xpProgress))
  const nearLevelUp = progress > 0.9 && !maxLevel

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 group cursor-pointer select-none rounded-lg px-2 py-1 transition-colors hover:bg-white/5"
      title={`Level ${level} — ${levelLabel}${maxLevel ? ' (Max)' : ''}`}
    >
      {/* Level badge */}
      <div
        className={`
          relative flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold
          border-2 transition-all duration-300
          ${isLevelingUp ? 'scale-110' : ''}
        `}
        style={{
          borderColor: 'var(--progression-primary)',
          color: 'var(--progression-primary)',
          boxShadow: nearLevelUp
            ? '0 0 12px var(--progression-glow), 0 0 24px var(--progression-glow)'
            : isLevelingUp
            ? '0 0 20px var(--progression-glow)'
            : undefined,
        }}
      >
        {level}
        {nearLevelUp && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid var(--progression-primary)' }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* XP bar + label */}
      <div className="hidden sm:flex flex-col gap-0.5 min-w-[72px]">
        <span className="text-[10px] leading-none text-white/50 group-hover:text-white/70 transition-colors">
          {levelLabel}
        </span>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: 'var(--progression-primary)' }}
            initial={false}
            animate={{ width: `${maxLevel ? 100 : progress * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />
        </div>
      </div>
    </button>
  )
}
