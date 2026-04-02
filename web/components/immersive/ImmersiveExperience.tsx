'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Frequency } from '@/types'
import { audioManager } from '@/lib/audioManager'
import AmbientCanvas from './AmbientCanvas'
import Teleprompter from './Teleprompter'
import BreathingGuide from './BreathingGuide'
import AffirmationWhisper from './AffirmationWhisper'
import BreathingSettings from './BreathingSettings'
import FreemiumTimer from './FreemiumTimer'

interface ImmersiveExperienceProps {
  frequency: Frequency
  onExit: () => void
  isFreeUser?: boolean
}

export default function ImmersiveExperience({ frequency, onExit, isFreeUser = false }: ImmersiveExperienceProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isExiting, setIsExiting] = useState(false)
  const [breathingActive, setBreathingActive] = useState(true)
  const [breathingSettingsOpen, setBreathingSettingsOpen] = useState(false)
  const [dimmed, setDimmed] = useState(false)

  // ── Real-time playback duration tracking ──────────────────────
  const playStartRef = useRef<number | null>(null)
  const accumulatedSecondsRef = useRef(0)
  const [elapsedDisplay, setElapsedDisplay] = useState(0) // seconds, for UI

  // When playback starts/stops, track accumulated real time
  useEffect(() => {
    if (isPlaying) {
      playStartRef.current = Date.now()
    } else if (playStartRef.current) {
      const elapsed = (Date.now() - playStartRef.current) / 1000
      accumulatedSecondsRef.current += elapsed
      playStartRef.current = null
    }
  }, [isPlaying])

  // Update elapsed display every second while playing
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      const current = playStartRef.current ? (Date.now() - playStartRef.current) / 1000 : 0
      setElapsedDisplay(Math.floor(accumulatedSecondsRef.current + current))
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying])

  // Save real duration to sessionStorage on unmount or exit
  const saveRealDuration = useCallback(() => {
    // Include any currently-playing segment
    let totalSeconds = accumulatedSecondsRef.current
    if (playStartRef.current) {
      totalSeconds += (Date.now() - playStartRef.current) / 1000
    }
    const realMinutes = Math.round(totalSeconds / 60)

    // Save to sessionStorage for protocol tracking to pick up
    const pendingRaw = sessionStorage.getItem('pending-session')
    if (pendingRaw) {
      try {
        const pending = JSON.parse(pendingRaw)
        pending.duration = Math.max(realMinutes, 1) // at least 1 minute if they played at all
        pending.realDuration = true // flag that this is real, not estimated
        sessionStorage.setItem('pending-session', JSON.stringify(pending))
      } catch {}
    }

    // Also save standalone for non-protocol sessions
    sessionStorage.setItem('last-session-real-minutes', String(realMinutes))
    sessionStorage.setItem('last-session-frequency-id', frequency.id)

    console.log(`⏱ [ImmersiveExperience] Real playback: ${realMinutes} min (${Math.round(totalSeconds)}s)`)
  }, [frequency.id])

  const teleprompterSections = buildSections(frequency)

  // Subscribe to global audio state
  useEffect(() => {
    if (!audioManager) return
    return audioManager.subscribe(state => {
      setIsPlaying(state.isPlaying)
      setVolume(state.volume)
    })
  }, [])

  // Graceful audio fade on unmount (browser back, navigation away)
  // handleExit already does a 3s fade for normal X/Escape exit.
  // This catches unexpected unmounts (back button, link click, etc.)
  useEffect(() => {
    return () => {
      if (audioManager?.state.isPlaying) {
        // 3-second fade — audioManager is a singleton outside React,
        // so the fade continues even after the component unmounts
        audioManager.fadeOutAndStop(3)
      }
      saveRealDuration()
    }
  }, [saveRealDuration])

  const startAudio = useCallback(() => {
    audioManager?.play(frequency.name, frequency.hz_value)
  }, [frequency])

  const stopAudio = useCallback(() => {
    audioManager?.stop()
  }, [])

  const handleExit = useCallback(() => {
    setIsExiting(true)
    saveRealDuration()
    // Graceful 2s audio fade-out, then navigate away
    if (audioManager) {
      audioManager.fadeOutAndStop(3).then(() => onExit())
    } else {
      setTimeout(onExit, 800)
    }
  }, [onExit, saveRealDuration])

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleExit() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleExit])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="fixed inset-0 bg-[#0a0a0f] z-50 overflow-hidden"
        >
          <AmbientCanvas frequency={frequency.hz_value} isPlaying={isPlaying} />

          <FreemiumTimer isActive={isFreeUser && isPlaying} limitSeconds={300} onExpired={() => audioManager?.fadeOutAndStop(2)} />

          {/* Noise texture */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            zIndex: 1,
          }} />

          {/* Progress bar — ultra thin line at top, fills as session progresses */}
          {isPlaying && (
            <div className="fixed top-0 left-0 right-0 z-30 h-[2px] bg-white/[0.04]">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500/60 to-teal-500/40"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min((elapsedDisplay / (frequency.duration_minutes * 60)) * 100, 100)}%` }}
                transition={{ duration: 0.5, ease: 'linear' }}
              />
            </div>
          )}

          {/* Top bar */}
          <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
            <button onClick={handleExit} className="group flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors duration-500" aria-label="Exit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:rotate-90 transition-transform duration-500">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span className="text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:inline">Exit</span>
            </button>

            {/* Desktop: play/pause in top bar (as before) */}
            <div className="hidden sm:block">
              {!isPlaying ? (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
                  onClick={startAudio}
                  className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 transition-all duration-500 backdrop-blur-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                  <span className="text-xs tracking-widest uppercase">Begin Session</span>
                </motion.button>
              ) : (
                <button onClick={stopAudio} className="flex items-center gap-2 text-white/20 hover:text-white/50 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" />
                  <span className="text-xs tracking-widest uppercase">Playing</span>
                  <span className="text-xs text-white/15 tabular-nums ml-1">
                    {Math.floor(elapsedDisplay / 60)}:{String(elapsedDisplay % 60).padStart(2, '0')}
                  </span>
                </button>
              )}
            </div>

            {/* Mobile: when playing, small pause button in top bar */}
            {isPlaying && (
              <button onClick={stopAudio} className="sm:hidden flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-white/40 hover:text-white/70 transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" />
                <span className="text-[10px] tracking-widest uppercase tabular-nums">
                  {Math.floor(elapsedDisplay / 60)}:{String(elapsedDisplay % 60).padStart(2, '0')}
                </span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white/30">
                  <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile: Big centered play button before session starts */}
          {!isPlaying && (
            <div className="sm:hidden fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 1, ease: 'easeOut' }}
                className="pointer-events-auto text-center"
              >
                <button
                  onClick={startAudio}
                  className="w-20 h-20 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-sm flex items-center justify-center hover:bg-white/[0.14] hover:border-white/[0.2] transition-all duration-500 mb-4 mx-auto"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white/70 ml-1">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </button>
                <p className="text-[10px] tracking-[0.25em] uppercase text-white/25">Begin Session</p>
              </motion.div>
            </div>
          )}

          {/* Teleprompter */}
          <Teleprompter sections={teleprompterSections} frequencyName={frequency.name} hzValue={frequency.hz_value} dimmed={dimmed} />

          {/* Breathing guide — reserved zone: bottom 140px-220px on mobile, 176px-280px on desktop */}
          {breathingActive && isPlaying && (
            <div className="fixed bottom-[140px] sm:bottom-[176px] left-1/2 -translate-x-1/2 z-20 scale-[0.65] sm:scale-100">
              <BreathingGuide isActive={true} recommendedConfig={frequency.breathing} />
            </div>
          )}

          {/* Affirmation whispers — reserved zone: bottom 100px-140px on mobile */}
          {isPlaying && (
            <div className="fixed bottom-[100px] sm:bottom-[136px] left-0 right-0 z-10">
              <AffirmationWhisper frequencySlug={frequency.slug} isActive={isPlaying} />
            </div>
          )}

          {/* Bottom controls — reserved zone: bottom 0-80px mobile, 0-56px desktop */}
          <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-3">
            {/* Volume slider */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-white/[0.06] bg-white/[0.02]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                className={`flex-shrink-0 ${volume === 0 ? 'text-red-400/60' : 'text-white/30'}`}>
                {volume === 0 ? (
                  <><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>
                ) : (
                  <><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" opacity={volume > 0.5 ? 1 : 0.3} /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></>
                )}
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(volume * 100)}
                onChange={(e) => {
                  const v = parseInt(e.target.value) / 100
                  setVolume(v)
                  audioManager?.setVolume(v)
                }}
                className="w-14 sm:w-20 h-1 appearance-none bg-white/10 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/60 [&::-webkit-slider-thumb]:hover:bg-white/80 [&::-webkit-slider-thumb]:transition-colors"
              />
            </div>
            <button onClick={() => setBreathingActive(!breathingActive)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full border text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 ${
                breathingActive ? 'border-cyan-500/20 text-cyan-400/60 bg-cyan-500/5' : 'border-white/[0.06] text-white/20 bg-white/[0.02]'
              }`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="sm:w-[14px] sm:h-[14px]"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              Breathe
            </button>
            {breathingActive && (
              <button onClick={() => setBreathingSettingsOpen(!breathingSettingsOpen)}
                className="p-3 rounded-full border border-white/[0.06] text-white/20 hover:text-white/40 hover:border-white/10 transition-all duration-300" aria-label="Settings">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            )}
            <button onClick={() => setDimmed(!dimmed)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full border text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 ${
                dimmed ? 'border-amber-500/20 text-amber-400/60 bg-amber-500/5' : 'border-white/[0.06] text-white/20 bg-white/[0.02]'
              }`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="sm:w-[14px] sm:h-[14px]"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              {dimmed ? 'Lights On' : 'Lights Off'}
            </button>
          </div>

          <BreathingSettings isOpen={breathingSettingsOpen} onClose={() => setBreathingSettingsOpen(false)} onConfigChange={() => {}} />
          <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function buildSections(freq: Frequency) {
  const sections = []
  sections.push({ text: freq.description, delay: 3 })
  if (freq.scientific_backing) sections.push({ label: 'The Science', text: freq.scientific_backing, delay: 6 })
  if (freq.mechanism) sections.push({ label: 'How It Works', text: freq.mechanism, delay: 6 })
  if (freq.benefits?.length) sections.push({ label: 'Benefits', text: freq.benefits.slice(0, 4).join(' · '), delay: 5 })
  if (freq.best_for?.length) sections.push({ label: 'Best For', text: freq.best_for.slice(0, 3).join(' · '), delay: 5 })
  if (freq.dosage) sections.push({ label: 'Recommended Use', text: freq.dosage, delay: 5 })
  return sections
}
