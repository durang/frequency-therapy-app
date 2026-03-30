'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { frequencies, getFrequencyById } from '@/lib/frequencies'
import AdvancedFrequencyAudioEngine, { AdvancedAudioConfig } from '@/lib/advanced-audio-engine'
import AdvancedAnalytics from '@/lib/advanced-analytics'
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Settings, 
  Heart,
  Brain,
  Activity,
  Zap,
  RotateCcw,
  ChevronLeft,
  Star,
  TrendingUp
} from 'lucide-react'

interface AdvancedFrequencyPlayerProps {
  selectedFrequencyId?: string
  onFrequencyChange?: (frequencyId: string) => void
  showAnalytics?: boolean
  autoStart?: boolean
}

export default function AdvancedFrequencyPlayer({
  selectedFrequencyId = '1',
  onFrequencyChange,
  showAnalytics = true,
  autoStart = false
}: AdvancedFrequencyPlayerProps) {
  const [currentFrequencyId, setCurrentFrequencyId] = useState(selectedFrequencyId)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [timeRemaining, setTimeRemaining] = useState(20 * 60) // 20 minutes in seconds
  const [sessionStarted, setSessionStarted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  // Biometric simulation
  const [heartRate, setHeartRate] = useState(72)
  const [stressLevel, setStressLevel] = useState(6)
  const [moodBefore, setMoodBefore] = useState<number | null>(null)
  const [moodAfter, setMoodAfter] = useState<number | null>(null)
  
  // Audio engine and analytics
  const audioEngineRef = useRef<AdvancedFrequencyAudioEngine | null>(null)
  const analyticsRef = useRef<AdvancedAnalytics | null>(null)
  const sessionIdRef = useRef<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const biometricTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Advanced settings
  const [audioConfig, setAudioConfig] = useState<AdvancedAudioConfig>({
    frequency: 528,
    volume: 0.7,
    waveform: 'sine',
    binauralBeat: {
      enabled: true,
      beatFrequency: 10,
      carrierLeft: 528,
      carrierRight: 538
    },
    neuralPhaseLocking: {
      enabled: true,
      targetBrainwave: 'alpha',
      harmonics: [1056, 1584, 2112]
    },
    adaptiveModulation: {
      enabled: true,
      heartRateSync: true,
      breathingSync: true,
      circadianSync: true
    },
    spatialAudio: {
      enabled: true,
      position: { x: 0, y: 0, z: 0 },
      movement: 'circular'
    }
  })

  const currentFrequency = getFrequencyById(currentFrequencyId)

  useEffect(() => {
    // Initialize analytics
    analyticsRef.current = new AdvancedAnalytics()

    // Auto-start if requested
    if (autoStart && !sessionStarted) {
      startSession()
    }

    return () => {
      stopSession()
    }
  }, [])

  useEffect(() => {
    if (currentFrequency) {
      const newConfig = { ...audioConfig }
      newConfig.frequency = currentFrequency.hz_value
      newConfig.binauralBeat!.carrierLeft = currentFrequency.hz_value
      newConfig.binauralBeat!.carrierRight = currentFrequency.hz_value + newConfig.binauralBeat!.beatFrequency
      setAudioConfig(newConfig)
      setTimeRemaining((currentFrequency?.duration_minutes || 20) * 60)
    }
  }, [currentFrequencyId])

  const startSession = async () => {
    if (!currentFrequency || !analyticsRef.current) return

    try {
      // Get pre-session mood
      if (moodBefore === null) {
        const mood = await getMoodRating('How are you feeling right now?')
        setMoodBefore(mood)
      }

      // Start analytics session
      sessionIdRef.current = analyticsRef.current.startSession({
        userId: '1', // This would come from auth
        frequencyId: currentFrequencyId,
        preSessionMood: moodBefore || 5,
        environment: {
          timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
          dayOfWeek: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()]
        }
      })

      // Create and start audio engine
      audioEngineRef.current = new AdvancedFrequencyAudioEngine(audioConfig)
      await audioEngineRef.current.play()

      setIsPlaying(true)
      setSessionStarted(true)

      // Start timers
      startTimer()
      startBiometricSimulation()

    } catch (error) {
      console.error('Failed to start session:', error)
      alert('Could not start audio session. Please check your device permissions.')
    }
  }

  const pauseSession = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.stop()
      audioEngineRef.current = null
    }
    setIsPlaying(false)
    stopTimer()
    stopBiometricSimulation()
  }

  const stopSession = async () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.destroy()
      audioEngineRef.current = null
    }
    
    setIsPlaying(false)
    stopTimer()
    stopBiometricSimulation()

    // End analytics session
    if (sessionIdRef.current && analyticsRef.current && sessionStarted) {
      const mood = await getMoodRating('How are you feeling now?')
      setMoodAfter(mood)

      analyticsRef.current.endSession(sessionIdRef.current, {
        postSessionMood: mood,
        perceivedEffectiveness: Math.round(Math.random() * 3 + 7), // 7-10 simulation
        qualitativeNotes: 'Completed session'
      })
    }

    // Reset for next session
    setSessionStarted(false)
    setTimeRemaining((currentFrequency?.duration_minutes || 20) * 60)
    sessionIdRef.current = null
  }

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          stopSession()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startBiometricSimulation = () => {
    biometricTimerRef.current = setInterval(() => {
      // Simulate realistic biometric changes during therapy
      setHeartRate(prev => {
        const newRate = prev + (Math.random() - 0.5) * 4
        const targetRate = 65 // Therapy typically lowers heart rate
        return Math.max(55, Math.min(85, newRate + (targetRate - newRate) * 0.05))
      })

      setStressLevel(prev => {
        const newStress = prev + (Math.random() - 0.6) * 0.5 // Slight downward bias
        return Math.max(1, Math.min(10, newStress))
      })

      // Record biometrics to analytics
      if (analyticsRef.current && sessionIdRef.current) {
        analyticsRef.current.recordBiometric('heartRate', heartRate, sessionIdRef.current)
        analyticsRef.current.updateSession(sessionIdRef.current, {
          // Update session with current biometrics
        })
      }
    }, 2000) // Update every 2 seconds
  }

  const stopBiometricSimulation = () => {
    if (biometricTimerRef.current) {
      clearInterval(biometricTimerRef.current)
      biometricTimerRef.current = null
    }
  }

  const getMoodRating = (question: string): Promise<number> => {
    return new Promise((resolve) => {
      const rating = parseInt(prompt(`${question} (1-10 scale)`) || '5')
      resolve(Math.max(1, Math.min(10, rating)))
    })
  }

  const updateAudioConfig = (updates: Partial<AdvancedAudioConfig>) => {
    const newConfig = { ...audioConfig, ...updates }
    setAudioConfig(newConfig)
    
    if (audioEngineRef.current) {
      if (updates.volume !== undefined) {
        audioEngineRef.current.updateVolume(updates.volume)
      }
      if (updates.frequency !== undefined) {
        audioEngineRef.current.updateFrequency(updates.frequency)
      }
    }
  }

  const changeFrequency = (frequencyId: string) => {
    if (isPlaying) {
      pauseSession()
    }
    setCurrentFrequencyId(frequencyId)
    onFrequencyChange?.(frequencyId)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = currentFrequency 
    ? (((currentFrequency.duration_minutes || 20) * 60 - timeRemaining) / ((currentFrequency.duration_minutes || 20) * 60)) * 100
    : 0

  if (!currentFrequency) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">Frequency not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Player */}
      <Card className="overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {sessionStarted ? 'Session Active' : 'Ready to Start'}
            </span>
          </div>
          <CardTitle className="text-2xl mb-2">{currentFrequency.name}</CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{currentFrequency.description}</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-quantum-primary" />
              <span>{currentFrequency.hz_value} Hz</span>
            </div>
            <div className="flex items-center gap-1">
              <RotateCcw className="w-4 h-4 text-quantum-primary" />
              <span>{currentFrequency.duration_minutes} min</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          {/* Progress Circle */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 144 144">
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 64}`}
                strokeDashoffset={`${2 * Math.PI * 64 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(progress)}% Complete
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => changeFrequency(currentFrequencyId === '1' ? '2' : '1')}
              disabled={isPlaying}
              className="w-12 h-12 p-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              onClick={isPlaying ? pauseSession : startSession}
              size="lg"
              className="w-16 h-16 rounded-full bg-gradient-to-r from-quantum-primary to-quantum-secondary hover:shadow-lg transition-all duration-200"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={stopSession}
              disabled={!sessionStarted}
              className="w-12 h-12 p-0"
            >
              <Square className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-4 mb-6">
            <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value)
                setVolume(newVolume)
                updateAudioConfig({ volume: newVolume })
              }}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Settings Toggle */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-600 dark:text-gray-400"
            >
              <Settings className="w-4 h-4 mr-2" />
              Advanced Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Audio Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Waveform Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Waveform Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['sine', 'square', 'triangle', 'sawtooth'].map((waveform) => (
                  <Button
                    key={waveform}
                    variant={audioConfig.waveform === waveform ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => updateAudioConfig({ waveform: waveform as any })}
                    className="capitalize"
                  >
                    {waveform}
                  </Button>
                ))}
              </div>
            </div>

            {/* Binaural Beats */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Binaural Beats
                </label>
                <input
                  type="checkbox"
                  checked={audioConfig.binauralBeat?.enabled}
                  onChange={(e) => updateAudioConfig({
                    binauralBeat: { ...audioConfig.binauralBeat!, enabled: e.target.checked }
                  })}
                  className="rounded"
                />
              </div>
              {audioConfig.binauralBeat?.enabled && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Beat Frequency:</span>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={audioConfig.binauralBeat.beatFrequency}
                    onChange={(e) => updateAudioConfig({
                      binauralBeat: { 
                        ...audioConfig.binauralBeat!, 
                        beatFrequency: parseInt(e.target.value) 
                      }
                    })}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                    {audioConfig.binauralBeat.beatFrequency}Hz
                  </span>
                </div>
              )}
            </div>

            {/* Spatial Audio */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  3D Spatial Audio
                </label>
                <input
                  type="checkbox"
                  checked={audioConfig.spatialAudio?.enabled}
                  onChange={(e) => updateAudioConfig({
                    spatialAudio: { ...audioConfig.spatialAudio!, enabled: e.target.checked }
                  })}
                  className="rounded"
                />
              </div>
              {audioConfig.spatialAudio?.enabled && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Movement Pattern:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {['static', 'circular', 'pendulum', 'spiral'].map((movement) => (
                      <Button
                        key={movement}
                        variant={audioConfig.spatialAudio?.movement === movement ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => updateAudioConfig({
                          spatialAudio: { ...audioConfig.spatialAudio!, movement: movement as any }
                        })}
                        className="capitalize"
                      >
                        {movement}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Biometrics */}
      {showAnalytics && sessionStarted && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(heartRate)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">BPM</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Brain className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stressLevel.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Stress Level</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {moodBefore && moodAfter ? `+${moodAfter - moodBefore}` : '--'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Mood Change</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Frequency Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-quantum-primary" />
            Scientific Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">{currentFrequency.scientific_backing}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Benefits:</h4>
                <ul className="space-y-1">
                  {currentFrequency.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-quantum-primary rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Best For:</h4>
                <ul className="space-y-1">
                  {currentFrequency.best_for.map((use, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
