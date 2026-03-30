'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TeleprompterSection {
  label?: string
  text: string
  delay: number
}

interface TeleprompterProps {
  sections: TeleprompterSection[]
  frequencyName: string
  hzValue: number
  dimmed?: boolean
}

export default function Teleprompter({ sections, frequencyName, hzValue, dimmed = false }: TeleprompterProps) {
  const [currentIndex, setCurrentIndex] = useState(-1) // -1 = showing title only
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let idx = 0

    const showNext = () => {
      if (idx < sections.length) {
        const delay = sections[idx].delay * 1000
        timerRef.current = setTimeout(() => {
          setCurrentIndex(idx)
          idx++
          showNext()
        }, delay)
      }
    }

    // Start after 3s for title to breathe
    timerRef.current = setTimeout(showNext, 3000)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [sections])

  const currentSection = currentIndex >= 0 ? sections[currentIndex] : null

  return (
    <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-60 transition-opacity duration-1000 ${dimmed ? 'opacity-20' : 'opacity-100'}`}>
      {/* Frequency title — always visible, moves up when content appears */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: currentSection ? -40 : 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="text-center mb-8"
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
          className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent mx-auto mt-6"
        />
      </motion.div>

      {/* Current section — only ONE visible at a time, fades in/out */}
      <div className="max-w-xl mx-auto text-center h-32 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentSection && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="space-y-3"
            >
              {currentSection.label && (
                <p className="text-xs tracking-[0.25em] uppercase text-cyan-400/40 font-medium"
                   style={{ fontFamily: 'var(--font-instrument), Georgia, serif' }}>
                  {currentSection.label}
                </p>
              )}
              <p className="text-lg md:text-xl leading-relaxed text-white/50 font-light"
                 style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                {currentSection.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section indicator dots */}
      {sections.length > 0 && (
        <div className="flex items-center gap-1.5 mt-8">
          {sections.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentIndex ? 'w-4 bg-cyan-400/40' : i < currentIndex ? 'w-1.5 bg-white/10' : 'w-1.5 bg-white/[0.04]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
