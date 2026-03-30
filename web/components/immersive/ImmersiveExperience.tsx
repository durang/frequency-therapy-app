'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Frequency } from '@/types'
import AmbientCanvas from './AmbientCanvas'
import Teleprompter from './Teleprompter'
import BreathingGuide from './BreathingGuide'
import BreathingSettings from './BreathingSettings'
import FreemiumTimer from './FreemiumTimer'

interface ImmersiveExperienceProps {
  frequency: Frequency
  onExit: () => void
  isFreeUser?: boolean // true → show 5-min timer
}

export default function ImmersiveExperience({ frequency, onExit, isFreeUser = false }: ImmersiveExperienceProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [breathingActive, setBreathingActive] = useState(true)
  const [breathingSettingsOpen, setBreathingSettingsOpen] = useState(false)
  const [dimmed, setDimmed] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  // Build teleprompter sections from frequency data
  const teleprompterSections = buildSections(frequency)

  // Start audio with fade-in
  const startAudio = useCallback(async () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = ctx

      if (ctx.state === 'suspended') {
        await ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(frequency.hz_value, ctx.currentTime)

      // 5-second fade-in
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 5)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()

      oscillatorRef.current = osc
      gainRef.current = gain
      setIsPlaying(true)

      console.log(`🎵 Immersive: Playing ${frequency.name} at ${frequency.hz_value}Hz`)
    } catch (err) {
      console.error('Failed to start audio:', err)
    }
  }, [frequency])

  // Stop audio with fade-out
  const stopAudio = useCallback(() => {
    const gain = gainRef.current
    const ctx = audioContextRef.current
    const osc = oscillatorRef.current

    if (gain && ctx) {
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 2)
      setTimeout(() => {
        osc?.stop()
        osc?.disconnect()
        gain.disconnect()
        ctx.close()
        oscillatorRef.current = null
        gainRef.current = null
        audioContextRef.current = null
      }, 2100)
    }
    setIsPlaying(false)
    console.log(`🔇 Immersive: Stopped ${frequency.name}`)
  }, [frequency.name])

  // Handle exit
  const handleExit = useCallback(() => {
    setIsExiting(true)
    stopAudio()
    setTimeout(onExit, 2200) // wait for fade-out
  }, [stopAudio, onExit])

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleExit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleExit])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      oscillatorRef.current?.stop()
      oscillatorRef.current?.disconnect()
      gainRef.current?.disconnect()
      audioContextRef.current?.close()
    }
  }, [])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="fixed inset-0 bg-[#0a0a0f] z-50 overflow-hidden"
        >
          {/* Ambient background */}
          <AmbientCanvas
            frequency={frequency.hz_value}
            isPlaying={isPlaying}
          />

          {/* Freemium timer for free users */}
          <FreemiumTimer
            isActive={isFreeUser && isPlaying}
            limitSeconds={300}
            onExpired={stopAudio}
          />

          {/* Subtle noise texture overlay */}
          <div
            className="fixed inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              zIndex: 1,
            }}
          />

          {/* Top bar: exit + frequency badge */}
          <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5">
            <button
              onClick={handleExit}
              className="group flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors duration-500"
              aria-label="Exit immersive mode"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:rotate-90 transition-transform duration-500">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span className="text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Exit
              </span>
            </button>

            {/* Play button if not playing */}
            {!isPlaying && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                onClick={startAudio}
                className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 transition-all duration-500 backdrop-blur-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                <span className="text-xs tracking-widest uppercase">Begin Session</span>
              </motion.button>
            )}

            {isPlaying && (
              <div className="flex items-center gap-2 text-white/20">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" />
                <span className="text-xs tracking-widest uppercase">Playing</span>
              </div>
            )}
          </div>

          {/* Teleprompter content */}
          <Teleprompter
            sections={teleprompterSections}
            frequencyName={frequency.name}
            hzValue={frequency.hz_value}
            dimmed={dimmed}
          />

          {/* Breathing guide — fixed at bottom, above controls */}
          {breathingActive && isPlaying && (
            <div className="fixed bottom-44 left-1/2 -translate-x-1/2 z-20">
              <BreathingGuide isActive={true} />
            </div>
          )}

          {/* Controls — bottom bar */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            <button
              onClick={() => setBreathingActive(!breathingActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs tracking-widest uppercase transition-all duration-300 ${
                breathingActive
                  ? 'border-cyan-500/20 text-cyan-400/60 bg-cyan-500/5'
                  : 'border-white/[0.06] text-white/20 bg-white/[0.02]'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Breathe
            </button>
            {breathingActive && (
              <button
                onClick={() => setBreathingSettingsOpen(!breathingSettingsOpen)}
                className="p-2 rounded-full border border-white/[0.06] text-white/20 hover:text-white/40 hover:border-white/10 transition-all duration-300"
                aria-label="Breathing settings"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            )}
            {/* Dim/Lights off toggle */}
            <button
              onClick={() => setDimmed(!dimmed)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs tracking-widest uppercase transition-all duration-300 ${
                dimmed
                  ? 'border-amber-500/20 text-amber-400/60 bg-amber-500/5'
                  : 'border-white/[0.06] text-white/20 bg-white/[0.02]'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              {dimmed ? 'Lights On' : 'Lights Off'}
            </button>
          </div>

          {/* Breathing settings panel */}
          <BreathingSettings
            isOpen={breathingSettingsOpen}
            onClose={() => setBreathingSettingsOpen(false)}
            onConfigChange={() => {}}
          />

          {/* Bottom gradient for depth */}
          <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Build teleprompter narrative from frequency data
function buildSections(freq: Frequency) {
  const sections = []

  // Description
  sections.push({
    text: freq.description,
    delay: 3,
  })

  // Scientific backing
  if (freq.scientific_backing) {
    sections.push({
      label: 'The Science',
      text: freq.scientific_backing,
      delay: 6,
    })
  }

  // Mechanism
  if (freq.mechanism) {
    sections.push({
      label: 'How It Works',
      text: freq.mechanism,
      delay: 6,
    })
  }

  // Benefits — group into 2-3 per line
  if (freq.benefits?.length) {
    const benefitText = freq.benefits.slice(0, 4).join(' · ')
    sections.push({
      label: 'Benefits',
      text: benefitText,
      delay: 5,
    })
  }

  // Best for
  if (freq.best_for?.length) {
    const bestForText = freq.best_for.slice(0, 3).join(' · ')
    sections.push({
      label: 'Best For',
      text: bestForText,
      delay: 5,
    })
  }

  // Dosage
  if (freq.dosage) {
    sections.push({
      label: 'Recommended Use',
      text: freq.dosage,
      delay: 5,
    })
  }

  return sections
}
