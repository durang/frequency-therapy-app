'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Phase = 'inhale' | 'hold' | 'exhale'

interface BreathingConfig {
  inhale: number
  hold: number
  exhale: number
}

const DEFAULT_CONFIG: BreathingConfig = { inhale: 4, hold: 4, exhale: 6 }

const PHASE_INFO: Record<Phase, { instruction: string; explanation: string }> = {
  inhale: {
    instruction: 'Inhale',
    explanation: 'Activates the parasympathetic nervous system, lowering heart rate',
  },
  hold: {
    instruction: 'Hold',
    explanation: 'Balances CO₂ and O₂ levels, calming the amygdala',
  },
  exhale: {
    instruction: 'Exhale',
    explanation: 'Stimulates the vagus nerve, deepening relaxation',
  },
}

const STORAGE_KEY = 'freqtherapy-breathing-config'

function loadConfig(): BreathingConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return DEFAULT_CONFIG
}

function saveConfig(config: BreathingConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {}
}

interface BreathingGuideProps {
  isActive: boolean
}

export default function BreathingGuide({ isActive }: BreathingGuideProps) {
  const [config, setConfig] = useState<BreathingConfig>(DEFAULT_CONFIG)
  const [phase, setPhase] = useState<Phase>('inhale')
  const [progress, setProgress] = useState(0) // 0..1 within current phase
  const [cycleCount, setCycleCount] = useState(0)
  const animRef = useRef<number>(0)
  const phaseTimeRef = useRef(0)

  // Load config from localStorage on mount
  useEffect(() => {
    setConfig(loadConfig())
  }, [])

  // Main animation loop
  useEffect(() => {
    if (!isActive) return

    let lastTime = performance.now()
    let currentPhase: Phase = 'inhale'
    let elapsed = 0

    const phases: Phase[] = ['inhale', 'hold', 'exhale']
    let phaseIndex = 0

    const getDuration = (p: Phase) => config[p]

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000
      lastTime = now

      // Skip large gaps (tab switch, throttle)
      if (delta > 0.1) {
        animRef.current = requestAnimationFrame(tick)
        return
      }

      elapsed += delta
      const duration = getDuration(currentPhase)
      const phaseProg = Math.min(elapsed / duration, 1)
      setProgress(phaseProg)
      setPhase(currentPhase)
      phaseTimeRef.current = elapsed

      if (elapsed >= duration) {
        elapsed = 0
        phaseIndex = (phaseIndex + 1) % 3
        currentPhase = phases[phaseIndex]
        if (phaseIndex === 0) {
          setCycleCount(c => {
            const next = c + 1
            console.log(`🫁 Breathing: Cycle ${next} complete`)
            return next
          })
        }
      }

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [isActive, config])

  // Compute orb scale based on phase
  const getScale = () => {
    switch (phase) {
      case 'inhale':
        return 0.6 + progress * 0.4 // 0.6 → 1.0
      case 'hold':
        return 1.0
      case 'exhale':
        return 1.0 - progress * 0.4 // 1.0 → 0.6
    }
  }

  const info = PHASE_INFO[phase]
  const phaseDuration = config[phase]
  const remainingSeconds = Math.ceil(phaseDuration - (progress * phaseDuration))

  if (!isActive) return null

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Breathing orb */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full transition-none"
          style={{
            transform: `scale(${getScale()})`,
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
          }}
        />
        {/* Main orb */}
        <div
          className="absolute rounded-full transition-none"
          style={{
            width: '80px',
            height: '80px',
            transform: `scale(${getScale()})`,
            background: 'radial-gradient(circle at 40% 40%, rgba(56, 189, 248, 0.25), rgba(20, 184, 166, 0.15) 60%, transparent 100%)',
            boxShadow: `0 0 ${40 * getScale()}px rgba(56, 189, 248, ${0.1 * getScale()})`,
          }}
        />
        {/* Center text — countdown */}
        <span className="relative z-10 text-2xl font-light text-white/40 tabular-nums">
          {remainingSeconds}
        </span>
      </div>

      {/* Phase instruction */}
      <div className="text-center space-y-2">
        <p className="text-lg tracking-widest uppercase text-white/70 font-light"
           style={{ fontFamily: 'var(--font-instrument), Georgia, serif' }}>
          {info.instruction}
        </p>
        <p className="text-xs text-white/30 max-w-xs mx-auto leading-relaxed">
          {info.explanation}
        </p>
      </div>

      {/* Cycle counter */}
      {cycleCount > 0 && (
        <p className="text-[10px] text-white/15 tracking-widest uppercase">
          Cycle {cycleCount}
        </p>
      )}
    </div>
  )
}

// Export for settings panel
export { DEFAULT_CONFIG, STORAGE_KEY, PHASE_INFO, type BreathingConfig }
