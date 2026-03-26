'use client'

import { useScroll, useSpring, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface ScrollProgressProps {
  className?: string
  showPercentage?: boolean
  height?: number
}

export default function ScrollProgress({ 
  className = '', 
  showPercentage = false,
  height = 4
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  
  // Smooth spring animation for scroll progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Transform scrollYProgress to percentage for display
  const percentage = useSpring(0, {
    stiffness: 100,
    damping: 30
  })

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      percentage.set(Math.round(latest * 100))
    })
  }, [scrollYProgress, percentage])

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      {/* Progress bar background */}
      <div 
        className="w-full bg-white/10 backdrop-blur-sm"
        style={{ height: `${height}px` }}
      >
        {/* Animated progress fill */}
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 origin-left"
          style={{ 
            scaleX,
            height: `${height}px`
          }}
        />
      </div>
      
      {/* Optional percentage display */}
      {showPercentage && (
        <motion.div
          className="absolute top-2 right-4 text-sm font-medium text-white/80 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.span>{percentage}</motion.span>%
        </motion.div>
      )}
    </div>
  )
}

// Scroll indicator with custom styling
export function ScrollIndicator({ className = '' }: { className?: string }) {
  const { scrollYProgress } = useScroll()
  
  return (
    <motion.div
      className={`fixed top-4 right-4 w-16 h-16 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center z-40 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <svg className="w-8 h-8" viewBox="0 0 36 36">
        {/* Background circle */}
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
        />
        {/* Progress circle */}
        <motion.path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            pathLength: scrollYProgress,
            strokeDasharray: "100 100"
          }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}