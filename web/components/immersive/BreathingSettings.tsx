'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BreathingConfig, DEFAULT_CONFIG, STORAGE_KEY, PHASE_INFO } from './BreathingGuide'

interface BreathingSettingsProps {
  isOpen: boolean
  onClose: () => void
  onConfigChange: (config: BreathingConfig) => void
}

const PRESETS: { name: string; config: BreathingConfig; description: string }[] = [
  { name: 'Relaxing', config: { inhale: 4, hold: 4, exhale: 6 }, description: 'Extended exhale calms the nervous system' },
  { name: 'Box Breathing', config: { inhale: 4, hold: 4, exhale: 4 }, description: 'Equal phases for balanced focus' },
  { name: '4-7-8 Sleep', config: { inhale: 4, hold: 7, exhale: 8 }, description: 'Dr. Weil\'s technique for deep sleep' },
  { name: 'Energizing', config: { inhale: 6, hold: 2, exhale: 4 }, description: 'Longer inhale activates sympathetic response' },
]

export default function BreathingSettings({ isOpen, onClose, onConfigChange }: BreathingSettingsProps) {
  const [config, setConfig] = useState<BreathingConfig>(DEFAULT_CONFIG)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setConfig(JSON.parse(stored))
    } catch {}
  }, [])

  const updateConfig = (newConfig: BreathingConfig) => {
    setConfig(newConfig)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig))
    onConfigChange(newConfig)
  }

  const adjustValue = (key: keyof BreathingConfig, delta: number) => {
    const newVal = Math.max(1, Math.min(12, config[key] + delta))
    updateConfig({ ...config, [key]: newVal })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[calc(100vw-2rem)] max-w-80 bg-[#12121a]/95 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 sm:p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm tracking-widest uppercase text-white/50"
                style={{ fontFamily: 'var(--font-instrument), Georgia, serif' }}>
              Breathing Pattern
            </h3>
            <button
              onClick={onClose}
              className="text-white/20 hover:text-white/50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Current config sliders */}
          <div className="space-y-4 mb-6">
            {(['inhale', 'hold', 'exhale'] as const).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-white/40 capitalize">{key}</p>
                  <p className="text-[10px] text-white/20">{PHASE_INFO[key].explanation.split(',')[0]}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustValue(key, -1)}
                    className="w-7 h-7 rounded-full border border-white/10 text-white/30 hover:text-white/60 hover:border-white/20 transition-all flex items-center justify-center text-sm"
                  >
                    −
                  </button>
                  <span className="text-white/70 tabular-nums text-sm w-6 text-center">{config[key]}s</span>
                  <button
                    onClick={() => adjustValue(key, 1)}
                    className="w-7 h-7 rounded-full border border-white/10 text-white/30 hover:text-white/60 hover:border-white/20 transition-all flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total cycle time */}
          <div className="text-center mb-5 py-2 border-t border-b border-white/[0.04]">
            <span className="text-[10px] text-white/20 tracking-widest uppercase">
              Cycle: {config.inhale + config.hold + config.exhale}s
              {' · '}
              {Math.round(60 / (config.inhale + config.hold + config.exhale) * 10) / 10} breaths/min
            </span>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <p className="text-[10px] text-white/20 tracking-widest uppercase mb-2">Presets</p>
            {PRESETS.map((preset) => {
              const isActive = preset.config.inhale === config.inhale &&
                               preset.config.hold === config.hold &&
                               preset.config.exhale === config.exhale
              return (
                <button
                  key={preset.name}
                  onClick={() => updateConfig(preset.config)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/10 border border-cyan-500/20'
                      : 'bg-white/[0.02] border border-transparent hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isActive ? 'text-cyan-400/80' : 'text-white/40'}`}>
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-white/20 tabular-nums">
                      {preset.config.inhale}-{preset.config.hold}-{preset.config.exhale}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/20 mt-0.5">{preset.description}</p>
                </button>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
