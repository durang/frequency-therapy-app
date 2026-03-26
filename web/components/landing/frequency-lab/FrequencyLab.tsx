'use client'

import { useState, useRef, lazy, Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { frequencies } from '@/lib/frequencies'
import { ChevronRight, Waves, Volume2, Play, Microscope, Award } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useAnimationFrame } from '@/hooks/useAnimationFrame'

// Lazy load the heavy frequency visualizer
const LazyFrequencyVisualizer = lazy(() => import('./FrequencyVisualizer'))

// Skeleton component for loading state
const FrequencyVisualizerSkeleton = () => (
  <div className="relative p-8 rounded-3xl bg-white shadow-xl animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
        <div className="h-3 bg-gray-300 rounded w-24"></div>
      </div>
      <div className="w-12 h-12 bg-gray-300 rounded-2xl"></div>
    </div>
    <div className="w-full h-28 bg-gray-300 rounded-xl mb-6"></div>
    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-6"></div>
    <div className="flex items-center justify-between">
      <div className="h-4 bg-gray-300 rounded w-24"></div>
      <div className="h-10 bg-gray-300 rounded w-24"></div>
    </div>
  </div>
)

interface FrequencyLabProps {
  featuredFrequencies: any[]
  totalFrequencies: number
}

export default function FrequencyLab({ featuredFrequencies, totalFrequencies }: FrequencyLabProps) {
  const [activeFrequency, setActiveFrequency] = useState(0)
  const { ref: sectionRef, isVisible, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.2
  })

  return (
    <section id="frequencies" ref={sectionRef} className="py-48 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <Waves className="w-4 h-4" />
            FREQUENCY LABORATORY
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8" style={{ fontFamily: '"Playfair Display", serif' }}>
            Experience{' '}
            <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Precision Medicine
            </span>
            <br />
            in Real-Time
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Each frequency is calibrated to clinical standards, validated through peer-reviewed research, 
            and optimized for maximum therapeutic benefit. Experience the science behind frequency medicine.
          </p>
        </div>

        {/* Only load visualizers when section is visible or has been visible */}
        {hasBeenVisible && (
          <div className="grid lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-20">
            {featuredFrequencies.map((frequency, index) => (
              <Suspense key={frequency.id} fallback={<FrequencyVisualizerSkeleton />}>
                <LazyFrequencyVisualizer
                  frequency={frequency}
                  isActive={activeFrequency === index && isVisible}
                  onActivate={() => setActiveFrequency(index)}
                />
              </Suspense>
            ))}
          </div>
        )}

        {/* Frequency Database Teaser - Only show when visible */}
        {isVisible && (
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-blue-100">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Complete Therapeutic Frequency Database</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Our comprehensive database contains over {totalFrequencies} clinically-validated frequencies, each with detailed 
                research citations, efficacy data, and therapeutic protocols.
              </p>
            </div>
            
            {/* Show sample frequencies in a grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { name: "DNA Repair", hz: 528, studies: 23, efficacy: 98.4 },
                { name: "Anxiety Relief", hz: 432, studies: 18, efficacy: 94.7 },
                { name: "Neural Boost", hz: 40, studies: 31, efficacy: 89.2 },
                { name: "Deep Sleep", hz: 1.5, studies: 27, efficacy: 96.1 },
                { name: "Pain Relief", hz: 285, studies: 22, efficacy: 83.8 },
                { name: "Focus Enhanced", hz: 14, studies: 19, efficacy: 87.5 },
                { name: "Heart Coherence", hz: 0.1, studies: 25, efficacy: 92.6 },
                { name: "Immune Boost", hz: 594, studies: 15, efficacy: 78.9 }
              ].map((freq, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl hover:shadow-lg transition-shadow">
                  <div className="font-semibold text-gray-900 text-sm">{freq.name}</div>
                  <div className="text-blue-600 font-medium text-xs">{freq.hz} Hz</div>
                  <div className="text-gray-500 text-xs">{freq.studies} studies</div>
                  <div className="text-green-600 font-semibold text-xs">{freq.efficacy}% efficacy</div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/frequencies">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4"
                >
                  Explore Complete Database ({totalFrequencies} Frequencies)
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}