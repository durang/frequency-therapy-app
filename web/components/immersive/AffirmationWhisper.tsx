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

      // After 8 seconds, fade out
      timerRef.current = setTimeout(() => {
        setVisible(false)

        // After 3 seconds of gap, show next
        timerRef.current = setTimeout(() => {
          idx = (idx + 1) % affirmations.length
          showNext()
        }, 3000)
      }, 8000)
    }

    // Start after 12 seconds (let the user settle in first)
    timerRef.current = setTimeout(showNext, 12000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isActive, affirmations])

  if (currentIndex < 0 || !isActive) return null

  return (
    <div className="fixed top-[18%] sm:top-[22%] left-0 right-0 z-10 flex justify-center pointer-events-none px-8 sm:px-12">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 0.35, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="text-center text-sm sm:text-base md:text-lg font-light text-white/60 max-w-md leading-relaxed tracking-wide"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            {affirmations[currentIndex]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
