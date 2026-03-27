'use client'

import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useProgression } from '@/lib/progressionState'
import { getLevelLabel, UNLOCK_DEFINITIONS } from '@/lib/progressionConfig'

// Generate deterministic confetti pieces (avoid re-randomising on each render)
function generateConfetti(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,           // start % from left
    delay: Math.random() * 0.4,        // stagger
    size: 6 + Math.random() * 8,       // px
    rotation: Math.random() * 360,
    hue: Math.round(Math.random() * 360),
  }))
}

export function UnlockCelebration() {
  const { level, isLevelingUp } = useProgression()

  const confetti = useMemo(() => generateConfetti(10), [])

  // Find the most recent unlock at this level
  const newUnlock = UNLOCK_DEFINITIONS.find((u) => u.level === level)

  return (
    <AnimatePresence>
      {isLevelingUp && (
        <motion.div
          key="unlock-celebration"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop flash */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'var(--progression-glow)' }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />

          {/* Level-up text */}
          <motion.div
            className="relative flex flex-col items-center gap-2"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <span
              className="text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow-lg"
              style={{ color: 'var(--progression-primary)' }}
            >
              Level {level}
            </span>
            <span className="text-lg sm:text-xl text-white/80 font-medium">
              {getLevelLabel(level)}
            </span>

            {newUnlock && (
              <motion.div
                className="mt-3 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md"
                style={{
                  backgroundColor: 'var(--progression-bg)',
                  color: 'var(--progression-accent)',
                  border: '1px solid var(--progression-accent)',
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                🔓 Unlocked: {newUnlock.label}
              </motion.div>
            )}
          </motion.div>

          {/* Confetti particles */}
          {confetti.map((c) => (
            <motion.div
              key={c.id}
              className="absolute rounded-sm"
              style={{
                width: c.size,
                height: c.size,
                left: `${c.x}%`,
                top: '50%',
                backgroundColor: `hsl(${c.hue}, 80%, 65%)`,
                rotate: c.rotation,
              }}
              initial={{ y: 0, opacity: 1, scale: 1 }}
              animate={{
                y: [0, -(150 + Math.random() * 200), 300],
                x: [0, (Math.random() - 0.5) * 120],
                opacity: [1, 1, 0],
                rotate: c.rotation + 360 + Math.random() * 360,
                scale: [1, 1.2, 0.6],
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: c.delay,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
