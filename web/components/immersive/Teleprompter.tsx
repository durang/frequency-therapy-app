'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TeleprompterSection {
  label?: string
  text: string
  delay: number // seconds before appearing
}

interface TeleprompterProps {
  sections: TeleprompterSection[]
  frequencyName: string
  hzValue: number
}

export default function Teleprompter({ sections, frequencyName, hzValue }: TeleprompterProps) {
  const [visibleIndex, setVisibleIndex] = useState(-1)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Show frequency name immediately
    setVisibleIndex(-1)

    let currentIndex = 0
    const showNext = () => {
      if (currentIndex < sections.length) {
        const delay = sections[currentIndex].delay * 1000
        timerRef.current = setTimeout(() => {
          setVisibleIndex(currentIndex)
          currentIndex++
          showNext()
        }, delay)
      }
    }

    // Start after 2s initial delay for the title to breathe
    timerRef.current = setTimeout(() => {
      showNext()
    }, 2000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [sections])

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20 overflow-y-auto">
      {/* Frequency title — always visible */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="text-center mb-16"
      >
        <p className="text-sm tracking-[0.3em] uppercase text-cyan-400/70 font-medium mb-4"
           style={{ fontFamily: 'var(--font-instrument), Georgia, serif' }}>
          {hzValue} Hz
        </p>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white/90 leading-none"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {frequencyName}
        </h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent mx-auto mt-8"
        />
      </motion.div>

      {/* Narrative sections — appear one by one */}
      <div className="max-w-2xl mx-auto space-y-12 text-center">
        <AnimatePresence>
          {sections.map((section, i) => (
            i <= visibleIndex && (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                className="space-y-3"
              >
                {section.label && (
                  <p className="text-xs tracking-[0.25em] uppercase text-cyan-400/50 font-medium"
                     style={{ fontFamily: 'var(--font-instrument), Georgia, serif' }}>
                    {section.label}
                  </p>
                )}
                <p className="text-lg md:text-xl leading-relaxed text-white/60 font-light"
                   style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {section.text}
                </p>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
