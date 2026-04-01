'use client'

import { useState, useRef, lazy, Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { frequencies } from '@/lib/frequencies'
import { ChevronRight, Waves, Volume2, Play, Microscope, Award, Lock, Shield } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useAnimationFrame } from '@/hooks/useAnimationFrame'
import { motion } from 'framer-motion'

// Lazy load the heavy frequency visualizer
const LazyFrequencyVisualizer = lazy(() => import('./FrequencyVisualizer'))

// Skeleton component for loading state
const FrequencyVisualizerSkeleton = () => (
  <div className="relative p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-xl animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="h-6 bg-gray-300 dark:bg-slate-600 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-20 mb-1"></div>
        <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded w-24"></div>
      </div>
      <div className="w-12 h-12 bg-gray-300 dark:bg-slate-600 rounded-2xl"></div>
    </div>
    <div className="w-full h-28 bg-gray-300 dark:bg-slate-600 rounded-xl mb-6"></div>
    <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-3/4 mb-6"></div>
    <div className="flex items-center justify-between">
      <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-24"></div>
      <div className="h-10 bg-gray-300 dark:bg-slate-600 rounded w-24"></div>
    </div>
  </div>
)

interface FrequencyLabProps {
  featuredFrequencies: any[]
  totalFrequencies: number
  playingFrequency?: string | null
  onFrequencySelect?: (frequencyId: string) => void
  isEnabled?: boolean
  complianceProgress?: number
}

export default function FrequencyLab({ 
  featuredFrequencies, 
  totalFrequencies, 
  playingFrequency, 
  onFrequencySelect,
  isEnabled = true,
  complianceProgress = 1
}: FrequencyLabProps) {
  const [activeFrequency, setActiveFrequency] = useState(0)
  const { ref: sectionRef, isVisible, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.2
  })

  // Find the currently playing frequency index to sync visual state
  const playingIndex = playingFrequency 
    ? featuredFrequencies.findIndex(freq => freq.id === playingFrequency)
    : -1

  const handleFrequencyActivate = (index: number) => {
    if (!isEnabled) {
      console.warn('[FrequencyLab] Access denied - medical compliance not complete:', complianceProgress)
      return
    }

    const frequency = featuredFrequencies[index]
    setActiveFrequency(index)
    
    // Observability: Track frequency lab interactions
    console.log('[FrequencyLab] Frequency activated:', {
      index,
      frequencyId: frequency.id,
      name: frequency.name,
      hz: frequency.hz_value,
      wasPlaying: playingFrequency,
      complianceProgress: complianceProgress,
      enabled: isEnabled,
      timestamp: new Date().toISOString()
    })
    
    // If we have a frequency selection handler, use it for audio playback
    if (onFrequencySelect && frequency) {
      onFrequencySelect(frequency.id)
    }
  }

  return (
    <section id="frequency-lab" ref={sectionRef} className="py-48 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 relative">
      {/* Compliance overlay when not enabled */}
      {!isEnabled && (
        <motion.div 
          className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
              Frequencies Locked
            </h3>
            <p className="text-gray-600 dark:text-slate-300 mb-6">
              Read the medical and safety information above to access therapeutic frequencies.
            </p>
            <div className="bg-gray-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden mb-4">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${complianceProgress * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Compliance progress: {Math.round(complianceProgress * 100)}%
            </p>
          </div>
        </motion.div>
      )}

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <Waves className="w-4 h-4" />
            FREQUENCY LABORATORY
            {isEnabled && (
              <Shield className="w-4 h-4 text-green-600" />
            )}
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-slate-100 mb-8" style={{ fontFamily: '"Playfair Display", serif' }}>
            Experience{' '}
            <span className="bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Precision Medicine
            </span>
            <br />
            in Real-Time
          </h2>
          <p className="text-xl text-gray-700 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Each frequency is calibrated to clinical standards, validated through peer-reviewed research, 
            and optimized for maximum therapeutic benefit. Experience the science behind frequency medicine.
          </p>
        </div>

        {/* Only load visualizers when section is visible or has been visible */}
        {hasBeenVisible && (
          <div className="grid lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-20">
            {featuredFrequencies.map((frequency, index) => (
              <motion.div
                key={frequency.id}
                className={`transition-all duration-300 ${!isEnabled ? 'opacity-30 pointer-events-none' : ''}`}
                whileHover={isEnabled ? { scale: 1.02 } : {}}
                transition={{ duration: 0.2 }}
              >
                <Suspense fallback={<FrequencyVisualizerSkeleton />}>
                  <LazyFrequencyVisualizer
                    frequency={frequency}
                    isActive={(activeFrequency === index && isVisible && isEnabled) || (playingIndex === index)}
                    isPlaying={playingFrequency === frequency.id}
                    onActivate={() => handleFrequencyActivate(index)}
                  />
                </Suspense>
              </motion.div>
            ))}
          </div>
        )}

        {/* Frequency Database Teaser - Only show when visible */}
        {isVisible && (
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-blue-100 dark:border-slate-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">Complete Therapeutic Frequency Database</h3>
              <p className="text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
                Our comprehensive database contains over {totalFrequencies} clinically-validated frequencies, each with detailed 
                research citations, efficacy data, and therapeutic protocols.
              </p>
            </div>
            
            {/* Show sample frequencies in a grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { name: "Love Frequency", hz: 528, studies: 5, efficacy: 0 },
                { name: "Anxiety Relief", hz: 432, studies: 18, efficacy: 94.7 },
                { name: "Neural Boost", hz: 40, studies: 31, efficacy: 89.2 },
                { name: "Deep Sleep", hz: 1.5, studies: 27, efficacy: 96.1 },
                { name: "Pain Relief", hz: 285, studies: 22, efficacy: 83.8 },
                { name: "Focus Enhanced", hz: 14, studies: 19, efficacy: 87.5 },
                { name: "Heart Coherence", hz: 0.1, studies: 25, efficacy: 92.6 },
                { name: "Immune Boost", hz: 594, studies: 15, efficacy: 78.9 }
              ].map((freq, index) => (
                <motion.div 
                  key={index} 
                  className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-2xl hover:shadow-lg transition-shadow ${!isEnabled ? 'opacity-50' : ''}`}
                  whileHover={isEnabled ? { y: -2 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <div className="font-semibold text-gray-900 dark:text-slate-100 text-sm">{freq.name}</div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium text-xs">{freq.hz} Hz</div>
                  <div className="text-gray-500 dark:text-slate-400 text-xs">{freq.studies} studies</div>
                  <div className="text-green-600 dark:text-green-400 font-semibold text-xs">{freq.efficacy}% efficacy</div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/frequencies">
                <Button 
                  size="lg" 
                  className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 transition-all ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isEnabled}
                >
                  Explore Complete Database ({totalFrequencies} Frequencies)
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}