'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface FreemiumTimerProps {
  isActive: boolean // true when user is a free user and session is running
  limitSeconds: number // default 300 (5 min)
  onExpired: () => void // called when timer hits 0
}

export default function FreemiumTimer({ isActive, limitSeconds = 300, onExpired }: FreemiumTimerProps) {
  const [remaining, setRemaining] = useState(limitSeconds)
  const [expired, setExpired] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isActive || expired) return

    setRemaining(limitSeconds)

    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setExpired(true)
          onExpired()
          console.log('⏱️ Freemium: Session expired')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive, expired, limitSeconds, onExpired])

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  // Show warning when < 60s remaining
  const isWarning = remaining <= 60 && remaining > 0 && !expired

  return (
    <>
      {/* Timer badge — top right, subtle */}
      {isActive && !expired && (
        <div className={`fixed top-5 right-20 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm transition-all duration-500 ${
          isWarning
            ? 'border-amber-500/30 bg-amber-500/10 text-amber-400/80'
            : 'border-white/[0.06] bg-white/[0.03] text-white/30'
        }`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isWarning ? 'text-amber-400' : ''}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-xs tabular-nums font-mono">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] tracking-wider uppercase opacity-50">free</span>
        </div>
      )}

      {/* Expired overlay */}
      <AnimatePresence>
        {expired && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
              className="text-center max-w-md px-8"
            >
              {/* Soft glow behind */}
              <div className="absolute w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

              <p className="text-xs tracking-[0.3em] uppercase text-cyan-400/50 mb-6"
                 style={{ fontFamily: 'var(--font-instrument), Georgia, serif' }}>
                Session Complete
              </p>

              <h2 className="text-3xl md:text-4xl font-light text-white/80 mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Your free session<br />has ended
              </h2>

              <p className="text-white/30 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
                Unlock unlimited frequency sessions, full breathing guides, and access to all 20 therapeutic frequencies.
              </p>

              <div className="space-y-3">
                <Link
                  href="/pricing"
                  className="block w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium text-sm hover:from-cyan-400 hover:to-teal-400 transition-all duration-300 shadow-lg shadow-cyan-500/20"
                >
                  Unlock Full Access
                </Link>

                <Link
                  href="/frequencies"
                  className="block w-full py-3 px-6 rounded-xl border border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/10 text-sm transition-all duration-300"
                >
                  Back to Library
                </Link>
              </div>

              <p className="text-[10px] text-white/15 mt-8">
                Starting at $10/mo with annual billing
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
