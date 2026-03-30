'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { audioManager } from '@/lib/audioManager'
import Link from 'next/link'

export default function MiniPlayer() {
  const [state, setState] = useState({ isPlaying: false, frequencyName: '', hzValue: 0 })

  useEffect(() => {
    if (!audioManager) return
    setState(audioManager.state)
    return audioManager.subscribe(setState)
  }, [])

  if (!state.isPlaying) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-5 py-3 rounded-2xl bg-gray-900 dark:bg-white/10 backdrop-blur-xl border border-gray-800 dark:border-white/[0.08] shadow-2xl shadow-black/20"
      >
        {/* Pulse indicator */}
        <div className="flex items-center gap-1">
          <div className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse" />
          <div className="w-1 h-5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
          <div className="w-1 h-4 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p className="text-sm text-white dark:text-white/80 font-medium truncate">{state.frequencyName}</p>
          <p className="text-[10px] text-white/40 tabular-nums">{state.hzValue} Hz</p>
        </div>

        {/* Stop button */}
        <button
          onClick={() => audioManager?.stop()}
          className="ml-2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
          aria-label="Stop audio"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
