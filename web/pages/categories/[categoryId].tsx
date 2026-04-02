import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Session } from '@supabase/supabase-js'
import { FREQUENCY_CATEGORIES, FrequencyCategory, FrequencyProtocol } from '@/lib/frequency-protocols'
import { frequencyEngine } from '@/lib/frequency-engine'

interface CategoryPageProps {
  session: Session | null
}

export default function CategoryPage({ session }: CategoryPageProps) {
  const router = useRouter()
  const { categoryId } = router.query
  const [category, setCategory] = useState<FrequencyCategory | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [sessionTimer, setSessionTimer] = useState<number | null>(null)
  const [playbackTime, setPlaybackTime] = useState<number>(0)

  useEffect(() => {
    if (categoryId && typeof categoryId === 'string') {
      const foundCategory = FREQUENCY_CATEGORIES.find(c => c.id === categoryId)
      setCategory(foundCategory || null)
    }
  }, [categoryId])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (currentlyPlaying && sessionTimer) {
      interval = setInterval(() => {
        setPlaybackTime(prev => {
          const newTime = prev + 1
          if (newTime >= sessionTimer * 60) {
            stopFrequency()
            return 0
          }
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [currentlyPlaying, sessionTimer])

  const startFrequencySession = async (protocol: FrequencyProtocol) => {
    if (currentlyPlaying === protocol.id) {
      stopFrequency()
      return
    }

    if (!session) {
      // For demo purposes, allow 2-minute sessions without login
      startDemo(protocol)
      return
    }

    try {
      await frequencyEngine.startFrequency(protocol.frequency, protocol.waveType)
      frequencyEngine.fadeIn(2)
      setCurrentlyPlaying(protocol.id)
      setSessionTimer(protocol.duration)
      setPlaybackTime(0)

      // Auto-stop at session end
      setTimeout(() => {
        frequencyEngine.fadeOut(3)
        setTimeout(() => stopFrequency(), 3000)
      }, protocol.duration * 60 * 1000)

    } catch (error) {
      console.error('Failed to start frequency session:', error)
    }
  }

  const startDemo = async (protocol: FrequencyProtocol) => {
    try {
      await frequencyEngine.startFrequency(protocol.frequency, protocol.waveType)
      frequencyEngine.fadeIn(1)
      setCurrentlyPlaying(protocol.id)
      setSessionTimer(2) // 2-minute demo
      setPlaybackTime(0)

      // Auto-stop after 2 minutes
      setTimeout(() => {
        frequencyEngine.fadeOut(2)
        setTimeout(() => stopFrequency(), 2000)
      }, 120000)

    } catch (error) {
      console.error('Failed to start demo:', error)
    }
  }

  const stopFrequency = () => {
    frequencyEngine.stopFrequency()
    setCurrentlyPlaying(null)
    setSessionTimer(null)
    setPlaybackTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Category not found</h1>
          <Link href="/" className="frequency-button">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                ← Back
              </Link>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{category.icon}</div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{category.name}</h1>
                  <p className="text-sm text-slate-400">{category.description}</p>
                </div>
              </div>
            </div>
            {!session && (
              <Link href="/auth/signup" className="frequency-button text-sm">
                Unlock Full Sessions
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Current Session Display */}
      {currentlyPlaying && sessionTimer && (
        <div className="bg-gradient-to-r from-quantum-900/50 to-frequency-900/50 border-b border-quantum-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-medium">
                    🎵 Active Session: {category.protocols.find(p => p.id === currentlyPlaying)?.name}
                  </p>
                  <p className="text-sm text-slate-300">
                    {category.protocols.find(p => p.id === currentlyPlaying)?.frequency}Hz • 
                    {formatTime(playbackTime)} / {formatTime(sessionTimer * 60)}
                  </p>
                </div>
              </div>
              <button
                onClick={stopFrequency}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ⏹️ Stop
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-quantum-500 to-frequency-500 h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${(playbackTime / (sessionTimer * 60)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Protocols Grid */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {category.protocols.map((protocol) => (
              <div
                key={protocol.id}
                className={`category-card ${
                  currentlyPlaying === protocol.id ? 'border-quantum-500 bg-quantum-900/20' : ''
                }`}
              >
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {protocol.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                        <span className="bg-slate-800 px-2 py-1 rounded">
                          {protocol.frequency}Hz
                        </span>
                        <span>
                          {session ? `${protocol.duration} min` : '2 min demo'}
                        </span>
                        <span className="capitalize">{protocol.waveType}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-300 mb-4">{protocol.description}</p>

                  {/* Benefits */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {protocol.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="text-xs bg-healing-900/50 text-healing-300 px-2 py-1 rounded-full"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Scientific Basis */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-white mb-2">Scientific Basis:</h4>
                    <p className="text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg">
                      {protocol.scientificBasis}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => startFrequencySession(protocol)}
                      disabled={currentlyPlaying !== null && currentlyPlaying !== protocol.id}
                      className={`frequency-button flex-1 mr-4 ${
                        currentlyPlaying === protocol.id 
                          ? 'bg-red-600 hover:bg-red-500' 
                          : currentlyPlaying !== null 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                      }`}
                    >
                      {currentlyPlaying === protocol.id 
                        ? '⏹️ Stop Session' 
                        : currentlyPlaying !== null 
                        ? '🔒 Session Active'
                        : session
                        ? '▶️ Start Session'
                        : '▶️ Try Demo'
                      }
                    </button>
                    
                    {!session && (
                      <div className="text-center">
                        <p className="text-xs text-slate-400">
                          <Link href="/auth/signup" className="text-quantum-400 hover:text-quantum-300">
                            Sign up
                          </Link>
                          {' '}for full sessions
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Category Info */}
          <div className="mt-12 bg-slate-900/50 rounded-xl p-8 border border-slate-800">
            <h3 className="text-xl font-semibold text-white mb-4">
              About {category.name}
            </h3>
            <p className="text-slate-300 mb-6">
              {category.description}. These frequencies are designed to work synergistically 
              with your body's natural rhythms and cellular processes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl text-quantum-400 font-bold">
                  {category.protocols.length}
                </div>
                <p className="text-sm text-slate-400">Protocols Available</p>
              </div>
              <div>
                <div className="text-2xl text-frequency-400 font-bold">
                  {Math.round(category.protocols.reduce((sum, p) => sum + p.frequency, 0) / category.protocols.length)}Hz
                </div>
                <p className="text-sm text-slate-400">Average Frequency</p>
              </div>
              <div>
                <div className="text-2xl text-healing-400 font-bold">
                  {Math.round(category.protocols.reduce((sum, p) => sum + p.duration, 0) / category.protocols.length)}m
                </div>
                <p className="text-sm text-slate-400">Average Duration</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}