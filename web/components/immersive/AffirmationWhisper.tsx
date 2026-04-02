'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAffirmations } from '@/lib/affirmations'

interface AffirmationWhisperProps {
  frequencySlug: string
  isActive: boolean
}

/**
 * Subtle affirmation text that fades in and out during immersive sessions.
 * Positioned in upper-third of screen, low opacity, non-intrusive.
 * Each phrase stays for ~8s, then fades out with a 3s gap before the next.
 */
export default function AffirmationWhisper({ frequencySlug, isActive }: AffirmationWhisperProps) {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const affirmations = getAffirmations(frequencySlug)

  useEffect(() => {
    if (!isActive) {
      setVisible(false)
      setCurrentIndex(-1)
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    let idx = 0

    const showNext = () => {
      // Show the affirmation
      setCurrentIndex(idx)
      setVisible(true)

      // After 16 seconds, fade out
      timerRef.current = setTimeout(() => {
        setVisible(false)

        // After 4 seconds of gap, show next
        timerRef.current = setTimeout(() => {
          idx = (idx + 1) % affirmations.length
          showNext()
        }, 4000)
      }, 16000)
    }

    // Start after 12 seconds (let the user settle in first)
    timerRef.current = setTimeout(showNext, 12000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isActive, affirmations])

  if (currentIndex < 0 || !isActive) return null

  return (
    <div className="flex justify-center pointer-events-none px-8 sm:px-12">
      {/* Fixed 2-line height container — prevents layout shift */}
      <div className="h-[3.5rem] sm:h-[4rem] flex items-center justify-center w-full max-w-md">
        <AnimatePresence mode="wait">
          {visible && (
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, x: 40, filter: 'blur(4px)' }}
              animate={{ opacity: 0.35, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -40, filter: 'blur(4px)' }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              className="text-center text-xs sm:text-sm md:text-base font-light text-white/50 leading-relaxed tracking-wide line-clamp-2"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              {affirmations[currentIndex]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
